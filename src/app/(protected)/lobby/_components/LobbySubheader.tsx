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

      {/* Right: Party State / Create / Join Controls */}
      {currentParty ? (
        /* When in a party: Show Party Code badge & Copy */
        <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-sm p-1.5 px-3.5 backdrop-blur-md">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-[0.25em] text-white/40 font-bold font-display">
              PARTY CODE
            </span>
            <span className="font-valorant text-lg tracking-[0.15em] text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.3)]">
              #{currentParty.id}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-accent/40 bg-accent/10 hover:bg-accent/20 text-white font-display text-[9.5px] font-bold uppercase tracking-wider transition cursor-pointer"
          >
            {copied ? (
              <Check className="h-3 w-3 text-mint" />
            ) : (
              <Copy className="h-3 w-3 text-accent" />
            )}
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>
        </div>
      ) : (
        /* When NO party: Show CREATE PARTY and JOIN PARTY controls */
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCreateParty}
            disabled={isCreatingOrJoining}
            className="px-4 py-1.5 bg-accent hover:bg-accent-dim text-white font-valorant text-[11px] tracking-[0.15em] uppercase rounded-sm shadow-[0_0_12px_rgba(255,70,85,0.25)] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>CREATE PARTY</span>
          </button>

          <form onSubmit={handleJoinParty} className="flex items-center gap-1.5">
            <Input
              type="text"
              value={currentInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="PARTY CODE #"
              className="w-32 h-8 bg-black/60 border-white/10 px-2.5 font-display text-white text-[11px] tracking-wider placeholder-white/30 rounded-sm"
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isCreatingOrJoining}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display text-[10px] font-bold tracking-wider uppercase rounded-sm transition disabled:opacity-30 cursor-pointer"
            >
              JOIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
