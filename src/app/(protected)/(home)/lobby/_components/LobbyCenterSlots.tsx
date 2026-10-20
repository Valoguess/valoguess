"use client";

import Image from "next/image";
import { Crown, Plus, Loader2, X, UserPlus, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Party, PartyMember } from "@/types/party";
import { useAuthStore } from "@/store/authStore";
import { getAgentBannerPath } from "@/consts";

interface LobbyCenterSlotsProps {
  party: Party | null;
  me: { id: string; name: string } | null;
  opponent?: PartyMember | null;
  isHost: boolean;
  savedUsername: string;
  isCreatingOrJoining: boolean;
  handleCreateParty: () => void;
  handleKickGuest: () => void;
  onOpenInviteDialog: () => void;
  // Compatibility prop
  room?: any;
  you?: any;
}

export function LobbyCenterSlots({
  party,
  me,
  opponent,
  isHost,
  savedUsername,
  isCreatingOrJoining,
  handleCreateParty,
  handleKickGuest,
  onOpenInviteDialog,
}: LobbyCenterSlotsProps) {
  const { user } = useAuthStore();
  const myBanner = getAgentBannerPath(user?.banner || "chamber");
  const oppBanner = getAgentBannerPath((opponent as any)?.banner || "jett");

  return (
    <div className="flex-1 flex items-center justify-center gap-4 h-full max-h-130 max-w-5xl">
      {/* SLOT 1 (LEFT MAIN SLOT - YOU) ALWAYS VISIBLE */}
      <div
        className={cn(
          "flex flex-col items-center justify-between flex-1 h-full max-h-130 max-w-65 border-2 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 group transition-all duration-300",
          isHost
            ? "border-accent/60 shadow-[0_0_30px_rgba(255,70,85,0.15)]"
            : "border-mint/40 shadow-[0_0_20px_rgba(60,242,196,0.1)]",
        )}
      >
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
            src={myBanner}
            alt="Agent Banner"
            fill
            className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0e16] via-transparent to-transparent" />
        </div>

        <div className="w-full text-center z-10 pt-1">
          <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
            {me?.name || savedUsername || user?.name || "AGENT"}
          </h3>
          <span
            className={cn(
              "text-[10px] font-display font-bold uppercase tracking-widest block mt-0.5",
              isHost ? "text-accent" : "text-mint",
            )}
          >
            {isHost ? "HOST • 1V1 DUELIST" : "MEMBER • 1V1 DUELIST"}
          </span>
        </div>
      </div>

      {/* SLOT 2 (RIGHT MAIN SLOT - OPPONENT OR OPEN SLOT) */}
      {opponent ? (
        /* OPPONENT CARD */
        <div
          className={cn(
            "flex flex-col items-center justify-between flex-1 h-full max-h-130 max-w-65 border-2 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 group transition-all duration-300",
            !isHost
              ? "border-accent/60 shadow-[0_0_30px_rgba(255,70,85,0.15)]"
              : "border-mint/40 shadow-[0_0_20px_rgba(60,242,196,0.1)]",
          )}
        >
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
              src={oppBanner}
              alt="Opponent Banner"
              fill
              className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0a0e16] via-transparent to-transparent" />
          </div>

          <div className="w-full text-center z-10 pt-1">
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
              {opponent.name || "Opponent"}
            </h3>
            <span
              className={cn(
                "text-[10px] font-display font-bold uppercase tracking-widest block mt-0.5",
                !isHost ? "text-accent" : "text-mint",
              )}
            >
              {!isHost ? "HOST • 1V1 DUELIST" : "READY FOR MATCH"}
            </span>
          </div>
        </div>
      ) : (
        /* OPEN SLOT / INVITE MEMBER */
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenInviteDialog}
          onKeyDown={(e) => e.key === "Enter" && onOpenInviteDialog()}
          className="flex flex-col items-center justify-center flex-1 h-full max-h-130 max-w-65 border-2 border-dashed border-white/20 bg-[#0a0e16]/60 backdrop-blur-md clip-notch-both relative cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          title="Invite member"
        >
          <div className="h-16 w-16 rounded-full border border-dashed border-white/20 hover:border-accent text-white/30 hover:text-accent hover:shadow-[0_0_25px_rgba(255,70,85,0.35)] flex items-center justify-center transition-all duration-300 transform hover:scale-110">
            <UserPlus className="h-7 w-7" />
          </div>
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
