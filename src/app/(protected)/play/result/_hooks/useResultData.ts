import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useAuthStore } from "@/store/authStore";
import { AGENTS, Agent, getQuestionLabel } from "@/lib/data";

export interface TimelineEvent {
  id: string;
  kind: "asked" | "answered-yes" | "answered-no" | "guessed" | "system-win" | "system-lose";
  actor: "you" | "opponent" | "system";
  text: string;
  time: string;
}

export function useResultData() {
  const searchParams = useSearchParams();
  const { game, clearGame } = useGameStore();
  const { user } = useAuthStore();

  const myPlayer =
    game?.players.find((p) => p.id === user?.id) || game?.players[0];
  const oppPlayer = game?.players.find((p) => p.id !== myPlayer?.id);

  const gameState = game?.state;
  const gameResult = gameState?.result ?? game?.result;

  const isVictory = gameResult
    ? gameResult.result === "WIN" && gameResult.winnerId === myPlayer?.id
    : searchParams.get("status") === "victory";

  const isTie = gameResult?.result === "TIE";
  const isDefeat = !isVictory && !isTie;

  const cachedSecretAgent =
    typeof window !== "undefined" && game
      ? sessionStorage.getItem(`secret_agent_${game.id}`)
      : null;

  const myAgentId =
    myPlayer?.state?.secretAgent || cachedSecretAgent || "cypher";
  const myAgentObj: Agent =
    AGENTS.find((a) => a.id === myAgentId) || {
      id: myAgentId,
      name: myAgentId,
      role: "Sentinel",
    };

  const oppAgentId = oppPlayer?.state?.secretAgent || "raze";
  const oppAgentObj: Agent =
    AGENTS.find((a) => a.id === oppAgentId) || {
      id: oppAgentId,
      name: oppAgentId,
      role: "Duelist",
    };

  const userName = myPlayer?.name || user?.name || "You";
  const oppName = oppPlayer?.name || "Opponent";

  const roundsPlayed = Math.max(
    1,
    Math.ceil((gameState?.turnNumber ?? game?.turnNumber ?? 1) / 2)
  );
  const history = gameState?.history ?? game?.history ?? [];
  const totalQuestions = history.length;
  const maxNos = game?.settings?.maxNos ?? 5;

  const userNosUsed =
    maxNos === -1
      ? history.filter(
          (h) => h.askedBy !== myPlayer?.id && h.answer.toUpperCase() === "NO"
        ).length
      : Math.max(0, maxNos - (myPlayer?.state?.nosRemaining ?? maxNos));

  const opponentNosUsed =
    maxNos === -1
      ? history.filter(
          (h) => h.askedBy === myPlayer?.id && h.answer.toUpperCase() === "NO"
        ).length
      : Math.max(0, maxNos - (oppPlayer?.state?.nosRemaining ?? maxNos));

  const guessesMade = myPlayer?.state?.guess ? 1 : 0;
  const accuracy = isVictory ? "100%" : "0%";

  let timeTaken = "Live Match";
  const startedAt = gameState?.startedAt ?? game?.startedAt;
  const endedAt = gameState?.endedAt ?? game?.endedAt;
  if (startedAt && endedAt) {
    const diffMs = Math.max(0, endedAt - startedAt);
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    timeTaken = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const timeline: TimelineEvent[] = history.flatMap((h, i) => {
    const isMyQuestion = h.askedBy === myPlayer?.id;
    const qLabel = getQuestionLabel(h.questionId);
    const timeStr = new Date(h.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isYes = h.answer.toUpperCase() === "YES";
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
        kind: isYes ? "answered-yes" : "answered-no",
        actor: isMyQuestion ? "opponent" : "you",
        text: isYes ? "Yes" : "No",
        time: timeStr,
      },
    ];
  });

  if (gameResult?.result === "TIE") {
    timeline.push({
      id: "match-end-tie",
      kind: "system-win",
      actor: "system",
      text: "Match ended in a DRAW — all guesses exhausted",
      time: timeTaken,
    });
  } else if (gameResult?.result === "WIN") {
    timeline.push({
      id: "match-end-win",
      kind: isVictory ? "system-win" : "system-lose",
      actor: "system",
      text: isVictory
        ? `${userName} unmasked ${oppAgentObj.name.toUpperCase()} — VICTORY`
        : `${oppName} unmasked ${myAgentObj.name.toUpperCase()} — DEFEAT`,
      time: timeTaken,
    });
  }

  return {
    game,
    clearGame,
    myPlayer,
    oppPlayer,
    myAgentObj,
    oppAgentObj,
    userName,
    oppName,
    isVictory,
    isTie,
    isDefeat,
    roundsPlayed,
    totalQuestions,
    maxNos,
    userNosUsed,
    opponentNosUsed,
    guessesMade,
    accuracy,
    timeTaken,
    timeline,
  };
}
