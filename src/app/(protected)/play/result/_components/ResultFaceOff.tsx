"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Agent } from "@/lib/data";
import { StatCol } from "./StatCol";

interface ResultFaceOffProps {
  isVictory: boolean;
  isTie: boolean;
  isDefeat: boolean;
  userName: string;
  oppName: string;
  myAgentObj: Agent;
  oppAgentObj: Agent;
  roundsPlayed: number;
  totalQuestions: number;
  userNosUsed: number;
  opponentNosUsed: number;
  guessesMade: number;
  accuracy: string;
}

export function ResultFaceOff({
  isVictory,
  isTie,
  isDefeat,
  userName,
  oppName,
  myAgentObj,
  oppAgentObj,
  roundsPlayed,
  totalQuestions,
  userNosUsed,
  opponentNosUsed,
  guessesMade,
  accuracy,
}: ResultFaceOffProps) {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden py-1">
      {/* Result Main Header Title */}
      <div className="flex flex-col items-center text-center">
        <h1
          className={cn(
            "font-valorant text-6xl font-black uppercase tracking-[0.1em] text-shadow-glow leading-none select-none",
            isTie
              ? "text-amber-400"
              : isVictory
                ? "text-[#3CF2C4]"
                : "text-zinc-500",
          )}
        >
          {isTie ? "DRAW" : isVictory ? "VICTORY" : "DEFEAT"}
        </h1>
        <p className="text-ink-400 text-xs tracking-wide mt-2 font-medium">
          {isTie
            ? "All guesses consumed without a winner. Match ended in a draw."
            : isVictory
              ? `${userName} guessed ${oppAgentObj.name.toUpperCase()} correctly!`
              : `${oppName} guessed your agent first!`}
        </p>
      </div>

      {/* Agent Reveal Face-off Section */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 my-auto max-h-[460px]">
        {/* User's Secret Agent Card */}
        <div
          className={cn(
            "clip-notch-both border p-3 bg-[#0d1119] flex flex-col transition-all duration-300 relative",
            isVictory
              ? "border-[#3CF2C4]/50 shadow-[0_0_20px_rgba(60,242,196,0.15)]"
              : isTie
                ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
                : "border-white/5",
          )}
        >
          {/* Corner decor */}
          <div className="absolute left-0 top-0 h-4 w-4">
            <div className="absolute left-0 top-0 h-px w-4 bg-accent/60" />
            <div className="absolute left-0 top-0 h-4 w-px bg-accent/60" />
          </div>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2 text-center block">
            YOUR AGENT
          </span>

          <div className="relative aspect-[4/5] w-full max-w-[210px] mx-auto overflow-hidden border border-white/10 rounded-sm">
            <Image
              src={myAgentObj.bannerPath || `/agents/banner/${myAgentObj.id}.webp`}
              alt={myAgentObj.name}
              fill
              className="object-cover object-top"
            />
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
        <div className="text-zinc-700 text-2xl font-light">⚔️</div>

        {/* Opponent's Agent Card */}
        <div
          className={cn(
            "clip-notch-both border p-3 bg-[#0d1119] flex flex-col transition-all duration-300 relative",
            isDefeat
              ? "border-accent/40 shadow-[0_0_20px_rgba(255,70,85,0.08)]"
              : isTie
                ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
                : "border-white/5",
          )}
        >
          {/* Corner decor */}
          <div className="absolute right-0 top-0 h-4 w-4">
            <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
            <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
          </div>
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2 text-center block">
            OPPONENT'S AGENT
          </span>

          <div className="relative aspect-[4/5] w-full max-w-[210px] mx-auto overflow-hidden border border-white/10 rounded-sm">
            <Image
              src={oppAgentObj.bannerPath || `/agents/banner/${oppAgentObj.id}.webp`}
              alt={oppAgentObj.name}
              fill
              className="object-cover object-top"
            />
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
      <div
        className={cn(
          "rounded-sm border p-2.5 text-center flex items-center justify-center gap-2 font-semibold text-xs my-3",
          isTie
            ? "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            : isVictory
              ? "border-mint bg-mint/5 text-mint shadow-[0_0_15px_rgba(60,242,196,0.05)]"
              : "border-accent bg-accent/5 text-accent shadow-[0_0_15px_rgba(255,70,85,0.05)]",
        )}
      >
        <span>{isTie ? "⚖️" : "★"}</span>
        <span>
          {isTie
            ? "Stalemate! All guesses exhausted without a winning identification."
            : isVictory
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
          <StatCol
            icon="❓"
            label="Total Questions"
            val={String(totalQuestions)}
          />
          <StatCol
            icon="❌"
            label="No Answers (You)"
            val={String(userNosUsed)}
          />
          <StatCol
            icon="❌"
            label="No Answers (Opponent)"
            val={String(opponentNosUsed)}
          />
          <StatCol icon="🔍" label="Guesses Made" val={String(guessesMade)} />
          <StatCol
            icon="📈"
            label="Accuracy"
            val={isTie ? "0%" : accuracy}
            valClass={
              isTie ? "text-amber-400" : isVictory ? "text-mint" : "text-accent"
            }
          />
        </div>
      </div>
    </div>
  );
}
