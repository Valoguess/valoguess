"use client";

import { LogOut, Clock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
  const isMyTurn = turnOwner === "you";
  const isOpponentTurn = turnOwner === "opponent" || turnOwner === "opponent-thinking";

  return (
    <header className="border-b border-white/10 bg-[#06080e]/95 backdrop-blur-md relative select-none">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6 md:gap-8 px-3 sm:px-6 py-2.5 sm:py-3.5 max-w-[1800px] mx-auto">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {onLeave && (
            <button
              onClick={onLeave}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/50 text-white/50 hover:text-[#FF4655] transition-all text-xs font-display font-bold uppercase tracking-wider cursor-pointer shrink-0"
              title="Leave Match"
              aria-label="Leave Match"
            >
              <LogOut className="h-3.5 w-3.5 text-white/40 group-hover:text-[#FF4655]" />
              <span className="hidden md:inline">LEAVE</span>
            </button>
          )}

          <PlayerDuelSide
            align="left"
            name={userName}
            badge="YOU"
            badgeClass="border-mint/40 bg-mint/10 text-mint"
            avatar={DEFAULT_AVATARS.USER}
            nosUsed={userNosUsed}
            nosMax={nosMax}
            isTurn={isMyTurn}
            turnLabel="YOUR TURN"
          />
        </div>

        <DuelScoreboard round={round} maxRounds={maxRounds} turnOwner={turnOwner} />

        <div className="flex items-center justify-end gap-2.5 sm:gap-4 min-w-0">
          <PlayerDuelSide
            align="right"
            name={opponentName}
            badge="ENEMY"
            badgeClass="border-[#8C7BFF]/40 bg-[#8C7BFF]/10 text-[#8C7BFF]"
            avatar={DEFAULT_AVATARS.OPPONENT}
            nosUsed={opponentNosUsed}
            nosMax={nosMax}
            isTurn={isOpponentTurn}
            turnLabel={turnOwner === "opponent-thinking" ? "THINKING" : "THEIR TURN"}
          />
        </div>
      </div>
    </header>
  );
}

function DuelScoreboard({
  round,
  maxRounds,
  turnOwner,
}: {
  round: number;
  maxRounds: number;
  turnOwner: "you" | "opponent" | "opponent-thinking" | "freeform";
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
      <div className="flex items-center gap-2">
        <span className="font-valorant text-xs uppercase tracking-[0.2em] text-[#FF4655]">
          ROUND {round}
        </span>
        <span className="text-white/20 text-xs">•</span>
        <span className="text-xs font-mono text-white/40 uppercase">
          OF {maxRoundsDisplay}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        <div className="font-mono text-xl sm:text-2xl md:text-3xl font-bold tabular-nums text-white leading-none tracking-tight">
          {timerText}
        </div>
      </div>

      <div className="mt-1">
        {turnOwner === "you" ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-mint/15 border border-mint/40 text-mint text-xs font-mono font-bold tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            YOUR TURN
          </span>
        ) : turnOwner === "opponent-thinking" || turnOwner === "opponent" ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            ENEMY TURN
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] text-xs font-mono font-bold tracking-wider uppercase">
            FREEFORM DUEL
          </span>
        )}
      </div>
    </div>
  );
}

function PlayerDuelSide({
  name,
  badge,
  badgeClass,
  avatar,
  nosUsed,
  nosMax,
  align,
  isTurn,
  turnLabel,
}: {
  name: string;
  badge: string;
  badgeClass: string;
  avatar: string;
  nosUsed: number;
  nosMax: number;
  align: "left" | "right";
  isTurn?: boolean;
  turnLabel: string;
}) {
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 sm:gap-3.5 min-w-0",
        isRight && "flex-row-reverse",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full p-[2px] transition-all duration-300",
            isTurn
              ? isRight
                ? "ring-2 ring-[#8C7BFF] shadow-[0_0_12px_rgba(140,123,255,0.4)]"
                : "ring-2 ring-mint shadow-[0_0_12px_rgba(60,242,196,0.4)]"
              : "border border-white/10 bg-white/[0.02]",
          )}
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-black relative">
            <Image src={avatar} alt={name} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col justify-center min-w-0",
          isRight ? "items-end text-right" : "items-start text-left",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isRight && "flex-row-reverse",
          )}
        >
          <span className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white truncate max-w-[90px] sm:max-w-[140px] md:max-w-none">
            {name}
          </span>

          <span
            className={cn(
              "hidden sm:inline-flex px-1.5 py-0.5 rounded-xs border text-xs font-mono font-bold uppercase tracking-wider",
              badgeClass,
            )}
          >
            {badge}
          </span>
        </div>

        <div
          className={cn(
            "mt-1 flex items-center gap-2",
            isRight && "flex-row-reverse",
          )}
        >
          <span className="text-xs font-mono uppercase text-white/50 tracking-wider">
            NOs:
          </span>
          <span className="font-mono text-xs font-bold text-[#FF4655]">
            {nosUsed} / {nosMax === -1 ? "∞" : nosMax}
          </span>

          {nosMax > 0 && nosMax <= 10 && (
            <div
              className={cn(
                "hidden sm:flex gap-1 items-center",
                isRight && "flex-row-reverse",
              )}
            >
              {Array.from({ length: nosMax }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i < nosUsed
                      ? "bg-[#FF4655] shadow-[0_0_4px_rgba(255,70,85,0.6)]"
                      : "bg-white/15",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
