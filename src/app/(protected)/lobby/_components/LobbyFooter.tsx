"use client";

import { MessageCircle, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface LobbyFooterProps {
  showChatDrawer: boolean;
  setShowChatDrawer: (show: boolean) => void;
  room: any;
  isHost: boolean;
  opponent: any;
  handleStartGame: () => void;
  handleLeaveParty: () => void;
  onOpenSettings: () => void;
}

export function LobbyFooter({
  showChatDrawer,
  setShowChatDrawer,
  room,
  isHost,
  opponent,
  handleStartGame,
  handleLeaveParty,
  onOpenSettings,
}: LobbyFooterProps) {
  return (
    <footer className="relative z-20 w-full h-20 bg-[#080B10]/95 border-t border-white/10 px-8 flex items-center justify-between shrink-0">
      {/* Left: Chat Drawer Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowChatDrawer(!showChatDrawer)}
          className={cn(
            "h-11 w-11 flex items-center justify-center rounded-sm border transition relative cursor-pointer",
            showChatDrawer
              ? "border-accent bg-accent/20 text-accent shadow-[0_0_12px_rgba(255,70,85,0.3)]"
              : "border-white/10 bg-white/3 hover:bg-white/10 text-white/70 hover:text-white"
          )}
          title="Toggle Room Chat"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
        </button>
      </div>

      {/* Center: BIG RED START MATCH BUTTON & CUSTOM GAME */}
      <div className="flex items-center gap-4">
        {/* BIG RED GLOWING START MATCH BUTTON */}
        <button
          onClick={handleStartGame}
          disabled={!room || !isHost || !opponent}
          className={cn(
            "h-14 px-24 font-valorant text-xl tracking-[0.25em] uppercase text-white flex items-center justify-center transition-all duration-300 relative clip-tag border",
            room && isHost && opponent
              ? "bg-accent hover:bg-accent-dim shadow-[0_0_35px_rgba(255,70,85,0.6)] border-accent cursor-pointer active:scale-95"
              : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-50"
          )}
          title={
            !room
              ? "Create or join a party to start"
              : !opponent
              ? "Waiting for opponent to join"
              : "Start Match"
          }
        >
          <span>
            {room
              ? isHost
                ? opponent
                  ? "START MATCH"
                  : "WAITING FOR PLAYER"
                : "READY"
              : "START MATCH"}
          </span>
        </button>

        {/* CUSTOM GAME / ROOM SETTINGS OVERLAY BUTTON */}
        <button
          onClick={onOpenSettings}
          className="h-12 px-6 rounded-sm border border-white/15 bg-white/3 hover:bg-white/10 font-display text-xs font-bold uppercase tracking-[0.2em] text-white transition flex items-center gap-2 cursor-pointer"
        >
          <Sliders className="h-4 w-4 text-accent" />
          <span>CUSTOM GAME</span>
        </button>
      </div>

      {/* Right: LEAVE PARTY (If in room) */}
      <div>
        {room && (
          <button
            onClick={handleLeaveParty}
            className="h-11 px-6 rounded-sm border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-display text-xs font-bold uppercase tracking-[0.2em] transition cursor-pointer"
          >
            LEAVE PARTY
          </button>
        )}
      </div>
    </footer>
  );
}
