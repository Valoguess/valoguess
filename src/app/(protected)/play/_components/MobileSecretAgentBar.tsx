"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, Eye, Shield } from "lucide-react";
import { Agent } from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SecretAgentCard } from "./SecretAgentCard";

interface MobileSecretAgentBarProps {
  agent: Agent;
  time: string;
  round: number;
  maxRounds: number;
  yourTurn: boolean;
  map?: string;
  onLeaveGame: () => void;
}

export function MobileSecretAgentBar({
  agent,
  time,
  round,
  maxRounds,
  yourTurn,
  map = "Ascent",
  onLeaveGame,
}: MobileSecretAgentBarProps) {
  const [showFullCard, setShowFullCard] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-sm border border-accent/30 bg-base-900/95 backdrop-blur-md shadow-[0_0_15px_rgba(255,70,85,0.08)] mb-3">
        {/* Left: Mini Agent Portrait & Details */}
        <div
          onClick={() => setShowFullCard(true)}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          title="Tap to view full agent card"
        >
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-sm overflow-hidden border border-accent/60 bg-base-950 shrink-0 group-hover:border-accent transition shadow-[0_0_10px_rgba(255,70,85,0.25)]">
            <Image
              src={agent.iconPath || `/agents/icon/${agent.id}.webp`}
              alt={agent.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="h-4 w-4 text-white drop-shadow" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-accent shrink-0" />
              <span className="font-display text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-accent truncate">
                YOUR SECRET AGENT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-valorant text-sm sm:text-base text-white tracking-wider truncate">
                {agent.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase bg-white/5 px-1.5 py-0.2 rounded border border-white/10 shrink-0">
                {agent.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Inspect & Leave Game */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFullCard(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-display font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            onClick={onLeaveGame}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-[#FF4655]/40 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] text-[11px] font-display font-bold uppercase tracking-wider transition cursor-pointer"
            title="Leave Match"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* Full Secret Agent Card Modal for Mobile */}
      <Dialog open={showFullCard} onOpenChange={setShowFullCard}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm bg-base-950 border border-accent/40 p-0 overflow-hidden rounded-md text-white">
          <DialogTitle className="sr-only">Secret Agent Details</DialogTitle>
          <SecretAgentCard
            agent={agent}
            time={time}
            round={round}
            maxRounds={maxRounds}
            yourTurn={yourTurn}
            map={map}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
