"use client";

import Image from "next/image";
import { Crown, Plus, Loader2, X, UserPlus, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

interface LobbyCenterSlotsProps {
  room: any;
  you: any;
  opponent: any;
  isHost: boolean;
  savedUsername: string;
  isCreatingOrJoining: boolean;
  handleCreateParty: () => void;
  handleKickGuest: () => void;
  handleCopyCode: () => void;
}

export function LobbyCenterSlots({
  room,
  you,
  opponent,
  isHost,
  savedUsername,
  isCreatingOrJoining,
  handleCreateParty,
  handleKickGuest,
  handleCopyCode,
}: LobbyCenterSlotsProps) {
  return (
    <div className="flex-1 flex items-center justify-center gap-4 h-full max-h-130 max-w-275uto">
      {/* SLOT 1 (LEFT MAIN SLOT - YOU) */}
      {room ? (
        /* YOU CARD */
        <div className={cn(
          "flex flex-col items-center justify-between flex-1 h-full max-h-130 max-w-65 border-2 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 group transition-all duration-300",
          isHost
            ? "border-accent/60 shadow-[0_0_30px_rgba(255,70,85,0.15)]"
            : "border-mint/40 shadow-[0_0_20px_rgba(60,242,196,0.1)]"
        )}>
          <div className="w-full flex items-center justify-between z-10">
            {isHost ? (
              <div className="flex items-center gap-1.5 bg-accent px-2.5 py-1 clip-tag text-white font-display text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(255,70,85,0.4)]">
                <Crown className="h-3 w-3" />
                <span>PARTY LEADER</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-mint/20 border border-mint/40 px-2 py-0.5 text-mint font-display text-[9px] font-bold uppercase tracking-widest rounded-sm">
                <span>MEMBER</span>
              </div>
            )}
            <span className="text-[9px] text-mint font-display font-bold uppercase tracking-wider">
              READY
            </span>
          </div>

          <div className="relative w-full flex-1 my-2 overflow-hidden rounded-sm border border-white/10 bg-base-950">
            <Image
              src="/agents/banner/chamber.png"
              alt="Agent Banner"
              fill
              className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0e16] via-transparent to-transparent" />
          </div>

          <div className="w-full text-center z-10 pt-1">
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
              {you?.player?.name || you?.player?.username || savedUsername}
            </h3>
            <span className={cn(
              "text-[10px] font-display font-bold uppercase tracking-widest block mt-0.5",
              isHost ? "text-accent" : "text-mint"
            )}>
              {isHost ? "HOST • 1V1 DUELIST" : "MEMBER • 1V1 DUELIST"}
            </span>
          </div>
        </div>
      ) : (
        /* NO PARTY DEFAULT CENTER EMBLEM */
        <div className="flex flex-col items-center justify-center flex-1 h-full max-h-130 max-w-65 border border-dashed border-accent/40 bg-black/40 backdrop-blur-md clip-notch-both relative p-6 text-center shadow-[0_0_20px_rgba(255,70,85,0.08)]">
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/20 blur-md rounded-full animate-pulse" />
            <Image src="/logo.svg" alt="V Emblem" fill className="object-contain" />
          </div>

          <h2 className="font-valorant text-2xl tracking-wider text-white mb-1">
            NO PARTY
          </h2>
          <p className="text-ink-400 text-xs max-w-45 leading-relaxed mb-6 font-medium">
            Create or join a party to start playing
          </p>

          <button
            onClick={handleCreateParty}
            disabled={isCreatingOrJoining}
            className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-dim text-white font-valorant text-xs tracking-widest uppercase rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.4)] transition cursor-pointer"
          >
            {isCreatingOrJoining ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>CREATE PARTY</span>
          </button>
        </div>
      )}

      {/* SLOT 2 (RIGHT MAIN SLOT - OPPONENT) */}
      {room ? (
        opponent ? (
          /* OPPONENT CARD */
          <div className={cn(
            "flex flex-col items-center justify-between flex-1 h-full max-h-120 max-w-65 border-2 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 group transition-all duration-300",
            !isHost
              ? "border-accent/60 shadow-[0_0_30px_rgba(255,70,85,0.15)]"
              : "border-mint/40 shadow-[0_0_20px_rgba(60,242,196,0.1)]"
          )}>
            <div className="w-full flex items-center justify-between z-10">
              {!isHost ? (
                <div className="flex items-center gap-1.5 bg-accent px-2.5 py-1 clip-tag text-white font-display text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(255,70,85,0.4)]">
                  <Crown className="h-3 w-3" />
                  <span>PARTY LEADER</span>
                </div>
              ) : (
                <span className="bg-mint/20 border border-mint/40 px-2 py-0.5 text-mint font-display text-[9px] font-bold uppercase tracking-widest rounded-sm">
                  CHALLENGER
                </span>
              )}
              {isHost && (
                <button
                  onClick={handleKickGuest}
                  className="text-accent/60 hover:text-accent p-1 hover:bg-accent/10 rounded transition cursor-pointer"
                  title="Kick Player"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative w-full flex-1 my-2 overflow-hidden rounded-sm border border-white/10 bg-base-950">
              <Image
                src="/agents/banner/jett.png"
                alt="Opponent Banner"
                fill
                className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0e16] via-transparent to-transparent" />
            </div>

            <div className="w-full text-center z-10 pt-1">
              <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
                {opponent.player?.name || opponent.player?.username || "Opponent"}
              </h3>
              <span className={cn(
                "text-[10px] font-display font-bold uppercase tracking-widest block mt-0.5",
                !isHost ? "text-accent" : "text-mint"
              )}>
                {!isHost ? "HOST • 1V1 DUELIST" : "READY FOR MATCH"}
              </span>
            </div>
          </div>
        ) : (
          /* IN PARTY BUT WAITING FOR OPPONENT */
          <div className="flex flex-col items-center justify-center flex-1 h-full max-h-120 max-w-65 border border-dashed border-white/20 bg-black/30 backdrop-blur-md clip-notch-both relative p-6 text-center">
            <div className="h-16 w-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4 text-white/40">
              <UserPlus className="h-7 w-7" />
            </div>

            <h3 className="font-valorant text-lg tracking-wider text-white mb-1">
              WAITING...
            </h3>
            <p className="text-ink-400 text-xs max-w-40 leading-relaxed mb-5 font-medium">
              Share party code #{room.id} to invite opponent
            </p>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-display text-[10px] font-bold tracking-widest uppercase rounded-sm border border-white/15 transition cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5 text-accent" />
              <span>COPY CODE</span>
            </button>
          </div>
        )
      ) : (
        /* SLOT 2 EMPTY (WHEN NO PARTY) */
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 h-full max-h-120 max-w-65 border border-white/5 bg-black/20 clip-notch-both opacity-35 relative">
          <Plus className="h-8 w-8 text-white/30" />
        </div>
      )}

      {/* SLOT 3 (EXTRA PARTY SLOT FOR 4 PLAYERS MAX) */}
      <div className="hidden md:flex flex-col items-center justify-center flex-1 h-full max-h-115 max-w-55 border border-white/5 bg-black/20 clip-notch-both opacity-30 hover:opacity-50 transition relative">
        <Plus className="h-6 w-6 text-white/30" />
        <span className="text-[8px] font-display uppercase tracking-widest text-white/30 mt-1">
          SLOT 3
        </span>
      </div>

      {/* SLOT 4 (EXTRA PARTY SLOT FOR 4 PLAYERS MAX) */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 h-full max-h-110 max-w-55 border border-white/5 bg-black/20 clip-notch-both opacity-25 hover:opacity-45 transition relative">
        <Plus className="h-6 w-6 text-white/30" />
        <span className="text-[8px] font-display uppercase tracking-widest text-white/30 mt-1">
          SLOT 4
        </span>
      </div>
    </div>
  );
}
