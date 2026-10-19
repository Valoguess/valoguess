"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy, Shield, Swords, Sparkles, ArrowRight, Target, Zap } from "lucide-react";
import { TopNavbar } from "@/components/navigation/TopNavbar";

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#040609] text-white flex flex-col font-body selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Background artwork */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover opacity-20 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/90 via-[#040609]/80 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#040609_90%)]" />
      </div>

      {/* Unified Top Navbar */}
      <TopNavbar />

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        {/* Glow emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-amber-400/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative h-24 w-24 rounded-full border-2 border-amber-400/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.35)]">
            <Trophy className="h-12 w-12 stroke-[1.5]" />
          </div>
        </div>

        {/* Header Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-[10px] uppercase tracking-[0.25em] mb-4">
          <Sparkles className="h-3 w-3" />
          <span>PROTOCOL // COMPETITIVE DIVISION</span>
        </div>

        {/* Title */}
        <h1 className="font-valorant text-3xl sm:text-5xl lg:text-6xl tracking-wider text-white mb-3">
          GLOBAL <span className="text-amber-400">LEADERBOARDS</span>
        </h1>

        {/* Coming Soon Notice */}
        <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-sm border border-amber-400/50 bg-gradient-to-r from-amber-400/20 via-amber-400/10 to-amber-400/20 font-valorant text-lg sm:text-xl text-amber-300 tracking-[0.3em] uppercase mb-6 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          <span>COMING SOON</span>
        </div>

        <p className="max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed font-body mb-10">
          Ranked matchmaking, seasonal MMR calibration, and global competitive standing are currently being deployed. Prepare your deductive skills for protocol rankings.
        </p>

        {/* Upcoming Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12 text-left">
          {/* Card 1 */}
          <div className="p-5 rounded-sm border border-white/10 bg-[#080B10]/80 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="h-9 w-9 rounded-sm bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3.5">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="font-valorant text-sm tracking-wider text-white mb-1.5">
              COMPETITIVE MMR
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time Elo rating evaluated per match based on elimination efficiency, guess accuracy, and victory margins.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-sm border border-white/10 bg-[#080B10]/80 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="h-9 w-9 rounded-sm bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-3.5">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="font-valorant text-sm tracking-wider text-white mb-1.5">
              RADIANT TIERS
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Progress through regional tiers from Iron to Radiant and unlock exclusive titles, profile banners, and accolades.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-sm border border-white/10 bg-[#080B10]/80 backdrop-blur-md hover:border-amber-400/40 transition-colors">
            <div className="h-9 w-9 rounded-sm bg-mint/10 border border-mint/30 flex items-center justify-center text-mint mb-3.5">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="font-valorant text-sm tracking-wider text-white mb-1.5">
              TACTICAL ARCHIVES
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detailed head-to-head records, win-loss streaks, and historical match breakdowns across all agent encounters.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/lobby"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-accent hover:bg-accent-dim text-white font-valorant text-xs tracking-[0.2em] uppercase rounded-sm shadow-[0_0_25px_rgba(255,70,85,0.45)] transition cursor-pointer active:scale-98"
        >
          <Swords className="h-4 w-4" />
          <span>RETURN TO LOBBY</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
