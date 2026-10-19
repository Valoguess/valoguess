"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Swords,
  Trophy,
  HelpCircle,
  Settings as SettingsIcon,
  User,
  Edit3,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  savedUsername?: string;
  onOpenHowToPlay?: () => void;
  onOpenLogout?: () => void;
}

export function TopNavbar({
  savedUsername,
  onOpenHowToPlay,
  onOpenLogout,
}: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const isLobby = pathname === "/lobby";
  const isHistory = pathname === "/history";
  const isLeaderboard = pathname === "/leaderboard";
  const isSettings = pathname === "/settings";

  const displayName = user?.name || savedUsername || "AGENT";

  return (
    <header className="relative z-30 w-full h-16 bg-[#080B10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-lg select-none">
      {/* Left: Brand Logo + Slogan */}
      <Link href="/" className="flex items-center gap-3 group shrink-0">
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
          <div className="flex items-baseline gap-1 m-0">
            <span className="text-sm tracking-wider text-white">VALO</span>
            <span className="text-sm tracking-wider text-accent">GUESS</span>
          </div>
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-white/40 mt-1 hidden sm:block">
            ASK. ELIMINATE. GUESS. <span className="text-accent">WIN.</span>
          </span>
        </div>
      </Link>

      {/* Center: Main Valorant Tactical Tabs */}
      <nav className="flex items-center gap-1.5 md:gap-2">
        {/* Home Landing */}
        <Link
          href="/"
          className={cn(
            "h-10 w-10 flex items-center justify-center rounded-sm border transition",
            pathname === "/"
              ? "border-accent/40 bg-accent/15 text-accent shadow-[0_0_12px_rgba(255,70,85,0.2)]"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white"
          )}
          title="Home"
        >
          <Home className="h-4.5 w-4.5" />
        </Link>

        {/* PLAY TAB (Central Valorant Style Tab) */}
        <Link
          href="/lobby"
          className={cn(
            "relative px-6 sm:px-10 h-10 flex items-center justify-center clip-tag font-valorant text-sm sm:text-base tracking-[0.2em] transition-all cursor-pointer",
            isLobby
              ? "bg-gradient-to-r from-accent via-accent to-accent-dim text-white shadow-[0_0_20px_rgba(255,70,85,0.4)]"
              : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white hover:border-white/25"
          )}
        >
          <span>PLAY</span>
        </Link>

        {/* CAREER / MATCH HISTORY */}
        <Link
          href="/history"
          className={cn(
            "h-10 px-3 sm:px-4 flex items-center gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
            isHistory
              ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_15px_rgba(255,70,85,0.25)]"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
          )}
          title="Career & Match History"
        >
          <Swords className="h-4 w-4" />
          <span className="hidden md:inline">CAREER</span>
        </Link>

        {/* LEADERBOARD */}
        <Link
          href="/leaderboard"
          className={cn(
            "h-10 px-3 sm:px-4 flex items-center gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
            isLeaderboard
              ? "border-amber-400/60 bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
          )}
          title="Leaderboard"
        >
          <Trophy className="h-4 w-4" />
          <span className="hidden md:inline">LEADERBOARD</span>
        </Link>

        {/* SETTINGS */}
        <Link
          href="/settings"
          className={cn(
            "h-10 px-3 sm:px-4 flex items-center gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
            isSettings
              ? "border-mint/60 bg-mint/15 text-mint shadow-[0_0_15px_rgba(60,242,196,0.25)]"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
          )}
          title="Tactical Settings"
        >
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden lg:inline">SETTINGS</span>
        </Link>

        {/* How To Play Help Button */}
        {onOpenHowToPlay && (
          <button
            onClick={onOpenHowToPlay}
            className="h-10 w-10 hidden sm:flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
        )}
      </nav>

      {/* Right: Online Indicator + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border border-mint/30 bg-mint/5 text-mint text-[9px] font-display font-bold uppercase tracking-wider">
          <div className="h-2 w-2 rounded-full bg-mint animate-pulse shadow-[0_0_8px_#3cf2c4]" />
          <span>ONLINE</span>
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.03] hover:border-accent/50 hover:bg-accent/10 text-white transition group"
          title="Account & Profile Settings"
        >
          <User className="h-3.5 w-3.5 text-accent" />
          <span className="font-valorant text-xs tracking-wider text-white max-w-[120px] truncate">
            {displayName}
          </span>
          <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white transition hidden sm:inline" />
        </Link>

        {/* Optional Logout Trigger when provided */}
        {onOpenLogout && (
          <button
            onClick={onOpenLogout}
            className="p-2 rounded-sm border border-white/10 bg-white/2 hover:bg-accent/15 hover:border-accent/40 text-white/50 hover:text-accent transition cursor-pointer"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
