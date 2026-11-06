"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Shield, Lock, Clock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, getAgentById } from "@/lib/data";

interface MatchIntroOverlayProps {
  secretAgentId?: string | null;
  userName?: string;
  opponentName?: string;
  gameStatus?: string;
  startingAt?: number;
  startingEndsAt?: number;
  onComplete: () => void;
  minDurationMs?: number;
}

export function MatchIntroOverlay({
  secretAgentId,
  userName = "You",
  opponentName = "Opponent",
  gameStatus = "STARTING",
  startingAt,
  startingEndsAt,
  onComplete,
}: MatchIntroOverlayProps) {
  const targetAgent: Agent = getAgentById(secretAgentId);

  const [now, setNow] = useState(Date.now());
  const initialEndsAtRef = useRef(Date.now() + 6000);
  const targetEndsAt =
    startingEndsAt ||
    (startingAt ? startingAt + 6000 : initialEndsAtRef.current);
  const secondsRemaining = Math.max(0, Math.ceil((targetEndsAt - now) / 1000));
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameStatus === "PLAYING") {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 7000);
    return () => clearTimeout(fallbackTimer);
  }, [gameStatus, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#040609] select-none overflow-hidden font-body">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={90}
          className="object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040609]/80 to-[#040609]" />
      </div>

      <div className="relative z-10 w-full pt-8 pb-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF4655] animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655]">
            VALORANT // GUESS THE AGENT
          </span>
        </div>
        <h1 className="font-valorant text-2xl sm:text-3xl tracking-wider text-white uppercase">
          YOUR SECRET AGENT
        </h1>
        <p className="text-xs font-mono text-white/50 tracking-wider mt-1 uppercase">
          GUESS YOUR OPPONENT&apos;S AGENT BEFORE THEY GUESS YOURS
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

          <div className="relative w-36 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 border-mint/50 overflow-hidden flex flex-col justify-between bg-[#080c14] shadow-2xl">
            <div className="absolute top-2 left-2 z-20 h-2.5 w-2.5 border-t-2 border-l-2 border-mint/80" />
            <div className="absolute top-2 right-2 z-20 h-2.5 w-2.5 border-t-2 border-r-2 border-mint/80" />
            <div className="absolute bottom-2 left-2 z-20 h-2.5 w-2.5 border-b-2 border-l-2 border-mint/80" />
            <div className="absolute bottom-2 right-2 z-20 h-2.5 w-2.5 border-b-2 border-r-2 border-mint/80" />

            <div className="relative z-10 flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-mint" />
                <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase text-mint truncate">
                  SECRET AGENT
                </span>
              </div>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-mint/20 text-mint text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider border border-mint/40">
                <Lock className="h-2 w-2" /> LOCKED
              </span>
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={targetAgent.bannerPath}
                alt={targetAgent.name}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 p-3 sm:p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-mint/60 mb-1.5" />
              <h2 className="font-valorant text-lg sm:text-2xl font-black uppercase text-white tracking-wider">
                {targetAgent.name}
              </h2>
              <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-mint mt-0.5">
                {targetAgent.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="h-6 sm:h-8 w-px bg-white/10 mb-2 sm:mb-3" />

          <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-full border border-white/20 bg-[#080c14] flex items-center justify-center shadow-lg">
            <span className="font-valorant text-base sm:text-xl font-black text-white leading-none">
              VS
            </span>
          </div>

          <div className="h-6 sm:h-8 w-px bg-white/10 mt-2 sm:mt-3" />

          <div className="mt-2 sm:mt-3 flex flex-col items-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/5 border border-white/10">
              <Clock className="h-3 w-3 text-[#FF4655]" />
              <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums tracking-wider">
                {formattedMinutes}:{formattedSeconds}
              </span>
            </div>
            <span className="text-[7.5px] sm:text-[8px] font-mono uppercase tracking-widest text-white/40 mt-1">
              ROUND 1 IN
            </span>
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

          <div className="relative w-36 sm:w-56 md:w-64 aspect-[4/6] rounded-sm border-2 border-white/15 bg-[#080a12] overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-2 left-2 z-20 h-2.5 w-2.5 border-t-2 border-l-2 border-white/30" />
            <div className="absolute top-2 right-2 z-20 h-2.5 w-2.5 border-t-2 border-r-2 border-white/30" />
            <div className="absolute bottom-2 left-2 z-20 h-2.5 w-2.5 border-b-2 border-l-2 border-white/30" />
            <div className="absolute bottom-2 right-2 z-20 h-2.5 w-2.5 border-b-2 border-r-2 border-white/30" />

            <div className="relative z-10 flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3 text-white/50" />
                <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase text-white/50 truncate">
                  OPPONENT&apos;S AGENT
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded-xs bg-white/10 text-white/70 text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider border border-white/15">
                HIDDEN
              </span>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-valorant text-5xl sm:text-7xl font-black text-white/10 select-none">
                ?
              </span>
            </div>

            <div className="relative z-10 p-3 sm:p-4 pt-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-white/20 mb-1.5" />
              <h2 className="font-valorant text-base sm:text-xl font-black uppercase text-white/70 tracking-wider">
                UNKNOWN
              </h2>
              <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-white/40 mt-0.5">
                GUESS TO REVEAL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-8 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF4655] animate-ping" />
          <span className="font-mono text-xs text-white/70 tracking-widest uppercase">
            {gameStatus === "PLAYING"
              ? "MATCH STARTING..."
              : `MATCH STARTS IN 00:0${secondsRemaining}`}
          </span>
        </div>
      </div>
    </div>
  );
}
