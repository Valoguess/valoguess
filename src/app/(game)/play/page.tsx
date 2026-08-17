"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flag, Check, X, Loader2 } from "lucide-react";
import { GameHeader } from "@/components/GameHeader";
import { SecretAgentCard } from "@/components/SecretAgentCard";
import { QuestionPanel } from "@/components/QuestionPanel";
import { AgentGrid } from "@/components/AgentGrid";
import { ActivityFeed } from "@/components/ActivityFeed";
import {
  AGENTS,
  getQuestionById,
  getQuestionLabel,
  getRandomQuestions,
  ActivityEntry,
  QuestionItem,
} from "@/lib/data";
import { useRoomStore } from "@/store/roomStore";
import { askQuestion as sendAskQuestion, answerQuestion as sendAnswerQuestion, leaveRoom, sendHeartbeat } from "@/socket/emitter";

import { useState } from "react";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import { cn } from "@/lib/utils";

function PlayContent() {
  const router = useRouter();
  const { room, clearRoom } = useRoomStore();

  const [isAsking, setIsAsking] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!room) {
      router.replace("/");
    } else if (room.state === "finished") {
      const isVictory = room.game?.winnerId === room.me.player.id;
      router.replace(`/play/result?status=${isVictory ? "victory" : "defeat"}`);
    } else {
      // Clear pending action states when room sync arrives
      setIsAsking(false);
      setIsAnswering(false);
    }
  }, [room]);

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

  if (!room) return null;

  useEffect(() => { 
    const interval = setInterval(() => {
      if (room) {
        sendHeartbeat(room.id);
      }
    }, 5000)

    return () => {
      clearInterval(interval);
    }
  },[room.id])

  const isMyTurn = room.me.state.isMyTurn;
  const pendingQuestion = room.game?.pendingQuestion;
  const isOpponentAskingMe = pendingQuestion?.targetPlayer === room.me.player.id;
  const isIWaitingForAnswer = pendingQuestion?.askedBy === room.me.player.id;

  const turnOwner: "you" | "opponent" | "opponent-thinking" = isOpponentAskingMe
    ? "opponent"
    : isMyTurn
      ? "you"
      : "opponent-thinking";

  const activeSecretAgent =
    AGENTS.find((a) => a.id === room.me.state.secretAgent) || AGENTS[0];

  const questionPoolIds = room.game?.questionPool || [];
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
          room.settings?.questionCount || 15,
          room.id || room.game?.startedAt
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

  const askedQuestionsMap: Record<string, "yes" | "no"> = {};
  (room.game?.history || []).forEach((h) => {
    if (h.askedBy === room.me.player.id) {
      askedQuestionsMap[h.questionId] = h.answer;
    }
  });

  const activity: ActivityEntry[] = (room.game?.history || []).flatMap((h, i) => {
    const isMyQuestion = h.askedBy === room.me.player.id;
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
        kind: h.answer === "yes" ? "answered-yes" : "answered-no",
        actor: isMyQuestion ? "opponent" : "you",
        text: h.answer === "yes" ? "Yes" : "No",
        time: timeStr,
      },
    ];
  });

  const handleAskQuestion = (q: QuestionItem) => {
    if (room && isMyTurn && !pendingQuestion && !isAsking) {
      setIsAsking(true);
      setErrorMsg(null);
      sendAskQuestion(room.id, q.id);
    }
  };

  const handleAnswerQuestion = (answer: "yes" | "no") => {
    if (room && isOpponentAskingMe && !isAnswering) {
      setIsAnswering(true);
      setErrorMsg(null);
      sendAnswerQuestion(room.id, answer);
    }
  };

  const handleSurrender = () => {
    if (room) {
      leaveRoom(room.id);
      clearRoom();
      router.push("/");
    }
  };

  const currentRound = Math.max(1, Math.ceil((room.game?.turnNumber ?? 1) / 2));

  return (
    <main className="min-h-screen bg-base-950">
      <GameHeader
        turnOwner={turnOwner}
        userNosUsed={(room.settings.maxNos ?? 5) - (room.me.state.nosRemaining ?? 0)}
        opponentNosUsed={
          (room.settings.maxNos ?? 5) - (room.opponent?.state.nosRemaining ?? 0)
        }
        userName={room.me.player.username}
        opponentName={room.opponent?.player.username || "Opponent"}
        nosMax={room.settings.maxNos ?? 5}
        round={currentRound}
        maxRounds={room.settings.maxRounds ?? -1}
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
            maxRounds={room.settings.maxRounds ?? -1}
            yourTurn={isMyTurn}
            map="Ascent"
          />
          <button
            onClick={handleSurrender}
            className="flex items-center justify-center gap-2 rounded-sm border border-[#FF4655]/30 bg-[#FF4655]/5 py-3 text-sm font-semibold text-[#FF4655] transition hover:bg-[#FF4655]/10 cursor-pointer"
          >
            <Flag className="h-4 w-4" />
            Surrender
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
                      ? `${room.opponent?.player.username || "Opponent"} is thinking...`
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
            userName={room.me.player.username}
            opponentName={room.opponent?.player.username || "Opponent"}
          />
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white select-none">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
            <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
            <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
            <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
          </svg>
          <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">Loading Game...</span>
        </div>
      </main>
    }>
      <PlayContent />
    </Suspense>
  );
}
