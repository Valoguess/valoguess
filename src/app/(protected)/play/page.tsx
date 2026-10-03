"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Check, X, Loader2, LogOut } from "lucide-react";
import { GameHeader } from "./_components/GameHeader";
import { SecretAgentCard } from "./_components/SecretAgentCard";
import { QuestionPanel } from "./_components/QuestionPanel";
import { AgentGrid } from "./_components/AgentGrid";
import { ActivityFeed } from "./_components/ActivityFeed";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AGENTS,
  getQuestionById,
  getQuestionLabel,
  getRandomQuestions,
  ActivityEntry,
  QuestionItem,
} from "@/lib/data";
import { useGameStore } from "@/store/gameStore";
import { useAuthStore } from "@/store/authStore";
import {
  askQuestion as sendAskQuestion,
  answerQuestion as sendAnswerQuestion,
  leaveParty,
} from "@/socket/emitter";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import { cn } from "@/lib/utils";

function PlayContent() {
  const router = useRouter();
  const { game, clearGame, hydrated: gameHydrated } = useGameStore();
  const { user } = useAuthStore();

  const [isAsking, setIsAsking] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const myPlayer =
    game?.players.find(
      (p) => p.id === user?.id || (p.state && p.state.secretAgent !== null)
    ) || game?.players[0];
  const opponentPlayer = game?.players.find((p) => p.id !== myPlayer?.id);

  useEffect(() => {
    if (!gameHydrated) return;
    if (!game) {
      router.replace("/lobby");
    } else if (game.status === "FINISHED") {
      const result = game.state?.result ?? game.result;
      const isVictory =
        result?.result === "WIN" && result.winnerId === myPlayer?.id;
      router.replace(`/play/result?status=${isVictory ? "victory" : "defeat"}`);
    } else {
      setIsAsking(false);
      setIsAnswering(false);
    }
  }, [game, gameHydrated, router, myPlayer?.id]);

  useEffect(() => {
    const onError = (err: any) => {
      setIsAsking(false);
      setIsAnswering(false);
      setErrorMsg(err?.message || "An error occurred");
      const timer = setTimeout(() => setErrorMsg(null), 4000);
      return () => clearTimeout(timer);
    };
    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, []);

  if (!gameHydrated || !game || !myPlayer) {
    return (
      <main className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white select-none">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
            <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
            <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
            <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
          </svg>
          <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">
            {!gameHydrated ? "Loading Game..." : "Returning to Lobby..."}
          </span>
        </div>
      </main>
    );
  }

  const gameState = game.state;
  const isMyTurn = Boolean(myPlayer.state?.isMyTurn);
  const pendingQuestion = gameState?.pendingQuestion ?? game.pendingQuestion;
  const isOpponentAskingMe = pendingQuestion?.targetPlayer === myPlayer.id;
  const isIWaitingForAnswer = pendingQuestion?.askedBy === myPlayer.id;

  const turnOwner: "you" | "opponent" | "opponent-thinking" = isOpponentAskingMe
    ? "opponent"
    : isMyTurn
      ? "you"
      : "opponent-thinking";

  const cachedSecretAgent =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`secret_agent_${game.id}`)
      : null;
  const secretAgentId = myPlayer.state?.secretAgent || cachedSecretAgent;
  const activeSecretAgent =
    AGENTS.find((a) => a.id === secretAgentId) || AGENTS[0];

  const questionPoolIds = game.settings?.questionPool || [];
  const gameQuestions: QuestionItem[] =
    questionPoolIds.length > 0
      ? questionPoolIds.map(
          (id) =>
            getQuestionById(id) || {
              id,
              label: id,
              category: "utility" as const,
              difficulty: "low" as const,
            }
        )
      : getRandomQuestions(
          game.settings?.questionCount || 15,
          game.id || gameState?.startedAt || game.startedAt
        );

  const opponentQuestionObj = pendingQuestion
    ? getQuestionById(pendingQuestion.questionId) || {
        id: pendingQuestion.questionId,
        label: pendingQuestion.questionId,
        category: "utility" as const,
        difficulty: "low" as const,
        description: `Characteristic: "${pendingQuestion.questionId}"`,
      }
    : null;

  const gameHistory = gameState?.history ?? game.history ?? [];
  const askedQuestionsMap: Record<string, "yes" | "no"> = {};
  gameHistory.forEach((h) => {
    if (h.askedBy === myPlayer.id) {
      askedQuestionsMap[h.questionId] = h.answer.toLowerCase() as "yes" | "no";
    }
  });

  const activity: ActivityEntry[] = gameHistory.flatMap((h, i) => {
    const isMyQuestion = h.askedBy === myPlayer.id;
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

  const handleAskQuestion = (q: QuestionItem) => {
    if (game && isMyTurn && !pendingQuestion && !isAsking) {
      setIsAsking(true);
      setErrorMsg(null);
      sendAskQuestion(game.id, q.id);
    }
  };

  const handleAnswerQuestion = (answer: "yes" | "no") => {
    if (game && isOpponentAskingMe && !isAnswering) {
      setIsAnswering(true);
      setErrorMsg(null);
      sendAnswerQuestion(game.id, answer.toUpperCase() as "YES" | "NO");
    }
  };

  const handleLeaveGame = () => {
    leaveParty();
    clearGame();
    router.replace("/lobby");
  };

  const turnNumber = gameState?.turnNumber ?? game.turnNumber ?? 1;
  const currentRound = Math.max(1, Math.ceil(turnNumber / 2));

  return (
    <main className="min-h-screen bg-base-950">
      <GameHeader
        turnOwner={turnOwner}
        userNosUsed={
          (game.settings.maxNos ?? 5) - (myPlayer.state?.nosRemaining ?? 0)
        }
        opponentNosUsed={
          (game.settings.maxNos ?? 5) - (opponentPlayer?.state?.nosRemaining ?? 0)
        }
        userName={myPlayer.name || user?.name || "You"}
        opponentName={opponentPlayer?.name || "Opponent"}
        nosMax={game.settings.maxNos ?? 5}
        round={currentRound}
        maxRounds={-1}
        onLeave={() => setShowLeaveModal(true)}
      />

      {errorMsg && (
        <div className="w-full max-w-xl mx-auto mt-4 px-4">
          <div className="bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] text-xs font-display font-bold uppercase tracking-wider p-3 rounded text-center shadow-lg animate-pulse">
            {errorMsg}
          </div>
        </div>
      )}

      <div className="grid grid-cols-[300px_1fr_320px] gap-5 p-6 font-body">
        {/* Left Side: secret agent details */}
        <div className="flex flex-col gap-4">
          <SecretAgentCard
            agent={activeSecretAgent}
            time="01:00"
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

        {/* Center Panel: Question Panel / Opponent Asked Card */}
        <div className="flex flex-col">
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
            <div className="clip-notch-both flex flex-col border border-accent/20 bg-base-850 p-6 shadow-[0_0_24px_rgba(255,70,85,0.1)] relative min-h-[300px] justify-between mb-5">
              {/* Corner accent decorations */}
              <div className="absolute left-0 top-0 h-4 w-4">
                <div className="absolute left-0 top-0 h-px w-4 bg-accent/60" />
                <div className="absolute left-0 top-0 h-4 w-px bg-accent/60" />
              </div>
              <div className="absolute right-0 top-0 h-4 w-4">
                <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
                <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
              </div>

              {/* Tag / Header */}
              <div className="flex justify-center items-center gap-2 mb-6">
                <span className="text-accent font-display text-xs tracking-[0.25em] font-semibold">{`{`}</span>
                <span className="text-accent font-display text-sm tracking-[0.25em] font-bold uppercase">
                  OPPONENT ASKED
                </span>
                <span className="text-accent font-display text-xs tracking-[0.25em] font-semibold">{`}`}</span>
              </div>

              {/* Question text */}
              <div className="text-center my-auto flex flex-col gap-2">
                <h2 className="text-white font-display text-4xl md:text-5xl font-black uppercase tracking-[0.05em]">
                  {opponentQuestionObj.label.toUpperCase()}?
                </h2>
                <p className="text-ink-400 text-sm max-w-md mx-auto leading-relaxed">
                  {opponentQuestionObj.description ||
                    `Does your secret agent match the characteristic: "${opponentQuestionObj.label}"?`}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mt-8">
                {/* YES Button */}
                <button
                  onClick={() => handleAnswerQuestion("yes")}
                  disabled={isAnswering}
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-sm border-2 border-mint bg-mint/5 py-4 px-6 text-mint transition-all duration-200 hover:bg-mint/15 font-display text-xl font-bold uppercase tracking-widest cursor-pointer",
                    isAnswering && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isAnswering ? (
                    <Loader2 className="h-5 w-5 animate-spin text-mint" />
                  ) : (
                    <Check className="h-5 w-5 stroke-[3.5]" />
                  )}
                  YES
                </button>

                {/* OR divider */}
                <span className="text-ink-600 font-display text-xs tracking-widest uppercase select-none px-2">
                  — OR —
                </span>

                {/* NO Button */}
                <button
                  onClick={() => handleAnswerQuestion("no")}
                  disabled={isAnswering}
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-sm border-2 border-accent bg-accent/5 py-4 px-6 text-accent transition-all duration-200 hover:bg-accent/15 font-display text-xl font-bold uppercase tracking-widest cursor-pointer",
                    isAnswering && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isAnswering ? (
                    <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  ) : (
                    <X className="h-5 w-5 stroke-[3.5]" />
                  )}
                  NO
                </button>
              </div>
            </div>
          )}

          <AgentGrid />
        </div>

        {/* Right Side: activity feed */}
        <div className="h-[calc(100vh-220px)]">
          <ActivityFeed
            entries={activity}
            yourTurn={isMyTurn}
            userName={myPlayer.name || user?.name || "You"}
            opponentName={opponentPlayer?.name || "Opponent"}
          />
        </div>
      </div>

      {/* LEAVE MATCH CONFIRMATION MODAL */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="bg-[#090d14]/95 border border-[#FF4655]/40 max-w-sm p-6 text-center text-white backdrop-blur-xl shadow-[0_0_35px_rgba(255,70,85,0.25)] rounded-sm">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border border-[#FF4655]/60 bg-[#FF4655]/15 flex items-center justify-center mb-4 text-[#FF4655] shadow-[0_0_15px_rgba(255,70,85,0.3)]">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="font-valorant text-xl tracking-wider text-white mb-2">
              LEAVE MATCH?
            </h3>
            <p className="text-xs text-white/60 mb-6 font-medium">
              Are you sure you want to exit the match? Leaving will forfeit your current duel and return you to the lobby.
            </p>
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-2.5 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveGame}
                className="flex-1 py-2.5 rounded-sm border border-[#FF4655] bg-[#FF4655] hover:bg-[#e03847] text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.4)]"
              >
                Leave Match
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white select-none">
          <div className="flex flex-col items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
              <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
              <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
              <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
            </svg>
            <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">
              Loading Game...
            </span>
          </div>
        </main>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
