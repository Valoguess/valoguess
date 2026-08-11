import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type PlayerBadgeProps = {
  name: string;
  rank: string;
  rankColor: string;
  avatarFrom: string;
  avatarTo: string;
  nosUsed: number;
  nosMax: number;
  align: "left" | "right";
  isYourTurn?: boolean;
  ringColor: string;
};

export function PlayerBadge({
  name,
  rank,
  rankColor,
  avatarFrom,
  avatarTo,
  nosUsed,
  nosMax,
  align,
  isYourTurn,
  ringColor,
}: PlayerBadgeProps) {
  const initials = name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex items-center gap-5",
        align === "right" && "flex-row-reverse"
      )}
    >
      {/* ================= Avatar ================= */}

      <div className="relative shrink-0">
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{ backgroundColor: ringColor }}
        />

        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full p-[3px]"
          style={{
            background: `linear-gradient(135deg, ${ringColor}, rgba(255,255,255,.15))`,
          }}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-full text-3xl font-black text-white"
            style={{
              background: `linear-gradient(145deg, ${avatarFrom}, ${avatarTo})`,
            }}
          >
            {initials}
          </div>
        </div>

        {isYourTurn && (
          <div
            className={cn(
              "absolute -top-3",
              align === "left" ? "-right-2" : "-left-2"
            )}
          >
            <div className="clip-tag border border-accent bg-accent px-2.5 py-1">
              <span className="font-display text-[10px] font-black uppercase tracking-[0.18em] text-white">
                YOUR TURN
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================= Info ================= */}

      <div
        className={cn(
          "flex min-w-[210px] flex-col",
          align === "right" && "items-end"
        )}
      >
        {/* Name */}

        <h3 className="font-display text-[26px] font-black uppercase tracking-[0.08em] text-white">
          {name}
        </h3>

        {/* Rank */}

        <div
          className={cn(
            "mt-2 flex items-center gap-2",
            align === "right" && "flex-row-reverse"
          )}
        >
          <div
            className="flex items-center gap-1 rounded-full border px-2.5 py-1"
            style={{
              borderColor: `${rankColor}55`,
              backgroundColor: `${rankColor}12`,
            }}
          >
            <Crown
              size={12}
              style={{ color: rankColor }}
            />

            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: rankColor }}
            >
              {rank}
            </span>
          </div>
        </div>

        {/* No Counter */}

        <div
          className={cn(
            "mt-5 flex items-center gap-3",
            align === "right" && "flex-row-reverse"
          )}
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            No's
          </span>

          <div
            className={cn(
              "flex gap-1",
              align === "right" && "flex-row-reverse"
            )}
          >
            {Array.from({ length: nosMax }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-[7px] w-7 rounded-full transition-all",
                  i < nosUsed
                    ? "bg-accent shadow-[0_0_8px_rgba(255,70,85,.8)]"
                    : "bg-white/10"
                )}
              />
            ))}
          </div>

          <span className="font-display text-lg font-bold text-accent">
            {nosUsed}/{nosMax}
          </span>
        </div>
      </div>

      {/* Decorative Accent */}

      <div
        className={cn(
          "absolute top-1/2 hidden h-px w-20 -translate-y-1/2 bg-gradient-to-r from-accent to-transparent xl:block",
          align === "left"
            ? "-right-24"
            : "-left-24 rotate-180"
        )}
      />

      <div
        className={cn(
          "absolute top-1/2 hidden h-2 w-2 -translate-y-1/2 rotate-45 border border-accent bg-[#090b11] xl:block",
          align === "left"
            ? "-right-5"
            : "-left-5"
        )}
      />
    </div>
  );
}