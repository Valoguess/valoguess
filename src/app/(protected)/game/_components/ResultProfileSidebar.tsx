"use client";

import Image from "next/image";
import {
  Shield,
  Trophy,
  Swords,
  HelpCircle,
  X,
  Target,
  Check,
  Clock,
} from "lucide-react";
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
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 scrollbar-thin">
      <div className="rounded-sm border border-white/10 bg-[#07090e] p-4 flex flex-col items-center shrink-0">
        <div className="relative">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full p-[2.5px] bg-gradient-to-br from-mint via-mint/40 to-transparent">
            <div className="h-full w-full overflow-hidden rounded-full bg-[#040609] relative">
              <Image
                src={myAgentObj.iconPath || `/agents/icon/${myAgentObj.id}.webp`}
                alt={userName}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#040609] p-1 rounded-full border border-white/10">
            <Shield className="h-4 w-4 text-mint" />
          </div>
        </div>

        <h3 className="font-display text-xl font-black uppercase tracking-wide text-white mt-3">
          {userName}
        </h3>
        <span className="text-[10px] font-semibold text-mint uppercase tracking-widest mt-0.5">
          {myAgentObj.role}
        </span>

        <div
          className={cn(
            "rounded-sm border w-full flex items-center justify-center gap-2 py-1.5 mt-4 font-display font-black text-xs uppercase tracking-widest",
            isTie
              ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
              : isVictory
                ? "border-mint bg-mint/15 text-mint shadow-[0_0_12px_rgba(60,242,196,0.2)]"
                : "border-zinc-500 bg-zinc-800/30 text-zinc-400",
          )}
        >
          {isTie ? (
            <Swords className="h-3.5 w-3.5" />
          ) : (
            <Trophy className="h-3.5 w-3.5" />
          )}
          {isTie ? "DRAW" : isVictory ? "WINNER" : "DEFEATED"}
        </div>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#07090e] p-4 flex flex-col shrink-0">
        <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-[#FF4655] mb-3">
          GAME SUMMARY
        </h4>

        <div className="space-y-2">
          <SummaryRow
            icon={<HelpCircle className="h-3.5 w-3.5 text-white/40" />}
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
            valueClass={
              isTie ? "text-amber-400" : isVictory ? "text-mint" : "text-accent"
            }
          />
          <SummaryRow
            icon={<Clock className="h-3.5 w-3.5 text-white/40" />}
            label="Time Taken"
            value={timeTaken}
            valueClass="font-mono"
          />
        </div>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#07090e] p-4 flex flex-col shrink-0">
        <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-[#FF4655] mb-3">
          MATCH OVERVIEW
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-400 font-display uppercase tracking-wider">
              Victor
            </span>
            <span className="font-display font-bold text-white uppercase">
              {isTie ? "NONE (DRAW)" : isVictory ? userName : oppName}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-zinc-400 font-display uppercase tracking-wider">
              Rounds
            </span>
            <span className="font-display font-bold text-white uppercase">
              {roundsPlayed} / {maxRounds === -1 ? "∞" : maxRounds}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-zinc-400 font-display uppercase tracking-wider">
              Secret Agent
            </span>
            <span className="font-display font-bold text-mint uppercase">
              {oppAgentObj.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
