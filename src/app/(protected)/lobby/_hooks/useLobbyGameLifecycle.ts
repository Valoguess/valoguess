import { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import { useGameStore } from "@/store/gameStore";
import { createGame, startGame } from "@/socket/emitter";
import { Party } from "@/types/party";
import { GuessAgentQuestionMode } from "@/types/game";

interface UseLobbyGameLifecycleProps {
  party: Party | null;
  isHost: boolean;
  opponentId?: string;
  questionMode: GuessAgentQuestionMode;
  timer: number;
  maxNos: number;
  maxGuesses: number;
  questionCount: number;
  onSetErrorMsg: (msg: string) => void;
  onSetIsCreatingOrJoining: (val: boolean) => void;
}

export function useLobbyGameLifecycle({
  party,
  isHost,
  opponentId,
  questionMode,
  timer,
  maxNos,
  maxGuesses,
  questionCount,
  onSetErrorMsg,
  onSetIsCreatingOrJoining,
}: UseLobbyGameLifecycleProps) {
  const router = useRouter();
  const { game, clearGame } = useGameStore();
  const startedGameRef = useRef<string | null>(null);

  // Clear any finished or waiting stale game state on lobby entry
  useEffect(() => {
    if (game && (game.status === "FINISHED" || game.status === "WAITING")) {
      clearGame();
    }
  }, []);

  // Game lifecycle handling
  useEffect(() => {
    if (!game) return;

    if (isHost && game.status === "WAITING") {
      if (startedGameRef.current !== game.id) {
        startedGameRef.current = game.id;
        startGame();
      }
      return;
    }

    if (game.status === "STARTING" || game.status === "PLAYING") {
      router.push("/play");
    }
  }, [game, isHost, router]);

  // Socket error handler
  useEffect(() => {
    const onError = (err: any) => {
      onSetIsCreatingOrJoining(false);
      startedGameRef.current = null;
      if (err?.code === "GAME_ALREADY_STARTED" && game?.id) {
        router.push("/play");
        return;
      }
      onSetErrorMsg(err?.message || "An error occurred");
      setTimeout(() => onSetErrorMsg(""), 4000);
    };

    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, [game?.id, onSetErrorMsg, onSetIsCreatingOrJoining, router]);

  // Start game handler (Party Leader only, 2 players required)
  const handleStartGame = useCallback(() => {
    if (!party?.id || !isHost || !opponentId) return;

    if (game?.id && game.status === "WAITING") {
      if (startedGameRef.current !== game.id) {
        startedGameRef.current = game.id;
        startGame();
      }
      return;
    }

    startedGameRef.current = null;
    createGame({
      questionMode: questionMode ?? "PRESET",
      timePerRound: timer,
      maxNos,
      maxGuesses,
      questionCount,
    });
  }, [party?.id, isHost, opponentId, game?.id, game?.status, questionMode, timer, maxNos, maxGuesses, questionCount]);

  return {
    handleStartGame,
  };
}
