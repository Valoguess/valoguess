import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import { useGameStore } from "@/store/gameStore";
import {
  askQuestion as sendAskQuestion,
  answerQuestion as sendAnswerQuestion,
  consumeNo,
  submitGuess,
  leaveGame,
} from "@/socket/emitter";
import { GuessAgentGameDTO, GuessAgentPlayerDTO, PendingQuestion } from "@/types/game";
import { QuestionItem } from "@/lib/data";
import { toast } from "sonner";

interface UsePlaySocketProps {
  game: GuessAgentGameDTO | null;
  myPlayer?: GuessAgentPlayerDTO;
  isMyTurn: boolean;
  pendingQuestion?: PendingQuestion;
  isOpponentAskingMe: boolean;
  isFreeform: boolean;
}

export function usePlaySocket({
  game,
  myPlayer,
  isMyTurn,
  pendingQuestion,
  isOpponentAskingMe,
  isFreeform,
}: UsePlaySocketProps) {
  const router = useRouter();
  const { clearGame } = useGameStore();

  const [isAsking, setIsAsking] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isConsumingNo, setIsConsumingNo] = useState(false);

  const pathname = usePathname();

  // Reset asking/answering flags when game turns progress
  useEffect(() => {
    setIsAsking(false);
    setIsAnswering(false);
  }, [game?.state?.turnNumber, game?.state?.pendingQuestion]);

  // Listen to ServerEvents.GAME_END
  useEffect(() => {
    const handleGameEnd = (endedGame: GuessAgentGameDTO) => {
      if (endedGame) {
        useGameStore.getState().setGame(endedGame);
      }
    };
    socket.on(ServerEvents.GAME_END, handleGameEnd);
    return () => {
      socket.off(ServerEvents.GAME_END, handleGameEnd);
    };
  }, []);

  // Listen to ServerEvents.GAME_SYNC for server cleanup to lobby
  useEffect(() => {
    const handleGameSync = (syncedGame: GuessAgentGameDTO | null) => {
      if (!syncedGame || (typeof syncedGame === "object" && !syncedGame.id)) {
        if (pathname.startsWith("/play")) {
          toast.error("Game not found. Redirecting to lobby.");
          router.push("/lobby");
        }
        clearGame();
      }
    };
    socket.on(ServerEvents.GAME_SYNC, handleGameSync);
    return () => {
      socket.off(ServerEvents.GAME_SYNC, handleGameSync);
    };
  }, [router]);

  // Listen to ServerEvents.ERROR
  useEffect(() => {
    const onError = (err: any) => {
      setIsAsking(false);
      setIsAnswering(false);
      const msg = err?.message || "An error occurred";
      toast.error(msg);
    };
    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, []);

  const handleAskQuestion = useCallback(
    (q: QuestionItem) => {
      if (game && isMyTurn && !pendingQuestion && !isAsking) {
        setIsAsking(true);
        sendAskQuestion(q.id);
      }
    },
    [game, isMyTurn, pendingQuestion, isAsking]
  );

  const handleAnswerQuestion = useCallback(
    (answer: "yes" | "no") => {
      if (game && isOpponentAskingMe && !isAnswering) {
        setIsAnswering(true);
        sendAnswerQuestion(answer.toUpperCase() as "YES" | "NO");
      }
    },
    [game, isOpponentAskingMe, isAnswering]
  );

  const handleConsumeNo = useCallback(() => {
    if (!isConsumingNo && (myPlayer?.state?.nosRemaining ?? 0) > 0) {
      setIsConsumingNo(true);
      consumeNo();
      setTimeout(() => setIsConsumingNo(false), 600);
    }
  }, [isConsumingNo, myPlayer?.state?.nosRemaining]);

  const handleGuessConfirm = useCallback(
    (agentId: string) => {
      if (!game) return;
      if (isFreeform) {
        if ((myPlayer?.state?.guessesRemaining ?? 0) <= 0) return;
      } else {
        if (!isMyTurn) return;
      }
      submitGuess(agentId);
    },
    [game, isFreeform, isMyTurn, myPlayer?.state?.guessesRemaining]
  );

  const handleLeaveGame = useCallback(() => {
    leaveGame();
    clearGame();
    router.replace("/lobby");
  }, [clearGame, router]);

  return {
    isAsking,
    isAnswering,
    isConsumingNo,
    handleAskQuestion,
    handleAnswerQuestion,
    handleConsumeNo,
    handleGuessConfirm,
    handleLeaveGame,
  };
}
