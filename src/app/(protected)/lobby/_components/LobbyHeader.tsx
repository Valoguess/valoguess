"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Swords,
  Trophy,
  HelpCircle,
  Mail,
  Settings as SettingsIcon,
  User,
  Edit3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface LobbyHeaderProps {
  savedUsername: string;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export function LobbyHeader({
  savedUsername,
  onOpenHowToPlay,
  onOpenSettings,
}: LobbyHeaderProps) {

  const router = useRouter();

  return (
    <header className="relative z-20 w-full h-16 bg-[#080B10]/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0">
      {/* Left: Logo + Subtitle */}
      <Link href="/" className="flex items-center gap-3.5 group">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="ValoGuess Logo"
            fill
            className="object-contain transition-transform group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col text-left leading-none font-valorant">
          <h1 className="flex items-baseline gap-1 m-0">
            <span className="text-sm tracking-wider text-white">VALO</span>
            <span className="text-sm tracking-wider text-accent">GUESS</span>
            <span className="sr-only"> — The Tactical 1v1 Valorant Guess Who Game</span>
          </h1>
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-white/40 mt-1">
            ASK. ELIMINATE. GUESS. <span className="text-accent">WIN.</span>
          </span>
        </div>
      </Link>

      {/* Center: Navigation Bar & PLAY Header Tab */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-accent/40 bg-accent/15 text-accent shadow-[0_0_12px_rgba(255,70,85,0.2)]"
        >
          <Home className="h-4.5 w-4.5" />
        </Link>
        <div className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer">
          <Swords className="h-4.5 w-4.5" />
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer">
          <Trophy className="h-4.5 w-4.5" />
        </div>

        {/* LARGE RED CENTRAL "PLAY" TAB */}
        <div className="relative px-12 h-11 flex items-center justify-center clip-tag bg-gradient-to-r from-accent via-accent to-accent-dim text-white font-valorant text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(255,70,85,0.4)] mx-4">
          <span>PLAY</span>
        </div>

        <button
          onClick={onOpenHowToPlay}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
          title="How to Play"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
        <button
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
          title="Mail / Notifications"
        >
          <Mail className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
          title="Room Settings"
        >
          <SettingsIcon className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Right: Online Status & Username Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-mint/30 bg-mint/5 text-mint text-[10px] font-display font-bold uppercase tracking-wider">
          <div className="h-2 w-2 rounded-full bg-mint animate-pulse shadow-[0_0_8px_#3cf2c4]" />
          <span>ONLINE</span>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/40 bg-accent/10 hover:bg-accent/20 text-white transition group"
          title="Account & Profile Settings"
        >
          <User className="h-3.5 w-3.5 text-accent" />
          <span className="font-valorant text-xs tracking-wider text-white">
            {savedUsername || "AGENT"}
          </span>
          <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white transition" />
        </Link>
      </div>
    </header>
  );
}
