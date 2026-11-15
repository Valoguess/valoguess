"use client";

import Image from "next/image";
import { Shield, Lock, EyeOff } from "lucide-react";
import { Agent } from "@/lib/data";

type SecretAgentCardProps = {
  agent: Agent;
  time: string;
  round: number;
  maxRounds: number;
  yourTurn: boolean;
  map: string;
};

export function SecretAgentCard({ agent }: SecretAgentCardProps) {
  return (
    <section className="overflow-hidden rounded-sm border border-white/10 bg-[#06080e]/95 backdrop-blur-md flex flex-col select-none">
      <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#FF4655]" />
          <span className="font-valorant text-xs uppercase tracking-wider text-white">
            YOUR SECRET AGENT
          </span>
        </div>
        <span className="text-xs font-mono text-mint uppercase bg-mint/10 border border-mint/30 px-2 py-0.5 rounded-xs flex items-center gap-1 font-bold">
          <Lock className="h-3 w-3" /> PROTECT
        </span>
      </div>

      <div className="relative h-[380px] overflow-hidden bg-black">
        <Image
          src={agent.bannerPath || `/agents/banner/${agent.id}.webp`}
          alt={agent.name}
          fill
          priority
          className="object-cover object-top"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-[#06080e]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-4 px-4 flex flex-col items-center text-center">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-mint font-bold mb-1">
            {agent.role}
          </span>
          <h3 className="font-valorant text-3xl font-black uppercase tracking-wider text-white">
            {agent.name}
          </h3>
        </div>
      </div>

      <div className="border-t border-white/10 p-4 space-y-3 bg-[#080b12]/60">
        <div className="flex items-start gap-2.5 p-3 rounded-sm bg-white/[0.02] border border-white/5">
          <EyeOff className="h-4 w-4 text-[#FF4655] shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
              CONFIDENTIAL IDENTITY
            </span>
            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Your opponent is attempting to deduce this agent. Answer their yes/no questions truthfully based on your agent&apos;s kit and appearance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
