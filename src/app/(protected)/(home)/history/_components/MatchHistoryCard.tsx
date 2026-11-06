"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Swords, Trophy, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAgentById } from "@/consts";

export interface MatchHistoryPlayer {
  userId: string;
  name: string;
  image?: string | null;
  outcome?: "WIN" | "LOSS" | "DRAW" | null;
  placement?: number | null;
  score?: number | null;
  details: {
    secretAgent?: string;
    guess?: string;
    nosUsed?: number;
    guessesUsed?: number;
    [key: string]: any;
  };
}

export interface MatchHistoryGame {
  id: string;
  mode: string;
  startedAt: string | null;
  endedAt: string | null;
  summary?: any;
  players: MatchHistoryPlayer[];
}

interface MatchHistoryCardProps {
  game: MatchHistoryGame;
  currentUserId?: string;
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatDuration(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt || !endedAt) return "1v1 Duel";
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  const diffSec = Math.max(0, Math.floor((end - start) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export function MatchHistoryCard({ game, currentUserId }: MatchHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const myPlayer =
    (currentUserId ? game.players.find((p) => p.userId === currentUserId) : undefined) ||
    game.players[0];

  const oppPlayer =
    game.players.find((p) => p.userId !== myPlayer?.userId) ||
    (game.players.length > 1 ? game.players[1] : undefined);

  const outcome = myPlayer?.outcome || "DRAW";
  const isVictory = outcome === "WIN";
  const isDefeat = outcome === "LOSS";

  const myAgent = getAgentById(myPlayer?.details?.secretAgent);
  const oppAgent = getAgentById(oppPlayer?.details?.secretAgent);

  const durationStr = formatDuration(game.startedAt, game.endedAt);
  const relativeTime = formatRelativeTime(game.endedAt || game.startedAt);

  return (
    <div
      className={cn(
        "relative rounded-sm border transition-all overflow-hidden bg-[#080b10]/90 backdrop-blur-md",
        isVictory
          ? "border-mint/30 hover:border-mint/50"
          : isDefeat
          ? "border-[#FF4655]/30 hover:border-[#FF4655]/50"
          : "border-white/10 hover:border-white/20"
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-1",
          isVictory ? "bg-mint" : isDefeat ? "bg-[#FF4655]" : "bg-white/20"
        )}
      />

      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-3.5 sm:p-4 pl-4.5 sm:pl-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col min-w-[80px] sm:min-w-[90px]">
            <span
              className={cn(
                "font-valorant text-lg sm:text-xl tracking-wider leading-none",
                isVictory ? "text-mint" : isDefeat ? "text-[#FF4655]" : "text-white/60"
              )}
            >
              {isVictory ? "VICTORY" : isDefeat ? "DEFEAT" : "DRAW"}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
              {game.mode.replace(/_/g, " ")}
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col text-right sm:text-left text-xs">
            <span className="text-white/80 font-mono text-xs flex items-center justify-end sm:justify-start gap-1.5">
              <Clock className="h-3.5 w-3.5 text-white/40" />
              {durationStr}
            </span>
            <span className="text-[10px] text-white/40 font-mono mt-0.5 flex items-center justify-end sm:justify-start gap-1.5">
              <Calendar className="h-3 w-3 text-white/30" />
              {relativeTime}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 self-center md:self-auto w-full md:w-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-sm overflow-hidden border border-white/15 bg-black shrink-0">
              <Image
                src={myAgent.iconPath}
                alt={myAgent.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                YOU
              </span>
              <span className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                {myAgent.name}
              </span>
              <span className="text-[9px] font-mono text-[#FF4655] uppercase">
                {myAgent.role}
              </span>
            </div>
          </div>

          <div className="h-6 w-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-valorant text-[9px] text-white/40 shrink-0">
            VS
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-display font-bold uppercase tracking-wider text-white/60 truncate max-w-[90px] sm:max-w-none">
                {oppPlayer?.name || "OPPONENT"}
              </span>
              <span className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                {oppAgent.name}
              </span>
              <span className="text-[9px] font-mono text-white/40 uppercase">
                {oppAgent.role}
              </span>
            </div>
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-sm overflow-hidden border border-white/15 bg-black shrink-0">
              <Image
                src={oppAgent.iconPath}
                alt={oppAgent.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-xs bg-white/[0.03] border border-white/10 text-white/70">
              <span className="text-white/40 mr-1.5">NOS:</span>
              <span className="text-white font-bold">{myPlayer?.details?.nosUsed ?? 0}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xs bg-white/[0.03] border border-white/10 text-white/70">
              <span className="text-white/40 mr-1.5">GUESSES:</span>
              <span className="text-white font-bold">{myPlayer?.details?.guessesUsed ?? 0}</span>
            </div>
          </div>

          <div
            className={cn(
              "p-1.5 rounded-xs bg-white/5 border border-white/10 text-white/50 transition-transform",
              isExpanded && "rotate-180 text-white"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10 bg-black/50 p-4 sm:p-5 pl-5 sm:pl-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Swords className="h-3.5 w-3.5 text-[#FF4655]" />
                <span className="font-valorant text-xs tracking-wider text-white">MATCH BREAKDOWN</span>
              </div>
              <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Player Name:</span>
                  <span className="text-white font-display font-bold uppercase">{myPlayer?.name || "You"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Secret Agent:</span>
                  <span className="text-mint font-display font-bold uppercase">{myAgent.name} ({myAgent.role})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Final Guess:</span>
                  <span className="text-white font-display font-bold uppercase">{myPlayer?.details?.guess || "None"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">&quot;No&quot; Cards Consumed:</span>
                  <span className="text-white font-mono font-bold">{myPlayer?.details?.nosUsed ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-valorant text-xs tracking-wider text-white">OPPONENT INTEL</span>
              </div>
              <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Challenger:</span>
                  <span className="text-white font-display font-bold uppercase">{oppPlayer?.name || "Opponent"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Secret Agent:</span>
                  <span className="text-[#FF4655] font-display font-bold uppercase">{oppAgent.name} ({oppAgent.role})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">Final Guess:</span>
                  <span className="text-white font-display font-bold uppercase">{oppPlayer?.details?.guess || "None"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 font-sans">&quot;No&quot; Cards Consumed:</span>
                  <span className="text-white font-mono font-bold">{oppPlayer?.details?.nosUsed ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
