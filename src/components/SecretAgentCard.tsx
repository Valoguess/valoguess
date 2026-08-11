import { Agent } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Gauge, Grid3x3, Hash, Map } from "lucide-react";
import Image from "next/image";

type SecretAgentCardProps = {
  agent: Agent;
  time: string;
  round: number;
  maxRounds: number;
  yourTurn: boolean;
  map: string;
};

export function SecretAgentCard({
  agent,
  time,
  round,
  maxRounds,
  yourTurn,
  map,
}: SecretAgentCardProps) {
  return (
    <section className="overflow-hidden rounded-md border border-accent/30 bg-base-900 shadow-[0_0_25px_rgba(255,70,85,.05)]">
      {/* Header */}

      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.24em] text-accent">
          Your Secret Agent
        </h2>
      </div>

      {/* Portrait */}

      <div className="relative h-[400px] overflow-hidden">
        <div>

          <Image
            src={`/agents/banner/${agent.id}.png`}
            alt={agent.name}
            fill
            priority
            className="object-cover"
          />

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

          {/* Corner Accents */}

          <div className="absolute left-0 top-0 h-5 w-5">
            <div className="absolute left-0 top-0 h-px w-5 bg-accent" />
            <div className="absolute left-0 top-0 h-5 w-px bg-accent" />
          </div>

          <div className="absolute right-0 top-0 h-5 w-5">
            <div className="absolute right-0 top-0 h-px w-5 bg-accent" />
            <div className="absolute right-0 top-0 h-5 w-px bg-accent" />
          </div>

          <div className="absolute bottom-0 left-0 h-5 w-5">
            <div className="absolute bottom-0 left-0 h-px w-5 bg-accent" />
            <div className="absolute bottom-0 left-0 h-5 w-px bg-accent" />
          </div>

          <div className="absolute bottom-0 right-0 h-5 w-5">
            <div className="absolute bottom-0 right-0 h-px w-5 bg-accent" />
            <div className="absolute bottom-0 right-0 h-5 w-px bg-accent" />
          </div>

          {/* ================= MATCH HUD ================= */}
          {/* <div className=" border-t border-white/10 bg-black/30 backdrop-blur-sm px-5 py-4">

            <div className="text-center">

                <div
                    className={cn(
                        "font-display text-[34px] font-black tabular-nums transition-all",
                        yourTurn
                            ? "text-white"
                            : "text-zinc-500"
                    )}
                >
                  1:20
                </div>

                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    Round {round} / {maxRounds}
                </div>

                <div
                    className={cn(
                        "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 transition-all",
                        yourTurn
                            ? "border-accent/40 bg-accent/10"
                            : "border-white/10 bg-white/[0.02]"
                    )}
                >
                    <span
                        className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            yourTurn
                                ? "bg-accent shadow-[0_0_10px_#ff4655]"
                                : "bg-zinc-500"
                        )}
                    />

                    <span
                        className={cn(
                            "text-[10px] uppercase tracking-[0.18em]",
                            yourTurn
                                ? "text-accent"
                                : "text-zinc-400"
                        )}
                    >
                        {yourTurn
                            ? "Your Turn"
                            : "Opponent's Turn"}
                    </span>

                </div>

            </div>

          </div> */}
        </div>


        {/* Agent Name */}

        <div className="absolute inset-x-0 bottom-5 text-center">

          <h3 className="font-display text-3xl font-black uppercase tracking-[0.12em] text-white drop-shadow-lg">
            {agent.name}
          </h3>

          <div className="mt-2 inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-200">
              {agent.role}
            </span>
          </div>

        </div>
      </div>
      {/* ================= INFO ================= */}

      <div className="border-t border-white/10 bg-base-900">

        {/* Match Details */}

        <div className="border-b border-white/10 px-5 py-4">

          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-[11px] uppercase tracking-[0.24em] text-accent">
              Match Details
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              Live
            </span>
          </div>

          <div className="space-y-1">
            <InfoRow
              icon={<Grid3x3 size={14} />}
              label="Mode"
              value="1v1 Duel"
            />

            {/* <InfoRow
              icon={<Map size={14} />}
              label="Map"
              value={map}
            /> */}

            <InfoRow
              icon={<Hash size={14} />}
              label="Questions"
              value="1 / Round"
            />

            <InfoRow
              icon={<Gauge size={14} />}
              label="Rounds"
              value={maxRounds > 0 ? `${maxRounds}` : "Unlimited"}
            />
          </div>

        </div>


      </div>

    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-md border border-transparent px-2 py-2 transition-all duration-200 hover:border-white/5 hover:bg-white/[0.025]">
      <div className="flex items-center gap-3">
        {/* Icon */}

        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400 transition group-hover:border-accent/40 group-hover:text-accent">
          {icon}
        </div>

        {/* Label */}

        <span className="text-sm font-medium text-zinc-400">
          {label}
        </span>
      </div>

      {/* Value */}

      <span className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-white">
        {value}
      </span>
    </div>
  );
}