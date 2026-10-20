import { ArrowLeft, HelpCircle, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useRoomTimer } from "@/hooks/useRoomTimer";
import { DEFAULT_AVATARS } from "@/consts";

type GameHeaderProps = {
  turnOwner: "you" | "opponent" | "opponent-thinking" | "freeform";
  userNosUsed: number;
  opponentNosUsed: number;
  userName?: string;
  opponentName?: string;
  nosMax?: number;
  round?: number;
  maxRounds?: number;
  onLeave?: () => void;
};

export function GameHeader({
  turnOwner,
  userNosUsed,
  opponentNosUsed,
  userName = "You",
  opponentName = "Opponent",
  nosMax = 5,
  round = 1,
  maxRounds = 10,
  onLeave,
}: GameHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-[#090B11] relative select-none">
      {/* HUD */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6 md:gap-8 px-2.5 sm:px-6 py-2 sm:py-3.5">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onLeave && (
            <button
              onClick={onLeave}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/60 text-white/50 hover:text-white transition-all text-[8.5px] sm:text-[9.5px] font-display font-bold uppercase tracking-widest cursor-pointer shadow-sm group shrink-0"
              title="Leave Game"
            >
              <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/40 group-hover:text-[#FF4655] transition-colors" />
              <span className="hidden md:inline">LEAVE</span>
            </button>
          )}

          <PlayerSide
            align="left"
            name={userName}
            rank="You"
            rankColor="#3CF2C4"
            avatar={DEFAULT_AVATARS.USER}
            nosUsed={userNosUsed}
            nosMax={nosMax}
            turn={turnOwner === "you"}
          />
        </div>

        <CenterHUD time={60} round={round} maxRounds={maxRounds} />

        <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-0">
          <PlayerSide
            align="right"
            name={opponentName}
            rank="Enemy"
            rankColor="#8C7BFF"
            avatar={DEFAULT_AVATARS.OPPONENT}
            nosUsed={opponentNosUsed}
            nosMax={nosMax}
            turn={turnOwner === "opponent" || turnOwner === "opponent-thinking"}
          />
        </div>
      </div>
    </header>
  );
}

function CenterHUD({
  round,
  maxRounds,
}: {
  time?: number;
  round: number;
  maxRounds: number;
}) {
  const maxRoundsDisplay = maxRounds === -1 || maxRounds <= 0 ? "∞" : maxRounds;
  const { game } = useGameStore();
  const { timeLeft, formattedTime, isInfinite } = useRoomTimer({ game });

  const timerText =
    isInfinite || timeLeft === -1
      ? "∞"
      : timeLeft > 0
        ? formattedTime
        : "00:00";

  return (
    <div className="flex flex-col items-center shrink-0">
      {/* Title (desktop only) */}
      <span className="font-valorant text-base md:text-xl tracking-[0.15em] text-white hidden sm:block">
        GUESS THE AGENT
      </span>
      <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 mt-0.5 hidden sm:block">
        1V1 DUEL
      </div>

      {/* Mobile-optimized Compact Pill */}
      <div className="flex sm:hidden items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
        <span className="font-valorant text-[10px] text-zinc-400">R{round}</span>
        <span className="text-white/20 text-xs">/</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">{timerText}</span>
      </div>

      {/* Desktop HUD with timer and lines */}
      <div className="mt-1 sm:mt-2 hidden sm:flex items-center gap-2 sm:gap-4">
        <div className="h-px w-6 sm:w-10 bg-accent/30" />
        <div className="flex flex-col items-center">
          <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            ROUND {round} / {maxRoundsDisplay}
          </div>
          <div className="font-display text-2xl md:text-3xl font-black tabular-nums text-white leading-none mt-0.5 sm:mt-1">
            {timerText}
          </div>
        </div>
        <div className="h-px w-6 sm:w-10 bg-accent/30" />
      </div>
    </div>
  );
}

function PlayerSide({
  name,
  rank,
  rankColor,
  avatar,
  nosUsed,
  nosMax,
  align,
  turn,
}: {
  name: string;
  rank: string;
  rankColor: string;
  avatar: string;
  nosUsed: number;
  nosMax: number;
  align: "left" | "right";
  turn?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0",
        align === "right" && "flex-row-reverse",
      )}
    >
      {/* Avatar Container */}
      <div className="relative shrink-0">
        {/* Glow behind avatar */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-md opacity-30 transition-all duration-300",
            turn ? "bg-accent scale-110 opacity-50" : "bg-zinc-700",
          )}
        />

        {/* Outer border ring */}
        <div
          className={cn(
            "relative flex h-10 w-10 sm:h-13 sm:w-13 md:h-15 md:w-15 items-center justify-center rounded-full p-[1.5px] sm:p-[2px] transition-all duration-300",
            turn
              ? "bg-gradient-to-br from-accent via-accent/50 to-transparent shadow-[0_0_15px_rgba(255,70,85,0.4)]"
              : "border border-white/10 bg-white/[0.02]",
          )}
        >
          {/* Avatar Image Wrapper */}
          <div className="h-full w-full overflow-hidden rounded-full bg-base-950 relative">
            <Image src={avatar} alt={name} fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div
        className={cn(
          "flex flex-col justify-center min-w-0",
          align === "right" ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 sm:gap-2.5",
            align === "right" && "flex-row-reverse",
          )}
        >
          {/* Name */}
          <span className="font-display text-xs sm:text-base md:text-lg font-bold uppercase tracking-wide text-white truncate max-w-[65px] sm:max-w-[120px] md:max-w-none">
            {name}
          </span>

          {/* Rank Badge */}
          <div
            className="hidden sm:flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
            style={{
              borderColor: `${rankColor}55`,
              backgroundColor: `${rankColor}12`,
              color: rankColor,
            }}
          >
            {rank}
          </div>

          {/* Turn Indicator */}
          {turn && (
            <div
              className={cn(
                "clip-tag border px-1.5 sm:px-2 py-0.5 shrink-0",
                align === "left"
                  ? "border-accent bg-accent"
                  : "border-[#8C7BFF]/50 bg-[#8C7BFF]/20",
              )}
            >
              <span className="font-display text-[7.5px] sm:text-[9px] font-black uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white">
                {align === "left" ? "YOUR TURN" : "THINKING"}
              </span>
            </div>
          )}
        </div>

        {/* Tactical Sub-label / NO Tracker */}
        <div className="flex items-center gap-1 mt-0.5 text-[9px] sm:text-[10px] font-mono text-white/40">
          <span>NOs:</span>
          <span className="text-white/80 font-bold">{nosUsed}</span>
          <span>/</span>
          <span>{nosMax}</span>
        </div>
      </div>
    </div>
  );
}
