"use client";

import React from "react";
import { Party } from "@/types/party";

interface LobbySubheaderProps {
  party: Party | null;
  room?: any;
}

export function LobbySubheader({ party, room }: LobbySubheaderProps) {
  const currentParty = party || room;
  const memberCount = currentParty?.members?.length || 1;

  return (
    <div className="relative z-30 px-4 sm:px-8 py-2.5 flex items-center justify-between shrink-0 select-none border-b border-white/5">
      <div className="flex items-center gap-2 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
        <span className="font-valorant text-xs tracking-wider text-white">
          CUSTOM DUEL
        </span>
        <span className="text-white/20">•</span>
        <span className="text-white/50 font-sans">
          Party ({memberCount}/2)
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 font-sans">
        {memberCount >= 2 ? (
          <span className="text-mint font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Ready to Play
          </span>
        ) : (
          <span className="text-white/40 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Waiting for player
          </span>
        )}
      </div>
    </div>
  );
}
