"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Skull,
  Shield,
  ArrowRight,
  Unlock,
  Swords,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, getAgentById } from "@/lib/data";
import { useGameStore } from "@/store/gameStore";
import { leaveGame } from "@/socket/emitter";

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
  const { clearGame } = useGameStore();

  const [hasUnmasked, setHasUnmasked] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.ceil(durationMs / 1000),
  );

  const myAgentObj: Agent = getAgentById(myAgentId);
  const oppAgentObj: Agent = getAgentById(oppAgentId);

  useEffect(() => {
    const unmaskTimer = setTimeout(() => {
      setHasUnmasked(true);
    }, 500);

    return () => clearTimeout(unmaskTimer);
  }, []);

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
          subtitle: "AGENT GUESSED • YOU WON",
          textColor: "text-mint",
          borderColor: "border-mint/50",
          icon: Trophy,
        }
      : {
          title: "DEFEAT",
          subtitle: "YOUR AGENT WAS GUESSED",
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
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040609]/80 to-[#040609]" />
      </div>

      <div className="relative z-10 w-full pt-8 pb-3 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full animate-ping", theme.textColor)} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655]">
            VALORANT // MATCH FINISHED
          </span>
        </div>

        <h1
          className={cn(
            "font-valorant text-4xl sm:text-6xl md:text-7xl tracking-wider uppercase select-none",
            theme.textColor,
          )}
        >
          {theme.title}
        </h1>

        <p className="text-xs font-mono text-white/50 tracking-wider uppercase mt-1">
          {theme.subtitle} • {roundsPlayed} {roundsPlayed === 1 ? "ROUND" : "ROUNDS"}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-3 sm:px-6 flex items-center justify-center gap-3 sm:gap-8 md:gap-14 my-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-mint">
              [YOU]
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-wider max-w-[110px] sm:max-w-[180px] truncate uppercase">
              {userName}
            </span>
          </div>

          <div className="relative w-36 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 border-white/20 overflow-hidden flex flex-col justify-between bg-[#080c14] shadow-2xl">
            <div className="absolute top-2 left-2 z-20 h-2.5 w-2.5 border-t-2 border-l-2 border-mint/80" />
            <div className="absolute top-2 right-2 z-20 h-2.5 w-2.5 border-t-2 border-r-2 border-mint/80" />
            <div className="absolute bottom-2 left-2 z-20 h-2.5 w-2.5 border-b-2 border-l-2 border-mint/80" />
            <div className="absolute bottom-2 right-2 z-20 h-2.5 w-2.5 border-b-2 border-r-2 border-mint/80" />

            <div className="relative z-10 flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-mint" />
                <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase text-mint">
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

            <div className="relative z-10 p-3 sm:p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-mint/60 mb-1.5" />
              <h2 className="font-valorant text-lg sm:text-2xl font-black uppercase text-white tracking-wider">
                {myAgentObj.name}
              </h2>
              <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-mint mt-0.5">
                {myAgentObj.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="h-6 sm:h-8 w-px bg-white/10 mb-2 sm:mb-3" />

          <div
            className={cn(
              "relative h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 bg-[#080c14] flex items-center justify-center shadow-lg transition-all",
              theme.borderColor,
            )}
          >
            <OutcomeIcon className={cn("h-6 w-6 sm:h-8 sm:w-8", theme.textColor)} />
          </div>

          <div className="h-6 sm:h-8 w-px bg-white/10 mt-2 sm:mt-3" />

          <div className="mt-2 sm:mt-3 flex flex-col items-center">
            <div className="px-2.5 py-1 rounded-xs bg-white/5 border border-white/10">
              <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                {roundsPlayed} {roundsPlayed === 1 ? "ROUND" : "ROUNDS"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-[#8C7BFF]">
              [OPPONENT]
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white tracking-wider max-w-[110px] sm:max-w-[180px] truncate uppercase">
              {opponentName}
            </span>
          </div>

          <div
            className={cn(
              "relative w-36 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 overflow-hidden flex flex-col justify-between bg-[#080c14] shadow-2xl transition-all duration-300",
              hasUnmasked ? "border-[#8C7BFF]/70" : "border-white/15",
            )}
          >
            <div className="absolute top-2 left-2 z-20 h-2.5 w-2.5 border-t-2 border-l-2 border-[#8C7BFF]/80" />
            <div className="absolute top-2 right-2 z-20 h-2.5 w-2.5 border-t-2 border-r-2 border-[#8C7BFF]/80" />
            <div className="absolute bottom-2 left-2 z-20 h-2.5 w-2.5 border-b-2 border-l-2 border-[#8C7BFF]/80" />
            <div className="absolute bottom-2 right-2 z-20 h-2.5 w-2.5 border-b-2 border-r-2 border-[#8C7BFF]/80" />

            <div className="relative z-10 flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <Unlock className="h-3 w-3 text-[#8C7BFF]" />
                <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase text-[#8C7BFF]">
                  OPPONENT&apos;S AGENT
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-xs bg-[#8C7BFF]/20 text-[#8C7BFF] text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider border border-[#8C7BFF]/40">
                {hasUnmasked ? "REVEALED" : "HIDDEN"}
              </span>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              {hasUnmasked ? (
                <img
                  src={oppAgentObj.bannerPath || `/agents/banner/${oppAgentObj.id}.webp`}
                  alt={oppAgentObj.name}
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-opacity duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-valorant text-5xl sm:text-7xl font-black text-white/10 select-none">
                    ?
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 p-3 sm:p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-[#8C7BFF]/60 mb-1.5" />
              <h2 className="font-valorant text-lg sm:text-2xl font-black uppercase text-white tracking-wider">
                {hasUnmasked ? oppAgentObj.name : "REVEALING..."}
              </h2>
              <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C7BFF] mt-0.5">
                {hasUnmasked ? oppAgentObj.role : "AGENT"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 pb-8 flex flex-col items-center gap-3">
        <div className="w-full flex flex-col items-center gap-1.5">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              style={{
                width: `${(secondsRemaining / (durationMs / 1000)) * 100}%`,
              }}
              className={cn(
                "h-full transition-all duration-1000 ease-linear",
                isVictory ? "bg-mint" : isTie ? "bg-amber-400" : "bg-[#FF4655]",
              )}
            />
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-white/50 uppercase">
            <Clock className="h-3 w-3" />
            VIEWING STATS IN 00:0{secondsRemaining}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onComplete}
            className="flex-1 py-2.5 px-6 bg-[#FF4655] hover:bg-[#ff5a67] text-white text-xs font-display font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
          >
            <span>VIEW MATCH STATS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/lobby"
            onClick={() => {
              leaveGame();
              clearGame();
            }}
            className="py-2.5 px-5 rounded-xs border border-white/15 bg-white/5 hover:bg-white/10 text-white font-display text-xs font-bold uppercase tracking-wider transition"
          >
            RETURN TO LOBBY
          </Link>
        </div>
      </div>
    </div>
  );
}
