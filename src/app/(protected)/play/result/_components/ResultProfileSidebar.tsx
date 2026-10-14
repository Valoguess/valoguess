"use client";

import Image from "next/image";
import { Shield, Trophy, Swords, HelpCircle, X, Target, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/lib/data";
import { SummaryRow } from "./SummaryRow";

interface ResultProfileSidebarProps {
  userName: string;
  myAgentObj: Agent;
  isVictory: boolean;
  isTie: boolean;
  oppName: string;
  oppAgentObj: Agent;
  totalQuestions: number;
  userNosUsed: number;
  maxNos: number;
  guessesMade: number;
  timeTaken: string;
  roundsPlayed: number;
  maxRounds?: number;
}

export function ResultProfileSidebar({
  userName,
  myAgentObj,
  isVictory,
  isTie,
  oppName,
  oppAgentObj,
  totalQuestions,
  userNosUsed,
  maxNos,
  guessesMade,
  timeTaken,
  roundsPlayed,
  maxRounds = 10,
}: ResultProfileSidebarProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Profile Identity Card */}
      <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col items-center shrink-0">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-md opacity-30 bg-[#3CF2C4]" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full p-[2.5px] bg-gradient-to-br from-[#3CF2C4] via-[#3CF2C4]/40 to-transparent">
            <div className="h-full w-full overflow-hidden rounded-full bg-base-950 relative">
              <Image
                src={`/agents/icon/${myAgentObj.id}.png`}
                alt={userName}
                fill
                className="object-cover"
              />
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
          {myAgentObj.role}
        </span>

        {/* Outcome Tag */}
        <div
          className={cn(
            "clip-tag border w-full flex items-center justify-center gap-2 py-1.5 mt-4 font-display font-black text-xs uppercase tracking-widest",
            isTie
              ? "border-amber-500/40 bg-amber-500/15 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              : isVictory
                ? "border-[#3CF2C4] bg-[#3CF2C4]/15 text-[#3CF2C4] shadow-[0_0_12px_rgba(60,242,196,0.2)]"
                : "border-zinc-500 bg-zinc-800/30 text-zinc-400"
          )}
        >
          {isTie ? <Swords className="h-3.5 w-3.5" /> : <Trophy className="h-3.5 w-3.5" />}
          {isTie ? "DRAW" : isVictory ? "WINNER" : "DEFEATED"}
        </div>
      </div>

      {/* Game Summary */}
      <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col shrink-0">
        <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
          GAME SUMMARY
        </h4>

        <div className="space-y-2">
          <SummaryRow
            icon={<HelpCircle className="h-3.5 w-3.5 text-ink-400" />}
            label="Questions Asked"
            value={String(totalQuestions)}
          />
          <SummaryRow
            icon={<X className="h-3.5 w-3.5 text-accent" />}
            label="No Answers Used"
            value={`${userNosUsed} / ${maxNos === -1 ? "∞" : maxNos}`}
            valueClass="text-accent"
          />
          <SummaryRow
            icon={<Target className="h-3.5 w-3.5 text-mint" />}
            label="Guesses Made"
            value={String(guessesMade)}
          />
          <SummaryRow
            icon={<Check className="h-3.5 w-3.5 text-mint" />}
            label="Correct Guess"
            value={isTie ? "Draw" : isVictory ? "Yes" : "No"}
            valueClass={isTie ? "text-amber-400" : isVictory ? "text-mint" : "text-accent"}
          />
          <SummaryRow
            icon={<Clock className="h-3.5 w-3.5 text-ink-400" />}
            label="Time Taken"
            value={timeTaken}
            valueClass="font-mono"
          />
        </div>
      </div>

      {/* Match Overview */}
      <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col shrink-0">
        <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
          MATCH OVERVIEW
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-400 font-display uppercase tracking-wider">Victor</span>
            <span className="font-display font-bold text-white uppercase">
              {isTie ? "NONE (DRAW)" : isVictory ? userName : oppName}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-400 font-display uppercase tracking-wider">Opponent Agent</span>
            <span className="font-display font-bold text-accent uppercase">
              {oppAgentObj.name}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400 font-display uppercase tracking-wider">Match Rounds</span>
            <span className="font-display font-bold text-white">
              {roundsPlayed} / {maxRounds === -1 ? "∞" : maxRounds}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
