"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Swords, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-full w-full text-white flex flex-col font-body selection:bg-accent selection:text-white">
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg1.webp"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/85 via-[#040609]/80 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#040609_90%)]" />
      </div>

      <div className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center my-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-amber-400">
            <Trophy className="h-8 w-8" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xs border border-amber-400/20 bg-amber-400/5 text-amber-400 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span>PROTOCOL // COMPETITIVE DIVISION</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-valorant text-4xl sm:text-6xl tracking-wider text-white">
              GLOBAL <span className="text-amber-400">LEADERBOARDS</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xs border border-amber-400/30 bg-amber-400/10 font-valorant text-base sm:text-lg text-amber-300 tracking-[0.25em] uppercase">
              COMING SOON
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/lobby"
              className="inline-flex items-center gap-2.5 px-7 py-3 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer active:scale-98"
            >
              <Swords className="h-4 w-4" />
              <span>RETURN TO LOBBY</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
