"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Swords, Trophy, ShieldAlert, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
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
  const isDraw = outcome === "DRAW";

  const myAgent = getAgentById(myPlayer?.details?.secretAgent);
  const oppAgent = getAgentById(oppPlayer?.details?.secretAgent);

  const durationStr = formatDuration(game.startedAt, game.endedAt);
  const relativeTime = formatRelativeTime(game.endedAt || game.startedAt);

  return (
    <div
      className={cn(
        "relative rounded-sm border transition-all overflow-hidden bg-[#080B10]/90 backdrop-blur-md",
        isVictory
          ? "border-mint/30 hover:border-mint/60 shadow-[0_0_20px_rgba(60,242,196,0.06)]"
          : isDefeat
          ? "border-[#FF4655]/30 hover:border-[#FF4655]/60 shadow-[0_0_20px_rgba(255,70,85,0.06)]"
          : "border-white/10 hover:border-white/20"
      )}
    >
      {/* Left Outcome Color Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-1.5 transition-all",
          isVictory ? "bg-mint shadow-[0_0_12px_#3CF2C4]" : isDefeat ? "bg-accent shadow-[0_0_12px_#FF4655]" : "bg-zinc-500"
        )}
      />

      {/* Main Row */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
      >
        {/* Left Section: Outcome & Mode Info */}
        <div className="flex items-center gap-4">
          {/* Outcome Badge */}
          <div className="flex flex-col min-w-[90px]">
            <span
              className={cn(
                "font-valorant text-xl sm:text-2xl tracking-wider leading-none",
                isVictory ? "text-mint" : isDefeat ? "text-accent" : "text-zinc-400"
              )}
            >
              {isVictory ? "VICTORY" : isDefeat ? "DEFEAT" : "DRAW"}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              {game.mode.replace(/_/g, " ")}
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {/* Time & Duration */}
          <div className="hidden sm:flex flex-col text-left text-xs">
            <span className="text-white/80 font-display font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              {durationStr}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-zinc-600" />
              {relativeTime}
            </span>
          </div>
        </div>

        {/* Center Section: Face-Off (Your Secret Agent vs Opponent Secret Agent) */}
        <div className="flex items-center gap-6 sm:gap-8 self-center md:self-auto">
          {/* Your Agent */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-sm overflow-hidden border border-white/20 bg-black shrink-0">
              <Image
                src={myAgent.iconPath}
                alt={myAgent.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                YOUR AGENT
              </span>
              <span className="font-valorant text-sm text-white tracking-wider">
                {myAgent.name}
              </span>
              <span className="text-[9px] font-mono text-accent">
                {myAgent.role}
              </span>
            </div>
          </div>

          {/* VS Divider */}
          <div className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-valorant text-[10px] text-zinc-400">
            VS
          </div>

          {/* Opponent Agent */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                {oppPlayer?.name || "OPPONENT"}
              </span>
              <span className="font-valorant text-sm text-white tracking-wider">
                {oppAgent.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                {oppAgent.role}
              </span>
            </div>
            <div className="relative h-12 w-12 rounded-sm overflow-hidden border border-white/20 bg-black shrink-0">
              <Image
                src={oppAgent.iconPath}
                alt={oppAgent.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Telemetry Highlights & Expand Toggle */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-zinc-300">
              <span className="text-zinc-500 mr-1.5">NOS:</span>
              <span className="text-white font-bold">{myPlayer?.details?.nosUsed ?? 0}</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-zinc-300">
              <span className="text-zinc-500 mr-1.5">GUESSES:</span>
              <span className="text-white font-bold">{myPlayer?.details?.guessesUsed ?? 0}</span>
            </div>
          </div>

          <div
            className={cn(
              "p-1.5 rounded-sm bg-white/5 border border-white/10 text-zinc-400 transition-transform",
              isExpanded && "rotate-180 text-white"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Expanded Accordion Details Panel */}
      {isExpanded && (
        <div className="border-t border-white/10 bg-black/40 p-5 pl-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Player Breakdown */}
            <div className="space-y-3">
              <h4 className="font-valorant text-xs tracking-wider text-zinc-300 flex items-center gap-2">
                <Swords className="h-3.5 w-3.5 text-accent" />
                <span>YOUR TACTICAL PERFORMANCE</span>
              </h4>
              <div className="p-3 rounded border border-white/5 bg-white/[0.02] space-y-2 text-xs font-display">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Player Name:</span>
                  <span className="text-white font-bold">{myPlayer?.name || "You"}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Secret Agent:</span>
                  <span className="text-mint font-bold">{myAgent.name} ({myAgent.role})</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Guess Made:</span>
                  <span className="text-white font-bold uppercase">{myPlayer?.details?.guess || "None"}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Tactical &quot;No&quot; Cards Consumed:</span>
                  <span className="text-white font-bold">{myPlayer?.details?.nosUsed ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Opponent Breakdown */}
            <div className="space-y-3">
              <h4 className="font-valorant text-xs tracking-wider text-zinc-300 flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>OPPONENT INTEL</span>
              </h4>
              <div className="p-3 rounded border border-white/5 bg-white/[0.02] space-y-2 text-xs font-display">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Challenger:</span>
                  <span className="text-white font-bold">{oppPlayer?.name || "Opponent"}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Their Secret Agent:</span>
                  <span className="text-accent font-bold">{oppAgent.name} ({oppAgent.role})</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Their Final Guess:</span>
                  <span className="text-white font-bold uppercase">{oppPlayer?.details?.guess || "None"}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-zinc-500">Their &quot;No&quot; Cards Consumed:</span>
                  <span className="text-white font-bold">{oppPlayer?.details?.nosUsed ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
