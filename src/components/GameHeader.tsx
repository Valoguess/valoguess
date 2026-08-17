import { ArrowLeft, HelpCircle, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRoomStore } from "@/store/roomStore";
import { useRoomTimer } from "@/hooks/useRoomTimer";

type GameHeaderProps = {
  turnOwner: "you" | "opponent" | "opponent-thinking";
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
    <header className="border-b border-white/10 bg-[#090B11] relative">
      {/* HUD */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 px-6 py-4">
        <div className="flex items-center gap-4">
          {onLeave && (
            <button
              onClick={onLeave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/60 text-white/50 hover:text-white transition-all text-[9.5px] font-display font-bold uppercase tracking-widest cursor-pointer shadow-sm group shrink-0"
              title="Leave Game"
            >
              <LogOut className="h-3.5 w-3.5 text-white/40 group-hover:text-[#FF4655] transition-colors" />
              <span className="hidden sm:inline">LEAVE</span>
            </button>
          )}

          <PlayerSide
            align="left"
            name={userName}
            rank="Player 1"
            rankColor="#3CF2C4"
            avatar="/agents/icon/iso.png"
            nosUsed={userNosUsed}
            nosMax={nosMax}
            turn={turnOwner === "you"}
          />
        </div>

        <CenterHUD
          time={60}
          round={round}
          maxRounds={maxRounds}
        />

        <PlayerSide
          align="right"
          name={opponentName}
          rank="Player 2"
          rankColor="#8C7BFF"
          avatar="/agents/icon/yoru.png"
          nosUsed={opponentNosUsed}
          nosMax={nosMax}
          turn={turnOwner === "opponent" || turnOwner === "opponent-thinking"}
        />
      </div>
    </header>
  );
}

function CenterHUD({
  time,
  round,
  maxRounds,
}: {
  time: number;
  round: number;
  maxRounds: number;
}) {
  const maxRoundsDisplay = maxRounds === -1 || maxRounds <= 0 ? "∞" : maxRounds;
  const { room } = useRoomStore();
  const { timeLeft, formattedTime, isTimeUp } = useRoomTimer({ room });


  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <span className="font-valorant text-2xl tracking-[0.15em] text-white">GUESS THE AGENT</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-0.5">
        1V1 DUEL
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="h-px w-10 bg-accent/30" />
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            ROUND {round} / {maxRoundsDisplay}
          </div>
          <div className="font-display text-4xl font-black tabular-nums text-white leading-none mt-1">
            {timeLeft === -1 ? "∞" : (timeLeft > 0 ? formattedTime : "00:00")}
          </div>
          <div className="text-[9px] text-zinc-400 mt-1 uppercase tracking-wider">
            First player to guess the agent wins!
          </div>
        </div>
        <div className="h-px w-10 bg-accent/30" />
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
        "flex items-center gap-4",
        align === "right" && "flex-row-reverse"
      )}
    >
      {/* Avatar Container */}
      <div className="relative">
        {/* Glow behind avatar */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-md opacity-30 transition-all duration-300",
            turn ? "bg-accent scale-110 opacity-50" : "bg-zinc-700"
          )}
        />
        
        {/* Outer border ring */}
        <div
          className={cn(
            "relative flex h-16 w-16 items-center justify-center rounded-full p-[2px] transition-all duration-300",
            turn
              ? "bg-gradient-to-br from-accent via-accent/50 to-transparent shadow-[0_0_15px_rgba(255,70,85,0.4)]"
              : "border border-white/10 bg-white/[0.02]"
          )}
        >
          {/* Avatar Image Wrapper */}
          <div className="h-full w-full overflow-hidden rounded-full bg-base-950 relative">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div
        className={cn(
          "flex flex-col justify-center",
          align === "right" ? "items-end" : "items-start"
        )}
      >
        <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
          {/* Name */}
          <span className="font-display text-xl font-bold uppercase tracking-wide text-white">
            {name}
          </span>

          {/* Rank Badge */}
          <div
            className="flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
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
            <div className="clip-tag border border-accent bg-accent px-2 py-0.5">
              <span className="font-display text-[9px] font-black uppercase tracking-[0.18em] text-white">
                YOUR TURN
              </span>
            </div>
          )}
        </div>

        {/* No's indicators */}
        <div
          className={cn(
            "mt-2.5 flex items-center gap-3",
            align === "right" && "flex-row-reverse"
          )}
        >
          <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium">
            NO'S USED
          </span>
          <span className="font-display text-base font-bold text-accent">
            {nosUsed} / {nosMax === -1 ? "∞" : nosMax}
          </span>

          {/* Circle Dots */}
          {nosMax === -1 ? (
            <span className="font-display text-xl font-black text-accent drop-shadow-[0_0_6px_#ff4655]">
              ∞
            </span>
          ) : (
            <div className={cn("flex flex-col gap-1", align === "right" && "items-end")}>
              {/* Row 1: up to 5 dots */}
              <div className={cn("flex gap-1.5", align === "right" && "flex-row-reverse")}>
                {Array.from({ length: Math.min(5, nosMax) }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300 border",
                      i < nosUsed
                        ? "bg-accent border-accent shadow-[0_0_6px_#ff4655]"
                        : "bg-white/[0.05] border-white/10"
                    )}
                  />
                ))}
              </div>

              {/* Row 2: dots above 5 */}
              {nosMax > 5 && (
                <div className={cn("flex gap-1.5", align === "right" && "flex-row-reverse")}>
                  {Array.from({ length: nosMax - 5 }).map((_, i) => {
                    const actualIdx = 5 + i;
                    return (
                      <div
                        key={actualIdx}
                        className={cn(
                          "h-2 w-2 rounded-full transition-all duration-300 border",
                          actualIdx < nosUsed
                            ? "bg-accent border-accent shadow-[0_0_6px_#ff4655]"
                            : "bg-white/[0.05] border-white/10"
                        )}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}