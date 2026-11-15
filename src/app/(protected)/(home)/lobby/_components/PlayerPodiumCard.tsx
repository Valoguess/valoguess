"use client";

import React from "react";
import Image from "next/image";
import { Crown, X, UserPlus, Copy, Check, Hash, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerPodiumCardProps {
  isVacant?: boolean;
  name?: string;
  role?: "LEADER" | "CHALLENGER" | "MEMBER" | "HOST" | "PLAYER";
  subtitle?: string;
  bannerPath?: string;
  canKick?: boolean;
  onKick?: () => void;
  onOpenInvite?: () => void;
  onCopyCode?: () => void;
  copied?: boolean;
  onOpenJoinDialog?: () => void;
  partyCode?: string;
  showPartyCode?: boolean;
  onToggleRevealCode?: () => void;
}

export function PlayerPodiumCard({
  isVacant = false,
  name = "AGENT",
  role = "PLAYER",
  subtitle = "Player",
  bannerPath,
  canKick = false,
  onKick,
  onOpenInvite,
  onCopyCode,
  copied = false,
  onOpenJoinDialog,
  partyCode,
  showPartyCode = false,
  onToggleRevealCode,
}: PlayerPodiumCardProps) {
  if (isVacant) {
    return (
      <div className="flex flex-col justify-between flex-1 h-full min-h-[340px] max-h-[480px] max-w-[280px] sm:max-w-[300px] w-full border border-white/10 bg-[#07090e]/70 backdrop-blur-md rounded-sm p-4 sm:p-5 transition-all">
        <div className="w-full flex items-center justify-between shrink-0">
          <span className="text-xs font-sans text-white/40 uppercase tracking-wider font-medium">
            Opponent Slot
          </span>
          <span className="text-xs font-sans text-white/30">
            1v1
          </span>
        </div>

        <div className="flex flex-col items-center text-center my-auto py-4">
          <div className="h-12 w-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 mb-3">
            <UserPlus className="h-5 w-5 text-white/40" />
          </div>
          <span className="font-valorant text-sm tracking-wider text-white/90">
            WAITING FOR OPPONENT
          </span>
          <p className="text-xs text-white/40 font-sans mt-1.5 max-w-[210px] leading-relaxed">
            Invite a friend, share your code, or join an existing party.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-2 shrink-0">
          {partyCode && (
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-sm text-xs">
              <span className="text-white/40 font-mono text-[11px]">Party:</span>
              <div className="flex items-center gap-1.5 font-mono text-white/90 font-medium">
                <span>#{showPartyCode ? partyCode : "••••••"}</span>
                {onToggleRevealCode && (
                  <button
                    type="button"
                    onClick={onToggleRevealCode}
                    className="text-white/40 hover:text-white/80 p-0.5 transition cursor-pointer"
                    title={showPartyCode ? "Hide code" : "Reveal code"}
                  >
                    {showPartyCode ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {onOpenInvite && (
            <button
              type="button"
              onClick={onOpenInvite}
              className="w-full py-2.5 px-3 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display font-bold text-xs tracking-wider uppercase rounded-sm transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-[0_0_15px_rgba(255,70,85,0.25)]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>INVITE FRIEND</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            {onCopyCode && (
              <button
                type="button"
                onClick={onCopyCode}
                className="w-full py-2 px-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-display font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                title={partyCode ? `Party Code: #${partyCode}` : "Copy Party Code"}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-mint" />
                    <span className="text-mint truncate">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-white/50" />
                    <span className="truncate">{partyCode ? "COPY CODE" : "SHARE CODE"}</span>
                  </>
                )}
              </button>
            )}

            {onOpenJoinDialog && (
              <button
                type="button"
                onClick={onOpenJoinDialog}
                className="w-full py-2 px-2 bg-white/5 hover:bg-[#FF4655]/10 border border-white/10 hover:border-[#FF4655]/40 text-white/80 hover:text-white font-display font-bold text-xs uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Hash className="h-3.5 w-3.5 text-[#FF4655]" />
                <span className="truncate">JOIN PARTY</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isLeader = role === "LEADER" || role === "HOST";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between flex-1 h-full min-h-[340px] max-h-[480px] max-w-[280px] sm:max-w-[300px] w-full border bg-[#07090e]/80 backdrop-blur-md rounded-sm p-4 overflow-hidden transition-all duration-300",
        isLeader
          ? "border-[#FF4655]/40 hover:border-[#FF4655]/60"
          : "border-mint/30 hover:border-mint/50"
      )}
    >
      {bannerPath && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={bannerPath}
            alt={name}
            fill
            sizes="(max-width: 640px) 180px, 300px"
            className="object-cover object-top scale-[1.02] group-hover:scale-105 transition-transform duration-500 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#040609]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#040609] via-[#040609]/90 to-transparent" />
        </div>
      )}

      <div className="w-full flex items-center justify-between z-10 shrink-0">
        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-xs font-sans text-xs font-semibold uppercase tracking-wider",
            isLeader
              ? "bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/30"
              : "bg-mint/15 text-mint border border-mint/25"
          )}
        >
          {isLeader && <Crown className="h-3 w-3" />}
          <span>{isLeader ? "Host" : "Challenger"}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#040609]/80 border border-white/10 text-xs font-sans text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span>Ready</span>
          </div>

          {canKick && onKick && (
            <button
              type="button"
              onClick={onKick}
              className="p-1 rounded-xs bg-[#040609]/80 text-white/50 hover:text-[#FF4655] hover:bg-[#FF4655]/20 border border-white/10 hover:border-[#FF4655]/30 transition cursor-pointer"
              title="Kick player"
              aria-label="Kick player"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full z-10 pt-4 shrink-0 text-left">
        <span
          className={cn(
            "text-xs font-sans font-medium block mb-0.5",
            isLeader ? "text-[#FF4655]" : "text-mint"
          )}
        >
          {subtitle}
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white truncate">
          {name}
        </h3>
      </div>
    </div>
  );
}