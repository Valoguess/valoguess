"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Skull,
  Shield,
  ArrowRight,
  Lock,
  Unlock,
  Swords,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENTS, Agent, getAgentById } from "@/lib/data";
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
  const { clearGame } = useGameStore();

  const [hasUnmasked, setHasUnmasked] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.ceil(durationMs / 1000),
  );

  // Resolve agent entities
  const myAgentObj: Agent = getAgentById(myAgentId);
  const oppAgentObj: Agent = getAgentById(oppAgentId);

  // Trigger unmasking animation after 700ms for dramatic reveal
  useEffect(() => {
    const unmaskTimer = setTimeout(() => {
      setHasUnmasked(true);
    }, 700);

    return () => clearTimeout(unmaskTimer);
  }, []);

  // Countdown timer for automatic advancement
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

  // Color schemes based on match outcome
  const theme = isTie
    ? {
        title: "DRAW",
        subtitle: "STALEMATE // ALL PROTOCOLS EXHAUSTED",
        glowColor: "rgba(245, 158, 11, 0.5)",
        textColor: "text-amber-400",
        borderColor: "border-amber-500/60",
        badgeBg: "bg-amber-500/20",
        badgeBorder: "border-amber-500/40",
        badgeText: "text-amber-400",
        flashColor: "bg-amber-400/20",
        icon: Swords,
      }
    : isVictory
      ? {
          title: "VICTORY",
          subtitle: "TARGET IDENTIFIED // PROTOCOL CONCLUDED",
          glowColor: "rgba(60, 242, 196, 0.6)",
          textColor: "text-[#3CF2C4]",
          borderColor: "border-[#3CF2C4]/60",
          badgeBg: "bg-[#3CF2C4]/20",
          badgeBorder: "border-[#3CF2C4]/40",
          badgeText: "text-[#3CF2C4]",
          flashColor: "bg-[#3CF2C4]/25",
          icon: Trophy,
        }
      : {
          title: "DEFEAT",
          subtitle: "MISSION FAILED // IDENTITY COMPROMISED",
          glowColor: "rgba(255, 70, 85, 0.6)",
          textColor: "text-accent",
          borderColor: "border-accent/60",
          badgeBg: "bg-accent/20",
          badgeBorder: "border-accent/40",
          badgeText: "text-accent",
          flashColor: "bg-accent/25",
          icon: Skull,
        };

  const OutcomeIcon = theme.icon;

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
          className="object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040609]/75 to-[#040609]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      </div>

      {/* INITIAL IMPACT FLASH */}
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className={cn(
          "absolute inset-0 z-50 pointer-events-none",
          theme.flashColor,
        )}
      />

      {/* TOP HEADER: BIG DRAMATIC TITLE SLAM */}
      <div className="relative z-10 w-full pt-6 md:pt-8 pb-3 flex flex-col items-center text-center">
        {/* Sub-header Protocol Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mb-1"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full animate-ping",
              theme.textColor,
            )}
          />
          <span
            className={cn(
              "text-[10px] font-mono font-bold uppercase tracking-[0.3em]",
              theme.textColor,
            )}
          >
            VALORANT PROTOCOL // MATCH COMPLETE
          </span>
        </motion.div>

        {/* Slam-In Main Title */}
        <motion.div
          initial={{ scale: 2.2, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 14,
            stiffness: 120,
            delay: 0.1,
          }}
          className="relative"
        >
          <h1
            className={cn(
              "font-valorant text-3xl sm:text-5xl md:text-7xl tracking-[0.2em] sm:tracking-[0.25em] uppercase select-none drop-shadow-2xl",
              theme.textColor,
            )}
            style={{
              textShadow: `0 0 35px ${theme.glowColor}, 0 0 70px ${theme.glowColor}`,
            }}
          >
            {theme.title}
          </h1>
        </motion.div>

        {/* Subtitle with expanding decorative lines */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 sm:gap-3 mt-1 px-4"
        >
          <div
            className={cn(
              "h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-current opacity-60",
              theme.textColor,
            )}
          />
          <p className="text-[9.5px] sm:text-xs font-display font-bold text-white/70 tracking-[0.2em] sm:tracking-[0.25em] uppercase truncate">
            {theme.subtitle}
          </p>
          <div
            className={cn(
              "h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-current opacity-60",
              theme.textColor,
            )}
          />
        </motion.div>
      </div>

      {/* CENTER: FACE-OFF REVEAL CARDS */}
      <div className="relative z-10 w-full max-w-6xl px-2 sm:px-6 flex items-center justify-center gap-2 min-[420px]:gap-3 sm:gap-6 md:gap-12 my-auto">
        {/* 1. LEFT CARD: YOUR AGENT */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          {/* Player Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
            <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[#3CF2C4]">
              [YOU]
            </span>
            <span className="font-valorant text-xs sm:text-base text-white tracking-wider max-w-[100px] sm:max-w-[160px] truncate">
              {userName}
            </span>
          </div>

          {/* Card Container */}
          <div className="relative w-32 min-[420px]:w-38 sm:w-56 md:w-68 aspect-[4/6] rounded-sm border-2 border-white/20 shadow-[0_0_25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between backdrop-blur-xl bg-[#080c14]">
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-l-2 border-[#3CF2C4]/80" />
            <div className="absolute top-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-t-2 border-r-2 border-[#3CF2C4]/80" />
            <div className="absolute bottom-2 left-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-l-2 border-[#3CF2C4]/80" />
            <div className="absolute bottom-2 right-2 z-20 h-2 sm:h-3 w-2 sm:w-3 border-b-2 border-r-2 border-[#3CF2C4]/80" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-black/85 to-transparent">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Shield className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#3CF2C4]" />
                <span className="text-[7.5px] sm:text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[#3CF2C4]">
                  IDENTITY
                </span>
              </div>
              <span className="px-1 sm:px-1.5 py-0.5 rounded bg-[#3CF2C4]/15 text-[#3CF2C4] text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-widest border border-[#3CF2C4]/30">
                ASSIGNED
              </span>
            </div>

            {/* Agent Banner Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={myAgentObj.bannerPath || `/agents/banner/${myAgentObj.id}.webp`}
                alt={myAgentObj.name}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Agent Details */}
            <div className="relative z-10 p-2 sm:p-3 pt-6 sm:pt-8 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-10 bg-[#3CF2C4]/60 mb-1 sm:mb-1.5" />
              <h2 className="font-valorant text-base sm:text-2xl md:text-3xl font-black uppercase text-white tracking-[0.1em] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {myAgentObj.name}
              </h2>
              <span className="text-[7.5px] sm:text-[9px] font-display font-semibold uppercase tracking-[0.25em] text-[#3CF2C4] mt-0.5">
                {myAgentObj.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. CENTER: OUTCOME EMBLEM & ROUND STATS */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.35 }}
          className="flex flex-col items-center justify-center shrink-0 mx-0.5 sm:mx-2 md:mx-3"
        >
          <div className="h-6 sm:h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent mb-1.5 sm:mb-2" />

          {/* Glowing Center Badge */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-xl scale-150 animate-pulse pointer-events-none"
              style={{ backgroundColor: theme.glowColor }}
            />
            <div
              className={cn(
                "relative h-12 w-12 min-[420px]:h-16 min-[420px]:w-16 md:h-22 md:w-22 rounded-full border-2 bg-[#080c14] flex flex-col items-center justify-center shadow-2xl transition-all",
                theme.borderColor,
              )}
            >
              <OutcomeIcon
                className={cn("h-5 w-5 min-[420px]:h-7 min-[420px]:w-7 md:h-9 md:w-9", theme.textColor)}
              />
            </div>
          </div>

          <div className="h-5 sm:h-6 md:h-10 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent mt-1.5 sm:mt-2" />

          {/* Round Summary Tag */}
          <div className="mt-1.5 sm:mt-2 flex flex-col items-center">
            <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 rounded-sm bg-white/5 border border-white/15">
              <span className="font-mono text-[9px] sm:text-xs font-bold text-white tracking-widest uppercase">
                {roundsPlayed} {roundsPlayed === 1 ? "ROUND" : "ROUNDS"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3. RIGHT CARD: OPPONENT'S AGENT (DRAMATIC REVEAL) */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col items-center"
        >
          {/* Opponent Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
            <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[#8C7BFF]">
              [OPPONENT]
            </span>
            <span className="font-valorant text-xs sm:text-base text-white tracking-wider max-w-[100px] sm:max-w-[160px] truncate">
              {opponentName}
            </span>
          </div>

          {/* Card Container */}
          <div
            className={cn(
              "relative w-32 min-[420px]:w-38 sm:w-56 md:w-68 aspect-[4/6] rounded-sm border-2 overflow-hidden flex flex-col justify-between backdrop-blur-xl bg-[#080c14] transition-all duration-500",
              hasUnmasked
                ? "border-[#8C7BFF] shadow-[0_0_35px_rgba(140,123,255,0.35)]"
                : "border-[#8C7BFF]/40 shadow-[0_0_20px_rgba(140,123,255,0.15)]",
            )}
          >
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 z-20 h-3 w-3 border-t-2 border-l-2 border-[#8C7BFF]/80" />
            <div className="absolute top-2 right-2 z-20 h-3 w-3 border-t-2 border-r-2 border-[#8C7BFF]/80" />
            <div className="absolute bottom-2 left-2 z-20 h-3 w-3 border-b-2 border-l-2 border-[#8C7BFF]/80" />
            <div className="absolute bottom-2 right-2 z-20 h-3 w-3 border-b-2 border-r-2 border-[#8C7BFF]/80" />

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between p-2 sm:p-3 bg-gradient-to-b from-black/85 to-transparent">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {hasUnmasked ? (
                  <Unlock className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-[#8C7BFF]" />
                ) : (
                  <Lock className="h-2.5 sm:h-3 w-2.5 sm:w-3 text-accent" />
                )}
                <span className="text-[7.5px] sm:text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[#8C7BFF]">
                  TARGET
                </span>
              </div>
              <span
                className={cn(
                  "px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-mono font-black uppercase tracking-widest border transition-colors",
                  hasUnmasked
                    ? "bg-[#8C7BFF]/20 text-[#8C7BFF] border-[#8C7BFF]/40"
                    : "bg-accent/20 text-accent border-accent/40",
                )}
              >
                {hasUnmasked ? "UNMASKED" : "CLASSIFIED"}
              </span>
            </div>

            {/* Revealed Image or Unmasking Hologram */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {hasUnmasked ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <img
                      src={oppAgentObj.bannerPath || `/agents/banner/${oppAgentObj.id}.webp`}
                      alt={oppAgentObj.name}
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>

                  {/* Dramatic Unmask Glare Flash */}
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-[#8C7BFF]/30 pointer-events-none"
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <span className="font-valorant text-5xl sm:text-7xl font-black text-[#8C7BFF]/60 animate-pulse select-none">
                      ?
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Agent Details */}
            <div className="relative z-10 p-2 sm:p-3 pt-6 sm:pt-8 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center text-center">
              <div className="h-0.5 w-8 sm:w-10 bg-[#8C7BFF]/60 mb-1 sm:mb-1.5" />
              <h2 className="font-valorant text-base sm:text-2xl md:text-3xl font-black uppercase text-white tracking-[0.1em] drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {hasUnmasked ? oppAgentObj.name : "DECRYPTING..."}
              </h2>
              <span className="text-[7.5px] sm:text-[9px] font-display font-semibold uppercase tracking-[0.25em] text-[#8C7BFF] mt-0.5">
                {hasUnmasked ? oppAgentObj.role : "IDENTIFYING"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ACTION BAR & PROGRESS COUNTDOWN */}
      <div className="relative z-10 w-full max-w-xl px-6 pb-6 md:pb-8 flex flex-col items-center gap-3">
        {/* Progress Countdown Bar */}
        <div className="w-full flex flex-col items-center gap-1">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: durationMs / 1000, ease: "linear" }}
              className={cn(
                "h-full",
                isVictory
                  ? "bg-[#3CF2C4]"
                  : isTie
                    ? "bg-amber-400"
                    : "bg-accent",
              )}
            />
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-white/50 uppercase">
            <Clock className="h-3 w-3" />
            CONTINUING TO SCORECARD IN 00:0{secondsRemaining}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onComplete}
            className="clip-tag flex-1 py-2.5 px-6 bg-accent hover:bg-accent-dim text-white text-xs font-display font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,70,85,0.25)] flex items-center justify-center gap-2 cursor-pointer transition hover:scale-[1.02]"
          >
            <span>VIEW MATCH REPORT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/lobby"
            onClick={() => clearGame()}
            className="rounded-sm border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-ink-300 hover:text-white py-2.5 px-5 text-xs font-display font-bold uppercase tracking-wider transition"
          >
            RETURN TO LOBBY
          </Link>
        </div>
      </div>
    </div>
  );
}
