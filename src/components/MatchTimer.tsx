import { Clock3 } from "lucide-react";

type MatchTimerProps = {
  round: number;
  totalRounds: number;
  time: string;
};

export function MatchTimer({
  round,
  totalRounds,
  time,
}: MatchTimerProps) {
  return (
    <div className="relative w-[440px]">
      {/* Glow */}

      <div className="absolute inset-0 rounded-xl bg-accent/10 blur-3xl" />

      {/* Top Label */}

      <div className="mb-3 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />

        <span className="font-display text-[11px] font-bold uppercase tracking-[0.35em] text-accent">
          ROUND {round} OF {totalRounds}
        </span>

        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60" />
      </div>

      {/* Frame */}

      <div className="relative overflow-hidden border border-white/10 bg-[#11151D] shadow-[0_0_20px_rgba(255,70,85,.08)]">

        {/* Cut Corners */}

        <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-accent" />

        <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-accent" />

        <div className="absolute bottom-0 left-0 h-5 w-5 border-l border-b border-accent" />

        <div className="absolute bottom-0 right-0 h-5 w-5 border-r border-b border-accent" />

        {/* Decorative Lines */}

        <div className="absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="absolute left-10 right-10 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Side Decorations */}

        <div className="absolute left-5 top-1/2 h-10 w-px -translate-y-1/2 bg-accent/30" />

        <div className="absolute right-5 top-1/2 h-10 w-px -translate-y-1/2 bg-accent/30" />

        {/* Content */}

        <div className="relative flex flex-col items-center py-8">

          <Clock3
            className="mb-2 text-accent/70"
            size={18}
          />

          <span className="font-display text-[62px] font-black leading-none tracking-[0.08em] text-white tabular-nums">
            {time}
          </span>

          <span className="mt-3 text-sm text-zinc-500">
            First player to correctly guess wins
          </span>
        </div>
      </div>
    </div>
  );
}