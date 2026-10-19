"use client";

import { Party } from "@/types/party";

interface LobbySubheaderProps {
  party: Party | null;
  room?: any;
}

export function LobbySubheader({
  party,
  room,
}: LobbySubheaderProps) {
  const currentParty = party || room;

  return (
    <div className="relative z-30 px-6 lg:px-8 pt-3 pb-1 flex items-center justify-between shrink-0 select-none">
      {/* Left: Valorant Status indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
          <span className="font-valorant text-xs tracking-[0.2em] text-white/90">
            LOBBY
          </span>
        </div>
        <span className="text-white/20 font-mono text-xs">/</span>
        <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">
          PARTY ({currentParty?.members?.length || 1}/2)
        </span>
      </div>
    </div>
  );
}
