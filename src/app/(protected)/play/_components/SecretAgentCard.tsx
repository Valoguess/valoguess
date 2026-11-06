import { Agent } from "@/lib/data";
import { Gauge, Grid3x3, Hash } from "lucide-react";
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
  maxRounds,
}: SecretAgentCardProps) {
  return (
    <section className="overflow-hidden rounded-sm border border-white/10 bg-[#080b10]/90 backdrop-blur-md">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-valorant text-xs uppercase tracking-wider text-[#FF4655]">
          YOUR SECRET AGENT
        </span>
        <span className="text-[9px] font-mono text-mint uppercase bg-mint/10 border border-mint/30 px-1.5 py-0.2 rounded-xs">
          PROTECT
        </span>
      </div>

      <div className="relative h-[360px] overflow-hidden bg-black">
        <Image
          src={agent.bannerPath || `/agents/banner/${agent.id}.webp`}
          alt={agent.name}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

        <div className="absolute left-2 top-2 h-3 w-3 border-t-2 border-l-2 border-[#FF4655]" />
        <div className="absolute right-2 top-2 h-3 w-3 border-t-2 border-r-2 border-[#FF4655]" />
        <div className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-[#FF4655]" />
        <div className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-[#FF4655]" />

        <div className="absolute inset-x-0 bottom-4 text-center">
          <h3 className="font-valorant text-2xl font-black uppercase tracking-wider text-white">
            {agent.name}
          </h3>

          <div className="mt-1.5 inline-flex rounded-xs border border-white/10 bg-black/60 px-2.5 py-0.5 backdrop-blur-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-mint">
              {agent.role}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-3.5 space-y-2">
        <InfoRow
          icon={<Grid3x3 size={13} />}
          label="Mode"
          value="1v1 Duel"
        />
        <InfoRow
          icon={<Hash size={13} />}
          label="Questions"
          value="1 / Round"
        />
        <InfoRow
          icon={<Gauge size={13} />}
          label="Rounds"
          value={maxRounds > 0 ? `${maxRounds}` : "Unlimited"}
        />
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
    <div className="flex items-center justify-between rounded-xs px-2 py-1.5 bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-2">
        <div className="text-white/40">
          {icon}
        </div>
        <span className="text-xs text-white/50 font-sans">{label}</span>
      </div>

      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
        {value}
      </span>
    </div>
  );
}
