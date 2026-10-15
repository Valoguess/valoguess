import { useMemo } from "react";
import { GuessAgentGameDTO } from "@/types/game";
import { StoreUser } from "@/store/authStore";
import {
  AGENTS,
  ALL_QUESTIONS,
  getAgentById,
  getQuestionById,
  getQuestionLabel,
  ActivityEntry,
  QuestionItem,
  Agent,
} from "@/lib/data";

interface UsePlayStateProps {
  game: GuessAgentGameDTO | null;
  user: StoreUser | null;
}

export function usePlayState({ game, user }: UsePlayStateProps) {
  const cachedSecretAgent =
    typeof window !== "undefined" && game?.id
      ? sessionStorage.getItem(`secret_agent_${game.id}`)
      : null;

  const myPlayer = useMemo(() => {
    if (!game?.players || game.players.length === 0) return undefined;

    // 1. Primary: match strictly by authenticated user ID
    if (user?.id) {
      const byUserId = game.players.find((p) => p.id === user.id);
      if (byUserId) return byUserId;
    }

    // 2. Secondary: match by cached secret agent assigned to this client at start
    if (cachedSecretAgent) {
      const byCachedAgent = game.players.find(
        (p) => p.state?.secretAgent === cachedSecretAgent
      );
      if (byCachedAgent) return byCachedAgent;
    }

    // 3. Fallback during live match only (before match ends and both secret agents are revealed)
    if (game.status !== "FINISHED") {
      const withRevealedAgent = game.players.find(
        (p) => p.state && p.state.secretAgent !== null
      );
      if (withRevealedAgent) return withRevealedAgent;
    }

    return game.players[0];
  }, [game?.players, game?.status, user?.id, cachedSecretAgent]);

  const opponentPlayer = useMemo(() => {
    return (
      game?.players.find((p) => p.id !== myPlayer?.id) ||
      (game?.players && game.players.length > 1 ? game.players[1] : undefined)
    );
  }, [game?.players, myPlayer?.id]);

  const gameState = game?.state;
  const isMyTurn = Boolean(myPlayer?.state?.isMyTurn);
  const pendingQuestion = gameState?.pendingQuestion ?? game?.pendingQuestion;
  const isOpponentAskingMe = pendingQuestion?.targetPlayer === myPlayer?.id;
  const isIWaitingForAnswer = pendingQuestion?.askedBy === myPlayer?.id;
  const isFreeform = game?.settings?.questionMode === "FREEFORM";

  const turnOwner: "you" | "opponent" | "opponent-thinking" | "freeform" = isFreeform
    ? "freeform"
    : isOpponentAskingMe
      ? "opponent"
      : isMyTurn
        ? "you"
        : "opponent-thinking";

  const secretAgentId = myPlayer?.state?.secretAgent || cachedSecretAgent;
  const activeSecretAgent: Agent = getAgentById(secretAgentId);

  const questionPoolIds = game?.settings?.questionPool || [];
  const gameQuestions: QuestionItem[] = useMemo(() => {
    if (questionPoolIds.length > 0) {
      return questionPoolIds.map(
        (id) =>
          getQuestionById(id) || {
            id,
            label: id,
            category: "utility" as const,
            difficulty: "low" as const,
          }
      );
    }
    return ALL_QUESTIONS.slice(0, game?.settings?.questionCount || 15);
  }, [questionPoolIds, game?.settings?.questionCount]);

  const opponentQuestionObj = useMemo(() => {
    if (!pendingQuestion) return null;
    return (
      getQuestionById(pendingQuestion.questionId) || {
        id: pendingQuestion.questionId,
        label: pendingQuestion.questionId,
        category: "utility" as const,
        difficulty: "low" as const,
        description: `Characteristic: "${pendingQuestion.questionId}"`,
      }
    );
  }, [pendingQuestion]);

  const gameHistory = gameState?.history ?? game?.history ?? [];
  const askedQuestionsMap: Record<string, "yes" | "no"> = useMemo(() => {
    const map: Record<string, "yes" | "no"> = {};
    gameHistory.forEach((h) => {
      if (h.askedBy === myPlayer?.id) {
        map[h.questionId] = h.answer.toLowerCase() as "yes" | "no";
      }
    });
    return map;
  }, [gameHistory, myPlayer?.id]);

  const activity: ActivityEntry[] = useMemo(() => {
    return gameHistory.flatMap((h, i) => {
      const isMyQuestion = h.askedBy === myPlayer?.id;
      const qLabel = getQuestionLabel(h.questionId);
      const timeStr = new Date(h.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return [
        {
          id: `${i}-ask`,
          kind: "asked",
          actor: isMyQuestion ? "you" : "opponent",
          text: `${qLabel}?`,
          time: timeStr,
        },
        {
          id: `${i}-ans`,
          kind: h.answer === "YES" ? "answered-yes" : "answered-no",
          actor: isMyQuestion ? "opponent" : "you",
          text: h.answer === "YES" ? "Yes" : "No",
          time: timeStr,
        },
      ];
    });
  }, [gameHistory, myPlayer?.id]);

  const turnNumber = gameState?.turnNumber ?? game?.turnNumber ?? 1;
  const currentRound = Math.max(1, Math.ceil(turnNumber / 2));

  const nosMax = game?.settings?.maxNos ?? 5;
  const userNosUsed = Math.max(
    0,
    nosMax - (myPlayer?.state?.nosRemaining ?? nosMax)
  );
  const opponentNosUsed = Math.max(
    0,
    nosMax - (opponentPlayer?.state?.nosRemaining ?? nosMax)
  );

  return {
    myPlayer,
    opponentPlayer,
    isMyTurn,
    pendingQuestion,
    isOpponentAskingMe,
    isIWaitingForAnswer,
    isFreeform,
    turnOwner,
    secretAgentId,
    activeSecretAgent,
    gameQuestions,
    opponentQuestionObj,
    askedQuestionsMap,
    activity,
    currentRound,
    nosMax,
    userNosUsed,
    opponentNosUsed,
  };
}
