"use client";

import React from "react";
import Image from "next/image";
import { Crown, X, UserPlus, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerPodiumCardProps {
  isVacant?: boolean;
  name?: string;
  role?: "LEADER" | "CHALLENGER" | "MEMBER";
  subtitle?: string;
  bannerPath?: string;
  canKick?: boolean;
  onKick?: () => void;
  onOpenInvite?: () => void;
  onCopyCode?: () => void;
  copied?: boolean;
}

export function PlayerPodiumCard({
  isVacant = false,
  name = "AGENT",
  role = "MEMBER",
  subtitle = "1V1 DUELIST",
  bannerPath,
  canKick = false,
  onKick,
  onOpenInvite,
  onCopyCode,
  copied = false,
}: PlayerPodiumCardProps) {
  if (isVacant) {
    return (
      <div className="flex flex-col items-center justify-between flex-1 h-full min-h-[300px] max-h-[500px] max-w-[280px] w-full border border-dashed border-white/20 hover:border-white/40 bg-[#080c14]/60 backdrop-blur-md rounded-sm p-4 transition-all">
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 px-2 py-0.5 rounded-xs bg-white/5 border border-white/10">
            OPEN SLOT
          </span>
          <span className="text-[10px] font-mono tracking-wider text-white/30 uppercase">
            1V1 DUEL
          </span>
        </div>

        <div className="flex flex-col items-center text-center my-auto py-6">
          <div className="h-14 w-14 rounded-full border border-white/20 bg-white/[0.03] flex items-center justify-center text-white/50 mb-3 group-hover:scale-105 transition-transform">
            <UserPlus className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-sm sm:text-base tracking-wider text-white/80 uppercase">
            WAITING FOR OPPONENT
          </span>
          <span className="text-[11px] text-white/40 font-mono mt-1 max-w-[180px]">
            Invite a friend or share party code to begin
          </span>
        </div>

        <div className="w-full flex flex-col gap-2 pt-2 border-t border-white/10">
          {onOpenInvite && (
            <button
              type="button"
              onClick={onOpenInvite}
              className="w-full py-2 px-3 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold tracking-wider uppercase rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>INVITE FRIEND</span>
            </button>
          )}

          {onCopyCode && (
            <button
              type="button"
              onClick={onCopyCode}
              className="w-full py-1.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-display text-xs font-bold tracking-wider uppercase rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-mint" />
                  <span className="text-mint">CODE COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>COPY PARTY CODE</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  const isLeader = role === "LEADER";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between flex-1 h-full min-h-[300px] max-h-[500px] max-w-[280px] w-full border bg-[#080c14]/85 backdrop-blur-md rounded-sm p-3.5 overflow-hidden transition-all duration-300",
        isLeader
          ? "border-[#FF4655]/40 hover:border-[#FF4655]/70"
          : "border-mint/30 hover:border-mint/60"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5",
          isLeader ? "bg-[#FF4655]" : "bg-mint"
        )}
      />

      <div className="w-full flex items-center justify-between z-10 shrink-0">
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-xs font-display text-[9px] font-bold uppercase tracking-wider",
            isLeader
              ? "bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/40"
              : "bg-mint/15 text-mint border border-mint/30"
          )}
        >
          {isLeader && <Crown className="h-2.5 w-2.5" />}
          <span>{role}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[9px] font-display font-bold text-mint tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            <span>READY</span>
          </div>

          {canKick && onKick && (
            <button
              type="button"
              onClick={onKick}
              className="p-1 rounded-xs text-white/40 hover:text-[#FF4655] hover:bg-[#FF4655]/10 border border-transparent hover:border-[#FF4655]/30 transition cursor-pointer"
              title="Kick player"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full flex-1 my-3 overflow-hidden rounded-sm border border-white/10 bg-base-950">
        {bannerPath && (
          <Image
            src={bannerPath}
            alt={name}
            fill
            sizes="(max-width: 640px) 150px, 280px"
            className="object-cover object-top scale-102 group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/40 via-transparent to-transparent" />
      </div>

      <div className="w-full text-center z-10 pt-1 shrink-0">
        <h3 className="font-display text-base sm:text-xl font-black uppercase tracking-wider text-white truncate">
          {name}
        </h3>
        <span
          className={cn(
            "text-[9px] sm:text-[10px] font-display font-bold tracking-widest uppercase block mt-0.5",
            isLeader ? "text-[#FF4655]" : "text-mint"
          )}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
