"use client";

import { Check, Copy, Plus, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Party } from "@/types/party";

interface LobbySubheaderProps {
  party: Party | null;
  copied: boolean;
  handleCopyCode: () => void;
  handleCreateParty: () => void;
  handleJoinParty: (e: React.FormEvent) => void;
  partyInput: string;
  setPartyInput: (val: string) => void;
  isCreatingOrJoining: boolean;
  // Compatibility
  room?: any;
  roomInput?: string;
  setRoomInput?: (val: string) => void;
  selectedMode?: any;
  setSelectedMode?: any;
  showModeDropdown?: any;
  setShowModeDropdown?: any;
  onOpenSettings?: any;
}

export function LobbySubheader({
  party,
  copied,
  handleCopyCode,
  handleCreateParty,
  handleJoinParty,
  partyInput,
  setPartyInput,
  isCreatingOrJoining,
  room,
  roomInput,
  setRoomInput,
}: LobbySubheaderProps) {
  const currentParty = party || room;
  const currentInput = partyInput || roomInput || "";
  const handleInputChange = (val: string) => {
    if (setPartyInput) setPartyInput(val);
    if (setRoomInput) setRoomInput(val);
  };

  return (
    <div className="relative z-30 px-8 pt-3 pb-1 flex items-center justify-between shrink-0 select-none">
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
          {currentParty ? `PARTY (${currentParty.members?.length || 1}/2)` : "STANDALONE"}
        </span>
      </div>

      {/* Right: Party Status */}
    </div>
  );
}
