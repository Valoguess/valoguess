"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Swords,
  Trophy,
  HelpCircle,
  Settings as SettingsIcon,
  User,
  Edit3,
  LogOut,
  Users,
  Menu,
  X,
  Play,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  savedUsername?: string;
  onOpenHowToPlay?: () => void;
  onOpenLogout?: () => void;
  onOpenFriends?: () => void;
  friendRequestsCount?: number;
}

export function TopNavbar({
  savedUsername,
  onOpenHowToPlay,
  onOpenLogout,
  onOpenFriends,
  friendRequestsCount = 0,
}: TopNavbarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLobby = pathname === "/lobby";
  const isHistory = pathname === "/history";
  const isLeaderboard = pathname === "/leaderboard";
  const isSettings = pathname === "/settings";

  const displayName = user?.name || savedUsername || "AGENT";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="relative z-30 w-full h-13 sm:h-16 bg-[#080B10]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-lg select-none">
        {/* Left: Brand Logo + Slogan */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
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
              <span className="text-xs sm:text-sm tracking-wider text-white">VALO</span>
              <span className="text-xs sm:text-sm tracking-wider text-accent">GUESS</span>
            </div>
            <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-white/40 mt-0.5 sm:mt-1 hidden sm:block">
              ASK. ELIMINATE. GUESS. <span className="text-accent">WIN.</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Tabs (visible on md+) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 md:gap-2">
          {/* Home Landing */}
          <Link
            href="/"
            className={cn(
              "h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-sm border transition",
              pathname === "/"
                ? "border-accent/40 bg-accent/15 text-accent shadow-[0_0_12px_rgba(255,70,85,0.2)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white"
            )}
            title="Home"
          >
            <Home className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Link>

          {/* PLAY TAB (Central Valorant Style Tab) */}
          <Link
            href="/lobby"
            className={cn(
              "relative px-4 sm:px-8 md:px-10 h-8 sm:h-10 flex items-center justify-center clip-tag font-valorant text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] transition-all cursor-pointer",
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
              "h-8 px-2.5 sm:h-10 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isHistory
                ? "border-accent/60 bg-accent/15 text-accent shadow-[0_0_15px_rgba(255,70,85,0.25)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
            )}
            title="Career & Match History"
          >
            <Swords className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">CAREER</span>
          </Link>

          {/* LEADERBOARD */}
          <Link
            href="/leaderboard"
            className={cn(
              "h-8 px-2.5 sm:h-10 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isLeaderboard
                ? "border-amber-400/60 bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
            )}
            title="Leaderboard"
          >
            <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">LEADERBOARD</span>
          </Link>

          {/* SETTINGS */}
          <Link
            href="/settings"
            className={cn(
              "h-8 px-2.5 sm:h-10 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-sm border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isSettings
                ? "border-mint/60 bg-mint/15 text-mint shadow-[0_0_15px_rgba(60,242,196,0.25)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/15"
            )}
            title="Tactical Settings"
          >
            <SettingsIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">SETTINGS</span>
          </Link>

          {/* How To Play Help Button */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
              title="How to Play"
            >
              <HelpCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </button>
          )}
        </nav>

        {/* Right Section: Desktop User Profile (visible on md+) */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-mint/30 bg-mint/5 text-mint text-[9px] font-display font-bold uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-mint animate-pulse shadow-[0_0_8px_#3cf2c4]" />
            <span>ONLINE</span>
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15 bg-white/[0.03] hover:border-accent/50 hover:bg-accent/10 text-white transition group"
            title="Account & Profile Settings"
          >
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent" />
            <span className="font-valorant text-[11px] sm:text-xs tracking-wider text-white max-w-[120px] truncate">
              {displayName}
            </span>
            <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white transition" />
          </Link>

          {onOpenLogout && (
            <button
              onClick={onOpenLogout}
              className="p-1.5 sm:p-2 rounded-sm border border-white/10 bg-white/2 hover:bg-accent/15 hover:border-accent/40 text-white/50 hover:text-accent transition cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        {/* Mobile Action Controls (visible on screens < md) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {/* Quick Friends Drawer Trigger */}
          {onOpenFriends && (
            <button
              onClick={onOpenFriends}
              className="relative h-9 w-9 flex items-center justify-center rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 active:scale-95 transition"
              title="Friends & Party"
            >
              <Users className="h-4 w-4 text-accent" />
              {friendRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
              )}
            </button>
          )}

          {/* Tactical Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="h-9 w-9 flex items-center justify-center rounded-sm border border-white/15 bg-white/5 hover:bg-accent/15 hover:border-accent text-white transition active:scale-95 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-accent" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Tactical Drawer Navigation (< md) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeMenu}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-[#070a10] border-l border-white/10 p-5 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] z-50 animate-in slide-in-from-right duration-250 select-none">
            {/* Top: Identity Header & Close */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image src="/logo.svg" alt="logo" fill className="object-contain" />
                  </div>
                  <span className="font-valorant text-sm tracking-wider text-white">
                    VALO<span className="text-accent">GUESS</span>
                  </span>
                </div>

                <button
                  onClick={closeMenu}
                  className="p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Player Identity Card */}
              <Link
                href="/settings"
                onClick={closeMenu}
                className="mt-4 p-3 rounded-sm border border-white/10 bg-white/[0.02] hover:border-accent/50 hover:bg-accent/5 flex items-center gap-3 transition group block"
              >
                <div className="relative h-10 w-10 rounded-sm bg-black border border-accent/60 overflow-hidden flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-accent" />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-mint rounded-tl-sm border-t border-l border-black" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-valorant text-sm text-white truncate max-w-[140px]">
                      {displayName}
                    </span>
                    <span className="text-[8px] font-mono text-mint uppercase">ONLINE</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 truncate">
                    {user?.tagline || "CLUTCH SPECIALIST"}
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="mt-5 space-y-1.5">
                <Link
                  href="/lobby"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-sm font-valorant text-sm tracking-wider uppercase transition",
                    isLobby
                      ? "bg-accent text-white shadow-[0_0_15px_rgba(255,70,85,0.4)]"
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Play className={cn("h-4 w-4", isLobby && "fill-white")} />
                  <span>PLAY / LOBBY</span>
                </Link>

                <Link
                  href="/history"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-sm font-valorant text-sm tracking-wider uppercase transition",
                    isHistory
                      ? "bg-accent/20 border border-accent text-accent shadow-[0_0_12px_rgba(255,70,85,0.25)]"
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Swords className="h-4 w-4" />
                  <span>CAREER HISTORY</span>
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-sm font-valorant text-sm tracking-wider uppercase transition",
                    isLeaderboard
                      ? "bg-amber-400/20 border border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  <span>LEADERBOARDS</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-sm font-valorant text-sm tracking-wider uppercase transition",
                    isSettings
                      ? "bg-mint/20 border border-mint text-mint shadow-[0_0_12px_rgba(60,242,196,0.25)]"
                      : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>SETTINGS</span>
                </Link>

                {onOpenHowToPlay && (
                  <button
                    onClick={() => {
                      closeMenu();
                      onOpenHowToPlay();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-sm font-valorant text-sm tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer text-left"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>HOW TO PLAY</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom: Friends Trigger & Sign Out */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              {onOpenFriends && (
                <button
                  onClick={() => {
                    closeMenu();
                    onOpenFriends();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span>FRIENDS &amp; PARTY</span>
                  </div>
                  {friendRequestsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent text-white text-[9px] font-mono font-bold">
                      {friendRequestsCount}
                    </span>
                  )}
                </button>
              )}

              {onOpenLogout && (
                <button
                  onClick={() => {
                    closeMenu();
                    onOpenLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm border border-[#FF4655]/30 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>LOG OUT</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

