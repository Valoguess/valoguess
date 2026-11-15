"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Skull,
  Shield,
  ArrowRight,
  Swords,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, getAgentById } from "@/lib/data";
import { useGameStore } from "@/store/gameStore";

interface MatchEndingOverlayProps {
  isVictory: boolean;
  isTie?: boolean;
  userName?: string;
  opponentName?: string;
  myAgentId?: string | null;
  oppAgentId?: string | null;
  roundsPlayed?: number;
  onComplete: () => void;
  durationMs?: number;
}

export function MatchEndingOverlay({
  isVictory,
  isTie = false,
  userName = "You",
  opponentName = "Opponent",
  myAgentId,
  oppAgentId,
  roundsPlayed = 1,
  onComplete,
  durationMs = 5000,
}: MatchEndingOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.ceil(durationMs / 1000),
  );

  const myAgentObj: Agent = getAgentById(myAgentId);
  const oppAgentObj: Agent = getAgentById(oppAgentId);

  useEffect(() => {
    let completed = false;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    const completionTimer = setTimeout(() => {
      if (!completed) {
        completed = true;
        onComplete();
      }
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimer);
    };
  }, [onComplete, durationMs]);

  const theme = isTie
    ? {
        title: "DRAW",
        subtitle: "OUT OF GUESSES",
        textColor: "text-amber-400",
        borderColor: "border-amber-400/50",
        icon: Swords,
      }
    : isVictory
      ? {
          title: "VICTORY",
          subtitle: "OPPONENT'S AGENT DEDUCED",
          textColor: "text-mint",
          borderColor: "border-mint/50",
          icon: Trophy,
        }
      : {
          title: "DEFEAT",
          subtitle: "YOUR AGENT WAS DEDUCED",
          textColor: "text-[#FF4655]",
          borderColor: "border-[#FF4655]/50",
          icon: Skull,
        };

  const OutcomeIcon = theme.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#040609] select-none overflow-hidden font-body">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={90}
          className="object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#040609]/80 to-[#040609]" />
      </div>

      <div className="relative z-10 w-full pt-8 pb-3 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={cn("h-2 w-2 rounded-full animate-ping", theme.textColor)} />
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FF4655]">
            MATCH CONCLUDED
          </span>
        </div>

        <h1
          className={cn(
            "font-valorant text-5xl sm:text-7xl md:text-8xl tracking-wider uppercase select-none leading-none",
            theme.textColor,
          )}
        >
          {theme.title}
        </h1>

        <p className="text-xs font-mono text-white/50 tracking-wider uppercase mt-2">
          {theme.subtitle} • {roundsPlayed} {roundsPlayed === 1 ? "ROUND" : "ROUNDS"}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 flex items-center justify-center gap-4 sm:gap-8 md:gap-14 my-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-mint">
              [YOU]
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-wider max-w-[140px] truncate uppercase">
              {userName}
            </span>
          </div>

          <div className="relative w-40 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 border-white/20 overflow-hidden flex flex-col justify-between bg-[#080c14] shadow-2xl">
            <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-mint" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-mint">
                  YOUR AGENT
                </span>
              </div>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={myAgentObj.bannerPath || `/agents/banner/${myAgentObj.id}.webp`}
                alt={myAgentObj.name}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-10 sm:w-12 bg-mint/60 mb-2" />
              <h2 className="font-valorant text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
                {myAgentObj.name}
              </h2>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-mint mt-1">
                {myAgentObj.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="h-8 w-px bg-white/10 mb-3" />

          <div
            className={cn(
              "relative h-14 w-14 sm:h-18 sm:w-18 rounded-full border-2 bg-[#080c14] flex items-center justify-center shadow-lg transition-all",
              theme.borderColor,
            )}
          >
            <OutcomeIcon className={cn("h-7 w-7 sm:h-9 sm:w-9", theme.textColor)} />
          </div>

          <div className="h-8 w-px bg-white/10 mt-3" />
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-display font-bold uppercase tracking-wider text-[#8C7BFF]">
              [OPPONENT]
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-wider max-w-[140px] truncate uppercase">
              {opponentName}
            </span>
          </div>

          <div className="relative w-40 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 border-white/20 overflow-hidden flex flex-col justify-between bg-[#080c14] shadow-2xl">
            <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#FF4655]" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#FF4655]">
                  THEIR AGENT
                </span>
              </div>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={oppAgentObj.bannerPath || `/agents/banner/${oppAgentObj.id}.webp`}
                alt={oppAgentObj.name}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-10 sm:w-12 bg-[#FF4655]/60 mb-2" />
              <h2 className="font-valorant text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
                {oppAgentObj.name}
              </h2>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4655] mt-1">
                {oppAgentObj.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 flex flex-col items-center gap-3">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-valorant text-xs uppercase tracking-widest rounded-sm transition cursor-pointer shadow-[0_0_20px_rgba(255,70,85,0.4)] active:scale-98"
        >
          <span>VIEW MATCH SUMMARY</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <span className="text-xs font-mono text-white/40 tracking-wider">
          Auto-continuing in {secondsRemaining}s...
        </span>
      </div>
    </div>
  );
}
