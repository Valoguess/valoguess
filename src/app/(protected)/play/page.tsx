"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Activity, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameHeader } from "./_components/GameHeader";
import { SecretAgentCard } from "./_components/SecretAgentCard";
import { MobileSecretAgentBar } from "./_components/MobileSecretAgentBar";
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
  const { tempResultGame } = useTempResultStore();
  const { user } = useAuthStore();

  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(false);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMobileActivity, setShowMobileActivity] = useState(false);
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set());

  const { timeLeft, formattedTime, isInfinite } = useRoomTimer({ game });

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

  useEffect(() => {
    if (typeof window !== "undefined" && game?.id) {
      const seen = sessionStorage.getItem(`intro_seen_${game.id}`) === "true";
      if (seen && game.status === "PLAYING") {
        setHasCompletedIntro(true);
      }
    }
  }, [game?.id, game?.status]);

  useEffect(() => {
    if (game?.id) {
      setEliminatedIds(new Set());
    }
  }, [game?.id]);

  useEffect(() => {
    if (game?.status === "STARTING" || game?.status === "WAITING") {
      setHasCompletedIntro(false);
      setEliminatedIds(new Set());
    }
  }, [game?.status]);

  useEffect(() => {
    if (game?.status === "FINISHED") {
      useTempResultStore.getState().setTempResultGame(game);
    }
  }, [game]);

  useEffect(() => {
    if (
      game &&
      (game.status === "STARTING" ||
        game.status === "PLAYING" ||
        game.status === "WAITING")
    ) {
      useTempResultStore.getState().clearTempResultGame();
    }
  }, [game?.id, game?.status]);

  const finishedMatchGame =
    game?.status === "FINISHED"
      ? game
      : !game && tempResultGame?.status === "FINISHED"
      ? tempResultGame
      : null;

  useEffect(() => {
    if (!gameHydrated) return;
    if (!game) {
      if (tempResultGame?.status === "FINISHED") {
        return;
      }
      router.replace("/lobby");
    }
  }, [game, gameHydrated, router, tempResultGame]);

  const handleToggleEliminated = (id: string) => {
    setEliminatedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResetEliminated = () => {
    setEliminatedIds(new Set());
  };

  if (finishedMatchGame) {
    const rawResult = (finishedMatchGame.state?.result ?? finishedMatchGame.result) as any;
    const resolvedWinnerId =
      rawResult?.winnerId ??
      rawResult?.winner ??
      (finishedMatchGame.state as any)?.winnerId ??
      (finishedMatchGame as any)?.winnerId ??
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
      (myPlayer?.id ? finishedMatchGame.players.find((p) => p.id !== myPlayer.id) : undefined) ||
      finishedMatchGame.players[1];

    const myAgentKey =
      secretAgentId ||
      myPlayer?.state?.secretAgent ||
      (typeof window !== "undefined" && finishedMatchGame.id
        ? sessionStorage.getItem(`secret_agent_${finishedMatchGame.id}`)
        : null);

    const oppAgentKey =
      opponentMember?.state?.secretAgent ||
      (myAgentKey && finishedMatchGame.players.length > 1
        ? finishedMatchGame.players.find((p) => p.state?.secretAgent && p.state.secretAgent !== myAgentKey)?.state?.secretAgent
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
          Math.ceil((finishedMatchGame.state?.turnNumber ?? finishedMatchGame.turnNumber ?? 1) / 2)
        )}
        onComplete={() => {
          setEliminatedIds(new Set());
          useTempResultStore.getState().setTempResultGame(finishedMatchGame);
          router.replace("/game");
        }}
      />
    );
  }

  if (!gameHydrated || !game || !myPlayer) {
    return <PlayLoadingScreen label={!gameHydrated ? "Loading Game..." : "Returning to Lobby..."} />;
  }

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

  return (
    <main className="min-h-screen bg-[#040609]">
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

      <div className="flex flex-col xl:grid xl:grid-cols-[300px_1fr_320px] gap-4 sm:gap-5 p-3 sm:p-5 md:p-6 font-body max-w-[1800px] mx-auto">
        <div className="xl:hidden">
          <MobileSecretAgentBar
            agent={activeSecretAgent}
            time={isInfinite || timeLeft === -1 ? "∞" : formattedTime}
            round={currentRound}
            maxRounds={-1}
            yourTurn={isMyTurn}
            map="Ascent"
            onLeaveGame={() => setShowLeaveModal(true)}
          />
        </div>

        <div className="hidden xl:flex flex-col gap-4">
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

        <div className="flex flex-col min-w-0">
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
                <>
                  {!isMyTurn && (
                    <div className="md:hidden flex items-center justify-between p-3 rounded-sm border border-white/10 bg-[#07090e]/95 backdrop-blur-md mb-3 shadow-md">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                        </span>
                        <span className="text-xs font-mono text-white/80 truncate">
                          {isAsking
                            ? "Sending question to opponent..."
                            : isIWaitingForAnswer
                              ? `${opponentPlayer?.name || "Opponent"} is answering...`
                              : `${opponentPlayer?.name || "Opponent"} is thinking...`}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 shrink-0">
                        WAITING
                      </span>
                    </div>
                  )}

                  <div className={cn(!isMyTurn && "hidden md:block")}>
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
                  </div>
                </>
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
            onResetEliminated={handleResetEliminated}
            onOpenGuessModal={() => setShowGuessModal(true)}
          />
        </div>

        <div className="hidden xl:block h-[calc(100vh-220px)]">
          <ActivityFeed
            entries={activity}
            yourTurn={isMyTurn}
            userName={myPlayer.name || user?.name || "You"}
            opponentName={opponentPlayer?.name || "Opponent"}
          />
        </div>
      </div>

      <div className="xl:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowMobileActivity(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#07090e]/95 border border-white/20 hover:border-accent text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        >
          <Activity className="h-4 w-4 text-accent" />
          <span className="font-valorant text-xs uppercase tracking-wider">Log</span>
          {activity.length > 0 && (
            <span className="h-5 w-5 rounded-full bg-accent text-[10px] font-mono font-bold flex items-center justify-center text-white">
              {activity.length}
            </span>
          )}
        </button>
      </div>

      {showMobileActivity && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileActivity(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 max-w-[90vw] z-50 bg-[#040609] border-l border-white/10 flex flex-col shadow-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
              <span className="font-valorant text-sm uppercase tracking-widest text-white">
                MATCH LOG
              </span>
              <button
                onClick={() => setShowMobileActivity(false)}
                className="p-1 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ActivityFeed
                entries={activity}
                yourTurn={isMyTurn}
                userName={myPlayer.name || user?.name || "You"}
                opponentName={opponentPlayer?.name || "Opponent"}
              />
            </div>
          </div>
        </div>
      )}

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

      <LeaveGameDialog
        isOpen={showLeaveModal}
        onOpenChange={setShowLeaveModal}
        onConfirmLeave={handleLeaveGame}
      />

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
