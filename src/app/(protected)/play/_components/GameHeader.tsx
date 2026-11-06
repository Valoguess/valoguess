import { LogOut } from "lucide-react";
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
  return (
    <header className="border-b border-white/10 bg-[#080b10]/95 backdrop-blur-md relative select-none">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6 md:gap-8 px-2.5 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onLeave && (
            <button
              onClick={onLeave}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xs border border-white/10 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/60 text-white/50 hover:text-white transition-all text-[8.5px] sm:text-[9.5px] font-display font-bold uppercase tracking-widest cursor-pointer shrink-0"
              title="Leave Game"
            >
              <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/40 hover:text-[#FF4655] transition-colors" />
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

        <CenterHUD round={round} maxRounds={maxRounds} />

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
      <span className="font-valorant text-base md:text-xl tracking-[0.15em] text-white hidden sm:block">
        GUESS THE AGENT
      </span>
      <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40 mt-0.5 hidden sm:block">
        1V1 DUEL
      </div>

      <div className="flex sm:hidden items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
        <span className="font-valorant text-[10px] text-white/50">R{round}</span>
        <span className="text-white/20 text-xs">/</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">{timerText}</span>
      </div>

      <div className="mt-1 hidden sm:flex items-center gap-3">
        <div className="h-px w-6 sm:w-8 bg-white/10" />
        <div className="flex flex-col items-center">
          <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            ROUND {round} / {maxRoundsDisplay}
          </div>
          <div className="font-display text-2xl md:text-3xl font-black tabular-nums text-white leading-none mt-0.5">
            {timerText}
          </div>
        </div>
        <div className="h-px w-6 sm:w-8 bg-white/10" />
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
      <div className="relative shrink-0">
        <div
          className={cn(
            "relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 items-center justify-center rounded-full p-[1.5px] transition-all duration-200",
            turn
              ? "border-2 border-accent bg-accent/10"
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
          align === "right" ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 sm:gap-2",
            align === "right" && "flex-row-reverse",
          )}
        >
          <span className="font-display text-xs sm:text-base md:text-lg font-bold uppercase tracking-wide text-white truncate max-w-[65px] sm:max-w-[120px] md:max-w-none">
            {name}
          </span>

          <div
            className="hidden sm:flex items-center gap-1 rounded-xs border px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider"
            style={{
              borderColor: `${rankColor}44`,
              backgroundColor: `${rankColor}10`,
              color: rankColor,
            }}
          >
            {rank}
          </div>

          {turn && (
            <div
              className={cn(
                "rounded-xs border px-1.5 py-0.5 shrink-0",
                align === "left"
                  ? "border-accent bg-accent text-white"
                  : "border-[#8C7BFF]/50 bg-[#8C7BFF]/20 text-[#8C7BFF]",
              )}
            >
              <span className="font-display text-[7.5px] sm:text-[9px] font-bold uppercase tracking-wider">
                {align === "left" ? "YOUR TURN" : "THINKING"}
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-1 flex items-center gap-1.5 sm:gap-2.5",
            align === "right" && "flex-row-reverse",
          )}
        >
          <span className="text-[9px] font-mono uppercase tracking-wider text-white/40 hidden sm:inline">
            NO&apos;S USED
          </span>
          <span className="text-[8.5px] font-mono text-white/40 sm:hidden">
            NOs:
          </span>
          <span className="font-display text-xs sm:text-sm font-bold text-accent">
            {nosUsed} / {nosMax === -1 ? "∞" : nosMax}
          </span>

          {nosMax === -1 ? (
            <span className="font-display text-base font-bold text-accent">
              ∞
            </span>
          ) : (
            <div
              className={cn(
                "flex flex-col gap-1",
                align === "right" && "items-end",
              )}
            >
              <div
                className={cn(
                  "flex gap-1 sm:gap-1.5",
                  align === "right" && "flex-row-reverse",
                )}
              >
                {Array.from({ length: Math.min(5, nosMax) }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-200 border",
                      i < nosUsed
                        ? "bg-accent border-accent"
                        : "bg-white/[0.05] border-white/10",
                    )}
                  />
                ))}
              </div>

              {nosMax > 5 && (
                <div
                  className={cn(
                    "flex gap-1 sm:gap-1.5",
                    align === "right" && "flex-row-reverse",
                  )}
                >
                  {Array.from({ length: nosMax - 5 }).map((_, i) => {
                    const actualIdx = 5 + i;
                    return (
                      <div
                        key={actualIdx}
                        className={cn(
                          "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all duration-200 border",
                          actualIdx < nosUsed
                            ? "bg-accent border-accent"
                            : "bg-white/[0.05] border-white/10",
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
