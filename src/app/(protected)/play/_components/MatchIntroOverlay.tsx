"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, HelpCircle, Lock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS, Agent, getAgentById } from "@/lib/data";

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
  minDurationMs = 4500,
}: MatchIntroOverlayProps) {
  // Find target agent or fallback to first
  const targetAgent: Agent = getAgentById(secretAgentId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Optical timer tracking
  const [now, setNow] = useState(Date.now());
  const initialEndsAtRef = useRef(Date.now() + 7000);
  const targetEndsAt =
    startingEndsAt ||
    (startingAt ? startingAt + 7000 : initialEndsAtRef.current);
  const secondsRemaining = Math.max(0, Math.ceil((targetEndsAt - now) / 1000));
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);

  // Preload all agent banners into memory immediately to prevent shuffle lag
  useEffect(() => {
    if (typeof window !== "undefined") {
      AGENTS.forEach((agent) => {
        const img = new window.Image();
        img.src = agent.bannerPath;
      });
    }
  }, []);

  const currentAgent = isLocked
    ? targetAgent
    : AGENTS[currentIndex] || targetAgent;

  // Decelerating shuffle loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();
    const shuffleDuration = 3400; // 3.4s shuffle

    const tick = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= shuffleDuration) {
        setIsLocked(true);
        setTimeout(() => setHasRevealed(true), 150);
        return;
      }

      // Smooth deceleration curve
      let delay = 50;
      if (elapsed > 1600 && elapsed <= 2400) {
        delay = 100;
      } else if (elapsed > 2400 && elapsed <= 2900) {
        delay = 180;
      } else if (elapsed > 2900) {
        delay = 280;
      }

      setCurrentIndex((prev) => (prev + 1) % AGENTS.length);
      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  // When locked and status is PLAYING (or after countdown completes), trigger onComplete
  useEffect(() => {
    if (!isLocked) return;

    if (gameStatus === "PLAYING") {
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Safety fallback
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 10000);
    return () => clearTimeout(fallbackTimer);
  }, [isLocked, gameStatus, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#040609] select-none overflow-hidden font-body">
      {/* BACKGROUND ARTWORK */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040609]/70 to-[#040609]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      </div>

      {/* TOP HEADER STATUS BAR */}
      <div className="relative z-10 w-full pt-8 pb-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">
            VALORANT PROTOCOL // DUEL INITIALIZATION
          </span>
        </div>
        <h1 className="font-valorant text-2xl md:text-3xl tracking-[0.2em] text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          ASSIGNING SECRET AGENTS
        </h1>
        <p className="text-xs font-display font-medium text-white/50 tracking-wider mt-1 uppercase">
          {isLocked
            ? "YOUR SECRET IDENTITY HAS BEEN SECURED — ELIMINATE YOUR OPPONENT'S AGENT"
            : "DECRYPTING DATABASE & SELECTING CLASSIFIED AGENT..."}
        </p>
      </div>

      {/* CENTER: VS MATCHUP DISPLAY */}
      <div className="relative z-10 w-full max-w-6xl px-2 sm:px-6 flex items-center justify-center gap-2 min-[420px]:gap-3 sm:gap-6 md:gap-14 my-auto">
        {/* 1. LEFT CARD: CURRENT PLAYER AGENT CARD */}
        <div className="flex flex-col items-center">
          {/* Player Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[11px] font-display font-bold uppercase tracking-[0.2em] text-[#3CF2C4]">
              [YOU]
            </span>
            <span className="font-valorant text-xs sm:text-base text-white tracking-wider max-w-[100px] sm:max-w-[180px] truncate">
              {userName}
            </span>
          </div>

          {/* Card Container */}
          <motion.div
            animate={
              isLocked
                ? { scale: [1, 1.05, 1], transition: { duration: 0.35 } }
                : {}
            }
            className={cn(
              "relative w-32 min-[420px]:w-38 sm:w-56 md:w-64 lg:w-76 aspect-[4/6] rounded-sm border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 backdrop-blur-xl bg-[#080c14]",
              isLocked
                ? "border-[#3CF2C4] shadow-[0_0_35px_rgba(60,242,196,0.4)]"
                : "border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.8)]",
            )}
          >
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-l-2 border-[#3CF2C4]/80" />
            <div className="absolute top-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-r-2 border-[#3CF2C4]/80" />
            <div className="absolute bottom-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-l-2 border-[#3CF2C4]/80" />
            <div className="absolute bottom-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-r-2 border-[#3CF2C4]/80" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between p-2 sm:p-3.5 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Shield className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 text-[#3CF2C4]" />
                <span className="text-[7.5px] sm:text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[#3CF2C4] truncate">
                  {isLocked ? "SECRET AGENT" : "CHOOSING"}
                </span>
              </div>
              {isLocked && (
                <span className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded bg-[#3CF2C4]/20 text-[#3CF2C4] text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-widest border border-[#3CF2C4]/40 animate-pulse">
                  <Lock className="h-2 sm:h-2.5 w-2 sm:w-2.5" /> LOCKED
                </span>
              )}
            </div>

            {/* Optimized High-Performance Image Display (No DOM Thrashing) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                key={isLocked ? "locked" : undefined}
                src={currentAgent.bannerPath}
                alt={currentAgent.name}
                decoding="async"
                className={cn(
                  "w-full h-full object-cover object-top transition-transform duration-200",
                  isLocked ? "scale-100" : "scale-105",
                )}
                style={{ willChange: "transform" }}
              />

              {/* Locked celebratory glare flash */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-[#3CF2C4]/25 pointer-events-none"
                />
              )}

              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Agent Details */}
            <div className="relative z-10 p-2 sm:p-4 pt-6 sm:pt-10 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-[#3CF2C4]/60 mb-1.5 sm:mb-2" />
              <h2 className="font-valorant text-lg sm:text-2xl md:text-3xl font-black uppercase text-white tracking-[0.1em] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {currentAgent.name}
              </h2>
              <span className="text-[8px] sm:text-[10px] font-display font-semibold uppercase tracking-[0.25em] text-[#3CF2C4] mt-0.5">
                {currentAgent.role}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 2. CENTER: V / S EMBLEM & STARTING COUNTDOWN */}
        <div className="flex flex-col items-center justify-center shrink-0 mx-0.5 sm:mx-2">
          {/* Angular decorative brackets */}
          <div className="h-6 sm:h-10 w-px bg-gradient-to-b from-transparent via-accent to-transparent mb-2 sm:mb-3" />

          <div className="relative flex items-center justify-center">
            {/* Glow halo */}
            <div className="absolute inset-0 rounded-full bg-accent/25 blur-xl scale-150 animate-pulse pointer-events-none" />

            {/* PERFECTLY CENTERED CIRCLE */}
            <div className="relative h-12 w-12 min-[420px]:h-16 min-[420px]:w-16 md:h-24 md:w-24 rounded-full border-2 border-accent/70 bg-[#080c14] flex items-center justify-center shadow-[0_0_35px_rgba(255,70,85,0.45)]">
              <span className="font-valorant text-base min-[420px]:text-xl md:text-4xl font-black text-white leading-none select-none tracking-normal drop-shadow-[0_0_12px_#ff4655]">
                VS
              </span>
            </div>
          </div>

          <div className="h-5 sm:h-8 w-px bg-gradient-to-b from-accent via-accent to-transparent mt-2 sm:mt-3" />

          {/* STARTING COUNTDOWN TIMER BADGE */}
          <div className="mt-2 sm:mt-3 flex flex-col items-center">
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm bg-accent/15 border border-accent/40 shadow-[0_0_12px_rgba(255,70,85,0.25)]">
              <Clock className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 text-accent animate-pulse" />
              <span className="font-mono text-xs sm:text-sm font-black text-white tabular-nums tracking-wider">
                {formattedMinutes}:{formattedSeconds}
              </span>
            </div>
            <span className="text-[7px] sm:text-[8.5px] font-mono uppercase tracking-[0.25em] text-white/50 mt-1">
              ROUND 1 IN
            </span>
          </div>
        </div>

        {/* 3. RIGHT CARD: OPPONENT'S QUESTION MARK CARD */}
        <div className="flex flex-col items-center">
          {/* Opponent Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-[9px] sm:text-[11px] font-display font-bold uppercase tracking-[0.2em] text-[#8C7BFF]">
              [OPPONENT]
            </span>
            <span className="font-valorant text-xs sm:text-base text-white tracking-wider max-w-[100px] sm:max-w-[180px] truncate">
              {opponentName}
            </span>
          </div>

          {/* Card Container */}
          <div className="relative w-32 min-[420px]:w-38 sm:w-56 md:w-64 lg:w-76 aspect-[4/6] rounded-sm border-2 border-[#8C7BFF]/40 bg-[#080a12] shadow-[0_0_25px_rgba(140,123,255,0.15)] overflow-hidden flex flex-col justify-between backdrop-blur-xl group">
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-l-2 border-[#8C7BFF]/60" />
            <div className="absolute top-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-r-2 border-[#8C7BFF]/60" />
            <div className="absolute bottom-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-l-2 border-[#8C7BFF]/60" />
            <div className="absolute bottom-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-r-2 border-[#8C7BFF]/60" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between p-2 sm:p-3.5 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <HelpCircle className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 text-[#8C7BFF]" />
                <span className="text-[7.5px] sm:text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[#8C7BFF] truncate">
                  TARGET
                </span>
              </div>
              <span className="px-1 sm:px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-widest border border-accent/40">
                CLASSIFIED
              </span>
            </div>

            {/* Center: Holographic Question Mark & Scanning Laser Bar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,123,255,0.15)_0%,transparent_70%)]" />

              <motion.div
                animate={{ y: [-90, 90, -90] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF4655] to-transparent opacity-75 shadow-[0_0_12px_#ff4655]"
              />

              <div className="relative flex items-center justify-center">
                <span className="font-valorant text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/90 via-[#8C7BFF]/80 to-transparent drop-shadow-[0_0_20px_rgba(140,123,255,0.6)] select-none">
                  ?
                </span>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="relative z-10 p-2 sm:p-4 pt-6 sm:pt-10 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-12 bg-[#8C7BFF]/60 mb-1.5 sm:mb-2" />
              <h2 className="font-valorant text-sm sm:text-xl md:text-2xl font-black uppercase text-white tracking-[0.1em]">
                UNKNOWN
              </h2>
              <span className="text-[7.5px] sm:text-[9.5px] font-display font-medium uppercase tracking-[0.2em] text-white/50 mt-0.5">
                UNMASK IN BATTLE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER STATUS */}
      <div className="relative z-10 pb-8 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-accent rotate-45 animate-spin" />
          <span className="font-mono text-xs text-white/80 tracking-[0.2em] uppercase">
            {isLocked
              ? gameStatus === "PLAYING"
                ? "DUEL COMMENCING..."
                : `STANDBY // ROUND 1 IN 00:0${secondsRemaining}`
              : "SELECTING CLASSIFIED AGENT..."}
          </span>
        </div>
      </div>
    </div>
  );
}
