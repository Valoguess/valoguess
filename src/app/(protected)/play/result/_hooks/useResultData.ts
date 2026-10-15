import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { useAuthStore } from "@/store/authStore";
import { AGENTS, Agent, getAgentById, getQuestionLabel } from "@/lib/data";

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

  const cachedSecretAgent =
    typeof window !== "undefined" && game?.id
      ? sessionStorage.getItem(`secret_agent_${game.id}`)
      : null;

  const myPlayer =
    (user?.id ? game?.players.find((p) => p.id === user.id) : undefined) ||
    (cachedSecretAgent
      ? game?.players.find((p) => p.state?.secretAgent === cachedSecretAgent)
      : undefined) ||
    game?.players[0];

  const oppPlayer =
    game?.players.find((p) => p.id !== myPlayer?.id) ||
    (game?.players && game.players.length > 1 ? game.players[1] : undefined);

  const gameState = game?.state;
  const rawResult = (gameState?.result ?? game?.result) as any;
  const resolvedWinnerId =
    rawResult?.winnerId ??
    rawResult?.winner ??
    (gameState as any)?.winnerId ??
    (game as any)?.winnerId ??
    null;

  const resultType = (
    typeof rawResult === "string"
      ? rawResult
      : rawResult?.result ?? (resolvedWinnerId ? "WIN" : "TIE")
  ).toUpperCase();

  const isTie = resultType === "TIE" || resultType === "DRAW";
  const myId = user?.id || myPlayer?.id;
  const isVictory = isTie
    ? false
    : resolvedWinnerId
      ? Boolean(resolvedWinnerId === myId || (myPlayer?.id && resolvedWinnerId === myPlayer.id))
      : searchParams.get("status") === "victory";

  const isDefeat = !isVictory && !isTie;

  const myAgentId =
    myPlayer?.state?.secretAgent || cachedSecretAgent || "cypher";
  const myAgentObj: Agent = getAgentById(myAgentId);

  const oppAgentId =
    oppPlayer?.state?.secretAgent ||
    (myAgentId && game?.players && game.players.length > 1
      ? game.players.find((p) => p.state?.secretAgent && p.state.secretAgent !== myAgentId)?.state?.secretAgent
      : null) ||
    "raze";
  const oppAgentObj: Agent = getAgentById(oppAgentId);

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

  if (isTie) {
    timeline.push({
      id: "match-end-tie",
      kind: "system-win",
      actor: "system",
      text: "Match ended in a DRAW — all guesses exhausted",
      time: timeTaken,
    });
  } else if (resultType === "WIN" || isVictory || isDefeat) {
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
