"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { GameHeader } from "./_components/GameHeader";
import { SecretAgentCard } from "./_components/SecretAgentCard";
import { QuestionPanel } from "./_components/QuestionPanel";
import { FreeformTurnPanel } from "./_components/FreeformTurnPanel";
import { AgentGrid } from "./_components/AgentGrid";
import { AgentGuessModal } from "./_components/AgentGuessModal";
import { ActivityFeed } from "./_components/ActivityFeed";
import { MatchIntroOverlay } from "./_components/MatchIntroOverlay";
import { MatchEndingOverlay } from "./_components/MatchEndingOverlay";
import { LeaveGameDialog } from "./_components/LeaveGameDialog";
import { PlayLoadingScreen } from "./_components/PlayLoadingScreen";
import { OpponentQuestionPrompt } from "./_components/OpponentQuestionPrompt";
import { PartyChatOverlay } from "@/components/chat/PartyChatOverlay";
import { useRoomTimer } from "@/hooks/useRoomTimer";
import { useGameStore } from "@/store/gameStore";
import { useTempResultStore } from "@/store/tempResultStore";
import { useAuthStore } from "@/store/authStore";
import { usePlayState } from "./_hooks/usePlayState";
import { usePlaySocket } from "./_hooks/usePlaySocket";

function PlayContent() {
  const router = useRouter();
  const { game, hydrated: gameHydrated } = useGameStore();
  const { user } = useAuthStore();

  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set());

  // Room timer hook
  const { timeLeft, formattedTime, isInfinite } = useRoomTimer({ game });

  // Game state derivation hook
  const {
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
  } = usePlayState({ game, user });

  // Socket actions & listeners hook
  const {
    isAsking,
    isAnswering,
    isConsumingNo,
    handleAskQuestion,
    handleAnswerQuestion,
    handleConsumeNo,
    handleGuessConfirm,
    handleLeaveGame,
  } = usePlaySocket({
    game,
    myPlayer,
    isMyTurn,
    pendingQuestion,
    isOpponentAskingMe,
    isFreeform,
  });

  // Restore intro state from session if already seen
  useEffect(() => {
    if (typeof window !== "undefined" && game?.id) {
      const seen = sessionStorage.getItem(`intro_seen_${game.id}`) === "true";
      if (seen && game.status === "PLAYING") {
        setHasCompletedIntro(true);
      }
    }
  }, [game?.id, game?.status]);

  // Navigate to lobby if no active match
  useEffect(() => {
    if (!gameHydrated) return;
    if (!game) {
      router.replace("/lobby");
    }
  }, [game, gameHydrated, router]);

  // Handle elimination card toggling
  const handleToggleEliminated = (id: string) => {
    setEliminatedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 1. Loading screen
  if (!gameHydrated || !game || !myPlayer) {
    return <PlayLoadingScreen label={!gameHydrated ? "Loading Game..." : "Returning to Lobby..."} />;
  }

  // 2. Match Intro Overlay
  if (!hasCompletedIntro || game.status === "STARTING") {
    return (
      <MatchIntroOverlay
        secretAgentId={secretAgentId}
        userName={myPlayer.name || user?.name || "You"}
        opponentName={opponentPlayer?.name || "Opponent"}
        gameStatus={game.status}
        startingAt={game.startingAt}
        startingEndsAt={game.startingEndsAt}
        onComplete={() => {
          setHasCompletedIntro(true);
          if (game?.id) {
            sessionStorage.setItem(`intro_seen_${game.id}`, "true");
          }
        }}
      />
    );
  }

  // 3. Match Ending Sequence Overlay
  if (game.status === "FINISHED") {
    const rawResult = (game.state?.result ?? game.result) as any;
    const resolvedWinnerId =
      rawResult?.winnerId ??
      rawResult?.winner ??
      (game.state as any)?.winnerId ??
      (game as any)?.winnerId ??
      null;

    const resultType = (
      typeof rawResult === "string"
        ? rawResult
        : rawResult?.result ?? (resolvedWinnerId ? "WIN" : "TIE")
    ).toUpperCase();

    const isTie = resultType === "TIE" || resultType === "DRAW";
    const myId = user?.id || myPlayer?.id;
    const isVictory = Boolean(
      !isTie &&
        resolvedWinnerId &&
        (resolvedWinnerId === myId || (myPlayer?.id && resolvedWinnerId === myPlayer.id))
    );

    const opponentMember =
      opponentPlayer ||
      (myPlayer?.id ? game.players.find((p) => p.id !== myPlayer.id) : undefined) ||
      game.players[1];

    const myAgentKey =
      secretAgentId ||
      myPlayer?.state?.secretAgent ||
      (typeof window !== "undefined" && game.id
        ? sessionStorage.getItem(`secret_agent_${game.id}`)
        : null);

    const oppAgentKey =
      opponentMember?.state?.secretAgent ||
      (myAgentKey && game.players.length > 1
        ? game.players.find((p) => p.state?.secretAgent && p.state.secretAgent !== myAgentKey)?.state?.secretAgent
        : null);

    return (
      <MatchEndingOverlay
        isVictory={isVictory}
        isTie={isTie}
        userName={myPlayer?.name || user?.name || "You"}
        opponentName={opponentMember?.name || "Opponent"}
        myAgentId={myAgentKey}
        oppAgentId={oppAgentKey}
        roundsPlayed={Math.max(
          1,
          Math.ceil((game.state?.turnNumber ?? game.turnNumber ?? 1) / 2)
        )}
        onComplete={() => {
          useTempResultStore.getState().setTempResultGame(game);
          useGameStore.getState().clearGame();
          router.replace("/game");
        }}
      />
    );
  }

  // 4. Main Tactical Match Screen
  return (
    <main className="min-h-screen bg-base-950">
      {/* Top Match Header */}
      <GameHeader
        turnOwner={turnOwner}
        userNosUsed={userNosUsed}
        opponentNosUsed={opponentNosUsed}
        userName={myPlayer?.name || user?.name || "You"}
        opponentName={opponentPlayer?.name || "Opponent"}
        nosMax={nosMax}
        round={currentRound}
        maxRounds={-1}
        onLeave={() => setShowLeaveModal(true)}
      />

      {/* Three-Column Tactical Layout */}
      <div className="grid grid-cols-[300px_1fr_320px] gap-5 p-6 font-body">
        {/* Left Column: Your Secret Agent & Leave Game Action */}
        <div className="flex flex-col gap-4">
          <SecretAgentCard
            agent={activeSecretAgent}
            time={isInfinite || timeLeft === -1 ? "∞" : formattedTime}
            round={currentRound}
            maxRounds={-1}
            yourTurn={isMyTurn}
            map="Ascent"
          />
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center justify-center gap-2 rounded-sm border border-[#FF4655]/40 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 hover:border-[#FF4655] py-3 text-xs font-display font-bold uppercase tracking-wider text-[#FF4655] transition-all cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.15)]"
          >
            <LogOut className="h-4 w-4" />
            Leave Game
          </button>
        </div>

        {/* Center Column: Questions Panel or Opponent Prompt + Agent Elimination Grid */}
        <div className="flex flex-col">
          {isFreeform ? (
            <FreeformTurnPanel
              onConsumeNo={handleConsumeNo}
              onOpenGuessModal={() => setShowGuessModal(true)}
              opponentName={opponentPlayer?.name || "Opponent"}
              nosRemaining={myPlayer?.state?.nosRemaining ?? 0}
              guessesRemaining={myPlayer?.state?.guessesRemaining ?? 0}
              opponentNosRemaining={opponentPlayer?.state?.nosRemaining}
              opponentGuessesRemaining={opponentPlayer?.state?.guessesRemaining}
              isConsumingNo={isConsumingNo}
            />
          ) : (
            <>
              {!isOpponentAskingMe && (
                <QuestionPanel
                  onAsk={handleAskQuestion}
                  askedQuestions={askedQuestionsMap}
                  disabled={!isMyTurn || !!pendingQuestion || isAsking}
                  disabledReason={
                    isAsking
                      ? "Sending question to opponent..."
                      : isIWaitingForAnswer
                        ? "Opponent is answering your question..."
                        : !isMyTurn
                          ? `${opponentPlayer?.name || "Opponent"} is thinking...`
                          : undefined
                  }
                  questions={gameQuestions}
                />
              )}

              {isOpponentAskingMe && opponentQuestionObj && (
                <OpponentQuestionPrompt
                  question={opponentQuestionObj}
                  isAnswering={isAnswering}
                  onAnswer={handleAnswerQuestion}
                />
              )}
            </>
          )}

          <AgentGrid
            externalEliminated={eliminatedIds}
            onToggleEliminated={handleToggleEliminated}
            onOpenGuessModal={() => setShowGuessModal(true)}
          />
        </div>

        {/* Right Column: Live Match Activity Feed */}
        <div className="h-[calc(100vh-220px)]">
          <ActivityFeed
            entries={activity}
            yourTurn={isMyTurn}
            userName={myPlayer.name || user?.name || "You"}
            opponentName={opponentPlayer?.name || "Opponent"}
          />
        </div>
      </div>

      {/* Agent Final Guess Modal */}
      <AgentGuessModal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
        onConfirmGuess={(agentId) => {
          handleGuessConfirm(agentId);
          setShowGuessModal(false);
        }}
        eliminatedIds={eliminatedIds}
        guessesRemaining={myPlayer?.state?.guessesRemaining ?? 0}
      />

      {/* Leave Game Confirmation Modal */}
      <LeaveGameDialog
        isOpen={showLeaveModal}
        onOpenChange={setShowLeaveModal}
        onConfirmLeave={handleLeaveGame}
      />

      {/* Floating Party Chat Overlay */}
      <PartyChatOverlay className="bottom-6 left-6" />
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlayLoadingScreen />}>
      <PlayContent />
    </Suspense>
  );
}
