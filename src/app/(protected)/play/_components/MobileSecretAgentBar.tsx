"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, Eye, Shield, Lock } from "lucide-react";
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
      <div className="flex items-center justify-between gap-3 p-3 rounded-sm border border-white/10 bg-[#080b10]/95 backdrop-blur-md mb-3">
        <div
          onClick={() => setShowFullCard(true)}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
          title="Tap to view full agent card"
        >
          <div className="relative h-12 w-12 rounded-sm overflow-hidden border border-white/20 bg-black shrink-0 group-hover:border-[#FF4655] transition">
            <Image
              src={agent.iconPath || `/agents/icon/${agent.id}.webp`}
              alt={agent.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#FF4655] shrink-0" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF4655] truncate">
                SECRET AGENT
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-valorant text-base text-white tracking-wider truncate">
                {agent.name}
              </span>
              <span className="text-xs font-mono text-mint uppercase bg-mint/10 px-1.5 py-0.5 rounded-xs border border-mint/30 shrink-0 font-bold">
                {agent.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFullCard(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">VIEW</span>
          </button>

          <button
            onClick={onLeaveGame}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-[#FF4655]/40 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] text-xs font-display font-bold uppercase tracking-wider transition cursor-pointer"
            title="Leave Match"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">LEAVE</span>
          </button>
        </div>
      </div>

      <Dialog open={showFullCard} onOpenChange={setShowFullCard}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm bg-[#040609] border border-white/15 p-0 overflow-hidden rounded-sm text-white">
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
