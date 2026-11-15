"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  Trophy,
  HelpCircle,
  Settings as SettingsIcon,
  User,
  LogOut,
  Users,
  Menu,
  X,
  Play,
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

  const isLobby = pathname === "/lobby" || pathname === "/";
  const isHistory = pathname === "/history";
  const isLeaderboard = pathname === "/leaderboard";
  const isSettings = pathname === "/settings";

  const displayName = user?.name || savedUsername || "AGENT";
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="relative z-30 w-full h-14 sm:h-16 bg-[#06080e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-6 lg:gap-10 h-full">
          <Link
            href="/lobby"
            className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-sm"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="ValoGuess Logo"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex items-baseline font-valorant text-sm sm:text-base tracking-wider leading-none">
              <span className="text-white">VALO</span>
              <span className="text-[#FF4655]">GUESS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center h-full">
            <Link
              href="/lobby"
              className={cn(
                "relative px-4 sm:px-5 h-full flex items-center font-display text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-colors",
                isLobby
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <span>PLAY</span>
              {isLobby && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF4655] shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
              )}
            </Link>

            <Link
              href="/history"
              className={cn(
                "relative px-4 sm:px-5 h-full flex items-center font-display text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-colors",
                isHistory
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <span>CAREER</span>
              {isHistory && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF4655] shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
              )}
            </Link>

            <Link
              href="/leaderboard"
              className={cn(
                "relative px-4 sm:px-5 h-full flex items-center font-display text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-colors",
                isLeaderboard
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <span>LEADERBOARD</span>
              {isLeaderboard && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              )}
            </Link>

            <Link
              href="/settings"
              className={cn(
                "relative px-4 sm:px-5 h-full flex items-center font-display text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-colors",
                isSettings
                  ? "text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <span>SETTINGS</span>
              {isSettings && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-mint shadow-[0_0_8px_rgba(60,242,196,0.6)]" />
              )}
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="h-9 w-9 flex items-center justify-center rounded-sm text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              title="How to Play"
              aria-label="How to play instructions"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}

          <Link
            href="/settings"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 text-white transition cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            title="Profile & Settings"
          >
            <div className="relative flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-[#FF4655]" />
            </div>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-white max-w-[130px] truncate">
              {displayName}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_6px_rgba(60,242,196,0.6)]" />
          </Link>

          {onOpenLogout && (
            <button
              onClick={onOpenLogout}
              className="h-9 w-9 flex items-center justify-center rounded-sm text-white/40 hover:text-[#FF4655] hover:bg-[#FF4655]/10 border border-transparent hover:border-[#FF4655]/20 transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2 shrink-0">
          {onOpenFriends && (
            <button
              onClick={onOpenFriends}
              className="relative h-9 w-9 flex items-center justify-center rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 active:scale-95 transition cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              title="Friends & Party"
              aria-label="Open friends panel"
            >
              <Users className="h-4 w-4 text-[#FF4655]" />
              {friendRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-sm bg-[#FF4655] animate-ping" />
              )}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="h-9 w-9 flex items-center justify-center rounded-sm border border-white/15 bg-white/5 hover:bg-white/10 text-white transition active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-[#FF4655]" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeMenu}
          />

          <div className="fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-[#070a10] border-l border-white/10 p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-right duration-250 select-none">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image src="/logo.svg" alt="logo" fill className="object-contain" />
                  </div>
                  <span className="font-valorant text-sm tracking-wider text-white">
                    VALO<span className="text-[#FF4655]">GUESS</span>
                  </span>
                </div>

                <button
                  onClick={closeMenu}
                  className="p-1.5 rounded-sm text-white/50 hover:text-white hover:bg-white/10 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Link
                href="/settings"
                onClick={closeMenu}
                className="mt-4 p-3 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] flex items-center gap-3 transition group block active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              >
                <div className="relative h-10 w-10 rounded-sm bg-black border border-[#FF4655]/40 overflow-hidden flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-[#FF4655]" />
                  <div className="absolute bottom-0 right-0 h-2 w-2 bg-mint rounded-tl-sm border-t border-l border-black" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-white uppercase tracking-wider truncate max-w-[140px]">
                      {displayName}
                    </span>
                    <span className="text-xs font-mono text-mint uppercase">ONLINE</span>
                  </div>
                  <span className="text-xs font-mono text-white/50 truncate">
                    {user?.tagline || "VALORANT AGENT"}
                  </span>
                </div>
              </Link>

              <div className="mt-5 space-y-1">
                <Link
                  href="/lobby"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-display text-xs font-bold tracking-wider uppercase transition active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                    isLobby
                      ? "bg-[#FF4655] text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Play className={cn("h-4 w-4", isLobby && "fill-white")} />
                  <span>PLAY</span>
                </Link>

                <Link
                  href="/history"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-display text-xs font-bold tracking-wider uppercase transition active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                    isHistory
                      ? "bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Swords className="h-4 w-4" />
                  <span>CAREER</span>
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-display text-xs font-bold tracking-wider uppercase transition active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                    isLeaderboard
                      ? "bg-amber-400/15 border border-amber-400/40 text-amber-300"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  <span>LEADERBOARD</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-display text-xs font-bold tracking-wider uppercase transition active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                    isSettings
                      ? "bg-mint/15 border border-mint/40 text-mint"
                      : "text-white/70 hover:text-white hover:bg-white/5"
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
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-sm font-display text-xs font-bold tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer text-left active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>HOW TO PLAY</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              {onOpenFriends && (
                <button
                  onClick={() => {
                    closeMenu();
                    onOpenFriends();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF4655]" />
                    <span>FRIENDS &amp; PARTY</span>
                  </div>
                  {friendRequestsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-[#FF4655] text-white text-xs font-mono font-bold">
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
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm border border-[#FF4655]/30 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
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
