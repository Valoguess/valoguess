"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Trophy,
  Check,
  X,
  Clock,
  Target,
  Loader2,
  Coins,
  Shield,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SummaryRow } from "@/components/SummaryRow";
import { StatCol } from "@/components/StatCol";

type TimelineEvent = {
  id: string;
  kind: "asked" | "answered-yes" | "answered-no" | "guessed" | "system-win" | "system-lose";
  actor: "you" | "opponent" | "system";
  text: string;
  time: string;
};

import { useRoomStore } from "@/store/roomStore";
import { AGENTS, getQuestionLabel } from "@/lib/data";

function ResultContent() {
  const searchParams = useSearchParams();
  const { room } = useRoomStore();

  const isVictory = room?.game?.winnerId ? room.game.winnerId === room.me.player.id : searchParams.get("status") === "victory";

  const myAgentId = room?.me.state.secretAgent || "cypher";
  const myAgentObj = AGENTS.find(a => a.id === myAgentId) || { id: myAgentId, name: myAgentId, role: "Sentinel" };

  const oppAgentId = room?.opponent?.state.secretAgent || "raze";
  const oppAgentObj = AGENTS.find(a => a.id === oppAgentId) || { id: oppAgentId, name: oppAgentId, role: "Duelist" };

  const userName = room?.me.player.username || "You";
  const oppName = room?.opponent?.player.username || "Opponent";

  const roundsPlayed = Math.max(1, Math.ceil((room?.game?.turnNumber ?? 1) / 2));
  const history = room?.game?.history || [];
  const totalQuestions = history.length;
  const maxNos = room?.settings?.maxNos ?? 5;
  const userNosUsed = maxNos === -1 ? (history.filter(h => h.askedBy !== room?.me.player.id && h.answer === "no").length) : Math.max(0, maxNos - (room?.me.state.nosRemaining ?? maxNos));
  const opponentNosUsed = maxNos === -1 ? (history.filter(h => h.askedBy === room?.me.player.id && h.answer === "no").length) : Math.max(0, maxNos - (room?.opponent?.state.nosRemaining ?? maxNos));
  const guessesMade = room?.me.state.guess ? 1 : 0;
  const accuracy = isVictory ? "100%" : "0%";

  let timeTaken = "Live Match";
  if (room?.game?.startedAt && room?.game?.endedAt) {
    const diffMs = Math.max(0, room.game.endedAt - room.game.startedAt);
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    timeTaken = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const timeline: TimelineEvent[] = history.flatMap((h, i) => {
    const isMyQuestion = h.askedBy === room?.me.player.id;
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

  return (
    <main className="h-screen w-screen overflow-hidden bg-base-950 text-white select-none flex flex-col font-body">
      {/* Top Header Navigation */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#090B11] px-6 z-10">
        <Link
          href="/room"
          className="flex items-center gap-2 rounded-sm border border-white/10 bg-base-900 px-4 py-2 text-xs font-semibold text-ink-300 transition hover:border-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK TO ROOM
        </Link>

        <div className="flex items-center gap-3">
          <Image src="/logo.svg" width={24} height={24} alt="logo" />
          <span className="font-valorant text-sm tracking-[0.25em] text-zinc-400">MATCH RESULT</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-sm border border-white/10 bg-base-900 px-4 py-2 text-xs font-semibold text-ink-300 transition hover:border-white/20 hover:text-white"
        >
          MAIN MENU
        </Link>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 min-h-0 p-5 grid grid-cols-[280px_1fr_320px] gap-5 max-w-[1600px] mx-auto w-full overflow-hidden">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
          
          {/* Profile Card */}
          <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col items-center shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-[#3CF2C4]" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full p-[2.5px] bg-gradient-to-br from-[#3CF2C4] via-[#3CF2C4]/40 to-transparent">
                <div className="h-full w-full overflow-hidden rounded-full bg-base-950 relative">
                  <Image src={`/agents/icon/${myAgentObj.id}.png`} alt={userName} fill className="object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-base-950 p-1 rounded-full border border-white/10">
                <Shield className="h-4 w-4 text-[#3CF2C4]" />
              </div>
            </div>

            <h3 className="font-display text-xl font-black uppercase tracking-wide text-white mt-3">
              {userName}
            </h3>
            <span className="text-[10px] font-semibold text-[#3CF2C4] uppercase tracking-widest mt-0.5">
              Agent Duelist
            </span>

            {/* Winner / Defeated Tag */}
            <div className={cn(
              "clip-tag border w-full flex items-center justify-center gap-2 py-1.5 mt-4 font-display font-black text-xs uppercase tracking-widest",
              isVictory
                ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(255,70,85,0.15)]"
                : "border-zinc-500 bg-zinc-800/30 text-zinc-400"
            )}>
              <Trophy className="h-3.5 w-3.5" />
              {isVictory ? "WINNER" : "DEFEATED"}
            </div>
          </div>

          {/* Game Summary */}
          <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col shrink-0">
            <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
              GAME SUMMARY
            </h4>
            
            <div className="space-y-2">
              <SummaryRow icon={<HelpCircle className="h-3.5 w-3.5 text-ink-400" />} label="Questions Asked" value={String(totalQuestions)} />
              <SummaryRow icon={<X className="h-3.5 w-3.5 text-accent" />} label="No Answers Used" value={`${userNosUsed} / ${maxNos === -1 ? "∞" : maxNos}`} valueClass="text-accent" />
              <SummaryRow icon={<Target className="h-3.5 w-3.5 text-mint" />} label="Guesses Made" value={String(guessesMade)} />
              <SummaryRow icon={<Check className="h-3.5 w-3.5 text-mint" />} label="Correct Guess" value={isVictory ? "Yes" : "No"} valueClass={isVictory ? "text-mint" : "text-accent"} />
              <SummaryRow icon={<Clock className="h-3.5 w-3.5 text-ink-400" />} label="Time Taken" value={timeTaken} valueClass="font-mono" />
            </div>
          </div>

          {/* Performance Overview */}
          <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col shrink-0">
            <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
              MATCH OVERVIEW
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-zinc-400 font-display uppercase tracking-wider">Victor</span>
                <span className="font-display font-bold text-white uppercase">{isVictory ? userName : oppName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-zinc-400 font-display uppercase tracking-wider">Opponent Agent</span>
                <span className="font-display font-bold text-accent uppercase">{oppAgentObj.name}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400 font-display uppercase tracking-wider">Match Rounds</span>
                <span className="font-display font-bold text-white">{roundsPlayed} / {room?.settings?.maxRounds === -1 ? "∞" : room?.settings?.maxRounds ?? 10}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= CENTER CONTENT ================= */}
        <div className="flex flex-col justify-between h-full overflow-hidden py-1">
          
          {/* Result Main Header Title */}
          <div className="flex flex-col items-center text-center">
            <h1 className={cn(
              "font-valorant text-6xl font-black uppercase tracking-[0.1em] text-shadow-glow leading-none select-none",
              isVictory ? "text-accent" : "text-zinc-500"
            )}>
              {isVictory ? "VICTORY" : "DEFEAT"}
            </h1>
            <p className="text-ink-400 text-xs tracking-wide mt-2 font-medium">
              {isVictory ? `${userName} guessed ${oppAgentObj.name.toUpperCase()} correctly!` : `${oppName} guessed your agent first!`}
            </p>
          </div>

          {/* Agent Reveal Section */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 my-auto max-h-[460px]">
            
            {/* User's Secret Agent Card */}
            <div className={cn(
              "clip-notch-both border p-3 bg-[#0d1119] flex flex-col transition-all duration-300 relative",
              isVictory ? "border-accent/40 shadow-[0_0_20px_rgba(255,70,85,0.08)]" : "border-white/5"
            )}>
              {/* Corner decor */}
              <div className="absolute left-0 top-0 h-4 w-4">
                <div className="absolute left-0 top-0 h-px w-4 bg-accent/60" />
                <div className="absolute left-0 top-0 h-4 w-px bg-accent/60" />
              </div>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2 text-center block">
                YOUR AGENT
              </span>
              
              <div className="relative aspect-[4/5] w-full max-w-[210px] mx-auto overflow-hidden border border-white/10 rounded-sm">
                <Image src={`/agents/banner/${myAgentObj.id}.png`} alt={myAgentObj.name} fill className="object-cover object-top" />
              </div>
              
              <div className="text-center mt-2.5">
                <h3 className="font-display text-xl font-black uppercase text-white tracking-widest leading-none">
                  {myAgentObj.name}
                </h3>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold mt-1 block leading-none">
                  {myAgentObj.role}
                </span>
              </div>
            </div>

            {/* Mid Crossed Swords */}
            <div className="text-zinc-700 text-2xl font-light">
              ⚔️
            </div>

            {/* Opponent's Agent Card */}
            <div className={cn(
              "clip-notch-both border p-3 bg-[#0d1119] flex flex-col transition-all duration-300 relative",
              !isVictory ? "border-accent/40 shadow-[0_0_20px_rgba(255,70,85,0.08)]" : "border-white/5"
            )}>
              {/* Corner decor */}
              <div className="absolute right-0 top-0 h-4 w-4">
                <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
                <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
              </div>
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2 text-center block">
                OPPONENT'S AGENT
              </span>
              
              <div className="relative aspect-[4/5] w-full max-w-[210px] mx-auto overflow-hidden border border-white/10 rounded-sm">
                <Image src={`/agents/banner/${oppAgentObj.id}.png`} alt={oppAgentObj.name} fill className="object-cover object-top" />
              </div>

              <div className="text-center mt-2.5">
                <h3 className="font-display text-xl font-black uppercase text-white tracking-widest leading-none">
                  {oppAgentObj.name}
                </h3>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold mt-1 block leading-none">
                  {oppAgentObj.role}
                </span>
              </div>
            </div>

          </div>

          {/* Reveal Status Alert Banner */}
          <div className={cn(
            "rounded-sm border p-2.5 text-center flex items-center justify-center gap-2 font-semibold text-xs my-3",
            isVictory
              ? "border-mint bg-mint/5 text-mint shadow-[0_0_15px_rgba(60,242,196,0.05)]"
              : "border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,70,85,0.05)]"
          )}>
            <span>★</span>
            <span>
              {isVictory
                ? `Correct Guess! ${userName} guessed ${oppAgentObj.name.toUpperCase()}!`
                : `${oppName} guessed your agent ${myAgentObj.name.toUpperCase()} correctly!`}
            </span>
          </div>

          {/* Match Stats Table */}
          <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col shrink-0">
            <h4 className="font-display text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5 block leading-none">
              MATCH STATS
            </h4>
            <div className="grid grid-cols-6 gap-2 text-center">
              <StatCol icon="🎯" label="Rounds Played" val={String(roundsPlayed)} />
              <StatCol icon="❓" label="Total Questions" val={String(totalQuestions)} />
              <StatCol icon="❌" label="No Answers (You)" val={String(userNosUsed)} />
              <StatCol icon="❌" label="No Answers (Opponent)" val={String(opponentNosUsed)} />
              <StatCol icon="🔍" label="Guesses Made" val={String(guessesMade)} />
              <StatCol icon="📈" label="Accuracy" val={accuracy} valClass={isVictory ? "text-mint" : "text-accent"} />
            </div>
          </div>

        </div>

        {/* ================= RIGHT TIMELINE ================= */}
        <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col h-full overflow-hidden">
          <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3 shrink-0">
            MATCH TIMELINE
          </h4>

          <div className="flex-1 overflow-y-auto pr-1 relative pl-1.5 min-h-0">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-white/10" />

            <div className="space-y-3 pb-3">
              {timeline.map((event) => {
                return (
                  <div key={event.id} className="flex gap-3 items-start relative z-10">
                    {/* Circle icon */}
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm font-semibold text-[10px] text-white",
                      event.kind === "asked" && "bg-violet border-violet/30",
                      (event.kind === "answered-yes" || event.kind === "system-win") && "bg-mint border-mint/30",
                      (event.kind === "answered-no" || event.kind === "system-lose") && "bg-accent border-accent/30",
                      event.kind === "guessed" && "bg-[#1d232f] border-[#ff4655]/40"
                    )}>
                      {event.kind === "asked" && "?"}
                      {event.kind === "answered-yes" && <Check className="h-3 w-3" />}
                      {event.kind === "answered-no" && <X className="h-3 w-3" />}
                      {event.kind === "guessed" && "🎯"}
                      {(event.kind === "system-win" || event.kind === "system-lose") && "🏆"}
                    </div>

                    {/* Content detail */}
                    <div className="flex-1 min-w-0 bg-[#0d1119]/50 hover:bg-[#0d1119] border border-white/[0.02] p-2 rounded-sm transition">
                      <div className="flex items-center justify-between text-[8px] text-zinc-500 font-semibold mb-0.5">
                        <span className="uppercase tracking-wider">
                          {event.actor === "you"
                            ? userName
                            : event.actor === "opponent"
                              ? oppName
                              : "SYSTEM"}
                          {event.kind === "asked" && " ASKED"}
                          {event.kind === "answered-yes" && " ANSWERED"}
                          {event.kind === "answered-no" && " ANSWERED"}
                          {event.kind === "guessed" && " GUESSED"}
                        </span>
                        <span className="tabular-nums">{event.time}</span>
                      </div>
                      <p className={cn(
                        "text-xs font-medium leading-normal",
                        event.kind === "answered-yes" && "text-mint",
                        event.kind === "answered-no" && "text-accent",
                        (event.kind === "system-win") && "text-mint font-bold",
                        (event.kind === "system-lose") && "text-accent font-bold",
                        event.kind !== "answered-yes" && event.kind !== "answered-no" && event.kind !== "system-win" && event.kind !== "system-lose" && "text-ink-100"
                      )}>
                        {event.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* Footer Navigation Buttons */}
      <footer className="h-20 shrink-0 border-t border-white/10 bg-[#090B11] p-4 flex items-center justify-center gap-4 z-10">
        <Link
          href="/room"
          className="clip-tag flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim py-2.5 px-8 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,70,85,0.15)] transition"
        >
          BACK TO ROOM
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-base-900 hover:border-white/20 hover:text-white hover:bg-base-800 py-2.5 px-8 text-xs font-bold uppercase tracking-wider text-ink-300 transition"
        >
          LEAVE GAME
        </Link>
      </footer>
    </main>
  );
}



export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white">
          <Loader2 className="h-10 w-10 text-accent animate-spin" />
          <span className="text-xs text-ink-500 uppercase tracking-widest mt-4 font-display">
            Loading Match Results...
          </span>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
