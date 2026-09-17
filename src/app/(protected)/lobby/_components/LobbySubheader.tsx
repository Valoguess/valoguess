"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Flame,
  ChevronDown,
  Check,
  Zap,
  Sliders,
  Plus,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface LobbySubheaderProps {
  selectedMode: "duel" | "blitz";
  setSelectedMode: (mode: "duel" | "blitz") => void;
  showModeDropdown: boolean;
  setShowModeDropdown: (show: boolean) => void;
  onOpenSettings: () => void;
  room: any;
  copied: boolean;
  handleCopyCode: () => void;
  handleCreateParty: () => void;
  handleJoinParty: (e: React.FormEvent) => void;
  roomInput: string;
  setRoomInput: (val: string) => void;
  isCreatingOrJoining: boolean;
}

export function LobbySubheader({
  selectedMode,
  setSelectedMode,
  showModeDropdown,
  setShowModeDropdown,
  onOpenSettings,
  room,
  copied,
  handleCopyCode,
  handleCreateParty,
  handleJoinParty,
  roomInput,
  setRoomInput,
  isCreatingOrJoining,
}: LobbySubheaderProps) {
  return (
    <div className="relative z-50 px-8 pt-4 flex items-center justify-between shrink-0">
      {/* GAMEMODE SELECTOR CARD WITH SETTINGS GEAR BUTTON ⚙️ */}
      <div className="flex items-center gap-2 relative z-50">
        {/* Mode Dropdown Trigger Button */}
        <div className="relative z-50">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="clip-notch-both border border-[#FF4655]/60 bg-[#0c1017] hover:bg-[#121824] backdrop-blur-md p-3 px-5 flex items-center gap-3.5 hover:border-[#FF4655] transition-all text-left shadow-[0_0_20px_rgba(255,70,85,0.2)] group cursor-pointer"
          >
            <div className="h-9 w-9 rounded-sm border border-[#FF4655]/50 bg-[#FF4655]/15 flex items-center justify-center text-[#FF4655] shrink-0 shadow-[0_0_10px_rgba(255,70,85,0.3)]">
              {selectedMode === "duel" ? (
                <Swords className="h-5 w-5" />
              ) : (
                <Flame className="h-5 w-5 text-[#FF4655] animate-pulse" />
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655] drop-shadow-[0_0_6px_rgba(255,70,85,0.3)]">
                GAMEMODE
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-valorant text-lg tracking-[0.08em] text-white">
                  {selectedMode === "duel" ? "1V1 DUEL" : "BLITZ MODE"}
                </span>
                {selectedMode === "blitz" && (
                  <span className="text-[8px] font-display font-black bg-[#FF4655] text-white px-2 py-0.5 rounded uppercase tracking-widest shadow-[0_0_8px_rgba(255,70,85,0.4)]">
                    ⚡ FAST
                  </span>
                )}
              </div>
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4 text-white ml-3 transition-transform duration-200 group-hover:text-[#FF4655]",
                showModeDropdown && "rotate-180"
              )}
            />
          </button>

          {/* GAMEMODE DROPDOWN MENU */}
          <AnimatePresence>
            {showModeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="absolute left-0 top-full mt-2 w-72 z-[100] bg-[#0c1017] border-2 border-[#FF4655]/50 rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-2.5 space-y-2 backdrop-blur-xl"
              >
                {/* OPTION 1: 1V1 DUEL */}
                <button
                  onClick={() => {
                    setSelectedMode("duel");
                    setShowModeDropdown(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-sm border transition-all flex items-center justify-between cursor-pointer",
                    selectedMode === "duel"
                      ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_12px_rgba(255,70,85,0.25)]"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Swords className="h-4.5 w-4.5 text-[#FF4655]" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">
                        1V1 DUEL
                      </span>
                      <span className="text-[9.5px] font-sans font-semibold text-white/70 mt-0.5">
                        Tactical 1v1 agent elimination
                      </span>
                    </div>
                  </div>
                  {selectedMode === "duel" && <Check className="h-4 w-4 text-[#FF4655]" />}
                </button>

                {/* OPTION 2: BLITZ MODE */}
                <button
                  onClick={() => {
                    setSelectedMode("blitz");
                    setShowModeDropdown(false);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-sm border transition-all flex items-center justify-between cursor-pointer",
                    selectedMode === "blitz"
                      ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_12px_rgba(255,70,85,0.25)]"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-4.5 w-4.5 text-[#FF4655]" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-valorant text-xs tracking-wider text-white">
                          BLITZ
                        </span>
                        <span className="text-[8px] font-display font-black bg-[#FF4655] text-white px-1.5 py-0.2 rounded">
                          ⚡ NEW
                        </span>
                      </div>
                      <span className="text-[9.5px] font-sans font-semibold text-white/70 mt-0.5">
                        Fast 30s timers & rapid rounds
                      </span>
                    </div>
                  </div>
                  {selectedMode === "blitz" && <Check className="h-4 w-4 text-[#FF4655]" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SETTINGS GEAR BUTTON NEXT TO MODE SELECTOR ⚙️ */}
        <button
          onClick={onOpenSettings}
          className="h-11 w-11 flex items-center justify-center rounded-sm border border-[#FF4655]/50 bg-[#0c1017] hover:bg-[#FF4655]/20 hover:border-[#FF4655] text-white/90 hover:text-white transition-all shadow-[0_0_15px_rgba(255,70,85,0.15)] cursor-pointer"
          title="Configure Game Settings (Timer, Max NOs, Max Guesses)"
        >
          <Sliders className="h-5 w-5 text-[#FF4655]" />
        </button>
      </div>

      {/* Center Party State / Create / Join Controls */}
      {room ? (
        /* When in a party: Show Party Code badge & Copy */
        <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-sm p-1.5 px-4 backdrop-blur-md">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-[0.25em] text-white/50 font-bold font-display">
              PARTY CODE
            </span>
            <span className="font-valorant text-xl tracking-[0.2em] text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.3)]">
              #{room.id}
            </span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-accent/40 bg-accent/10 hover:bg-accent/20 text-white font-display text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-mint" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-accent" />
            )}
            <span>{copied ? "COPIED" : "COPY CODE"}</span>
          </button>
        </div>
      ) : (
        /* When NO party: Show CREATE PARTY and JOIN PARTY controls */
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateParty}
            disabled={isCreatingOrJoining}
            className="px-6 py-2 bg-accent hover:bg-accent-dim text-white font-valorant text-xs tracking-[0.2em] uppercase rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.3)] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>CREATE PARTY</span>
          </button>

          <form onSubmit={handleJoinParty} className="flex items-center gap-2">
            <Input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
              placeholder="PARTY CODE #"
              className="w-36 h-9 bg-black/60 border-white/10 px-3 font-display text-white text-xs uppercase tracking-wider placeholder-white/30 rounded-sm"
            />
            <button
              type="submit"
              disabled={!roomInput.trim() || isCreatingOrJoining}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display text-[11px] font-bold tracking-wider uppercase rounded-sm transition disabled:opacity-30 cursor-pointer"
            >
              JOIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
