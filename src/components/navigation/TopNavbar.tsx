"use client";

import { useState, useRef, useEffect } from "react";
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

  const [isHowToPlayHoverOpen, setIsHowToPlayHoverOpen] = useState(false);
  const howToPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isHoverSupported = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  };

  const handleHowToPlayMouseEnter = () => {
    if (!isHoverSupported()) return;
    if (howToPlayTimeoutRef.current) {
      clearTimeout(howToPlayTimeoutRef.current);
      howToPlayTimeoutRef.current = null;
    }
    setIsHowToPlayHoverOpen(true);
  };

  const handleHowToPlayMouseLeave = () => {
    if (!isHoverSupported()) return;
    if (howToPlayTimeoutRef.current) {
      clearTimeout(howToPlayTimeoutRef.current);
    }
    howToPlayTimeoutRef.current = setTimeout(() => {
      setIsHowToPlayHoverOpen(false);
      howToPlayTimeoutRef.current = null;
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (howToPlayTimeoutRef.current) {
        clearTimeout(howToPlayTimeoutRef.current);
      }
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="relative z-30 w-full h-13 sm:h-16 bg-[#080b10]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 flex items-center justify-between shrink-0 select-none">
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

        <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <Link
            href="/"
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xs border transition cursor-pointer",
              pathname === "/"
                ? "border-accent/50 bg-accent/15 text-accent"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white"
            )}
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>

          <Link
            href="/lobby"
            className={cn(
              "relative px-4 sm:px-7 md:px-8 h-8 sm:h-9 flex items-center justify-center clip-tag font-valorant text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] transition-all cursor-pointer",
              isLobby
                ? "bg-accent text-white"
                : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white hover:border-white/20"
            )}
          >
            <span>PLAY</span>
          </Link>

          <Link
            href="/history"
            className={cn(
              "h-8 px-2.5 sm:h-9 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-xs border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isHistory
                ? "border-accent/50 bg-accent/15 text-accent"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/20"
            )}
            title="Career & Match History"
          >
            <Swords className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">CAREER</span>
          </Link>

          <Link
            href="/leaderboard"
            className={cn(
              "h-8 px-2.5 sm:h-9 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-xs border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isLeaderboard
                ? "border-amber-400/50 bg-amber-400/15 text-amber-300"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/20"
            )}
            title="Leaderboard"
          >
            <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">LEADERBOARD</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "h-8 px-2.5 sm:h-9 sm:px-3 md:px-4 flex items-center gap-1.5 sm:gap-2 rounded-xs border transition text-xs font-display font-bold uppercase tracking-wider cursor-pointer",
              isSettings
                ? "border-mint/50 bg-mint/15 text-mint"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white hover:border-white/20"
            )}
            title="Tactical Settings"
          >
            <SettingsIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">SETTINGS</span>
          </Link>

          {onOpenHowToPlay && (
            <div
              className="relative"
              onMouseEnter={handleHowToPlayMouseEnter}
              onMouseLeave={handleHowToPlayMouseLeave}
            >
              <button
                onClick={onOpenHowToPlay}
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xs border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition cursor-pointer"
                title="How to Play"
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              {isHowToPlayHoverOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0b0e14]/95 border border-white/10 backdrop-blur-xl shadow-2xl rounded-sm p-4 sm:p-5 z-50 select-none animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleHowToPlayMouseEnter}
                  onMouseLeave={handleHowToPlayMouseLeave}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
                        PROTOCOL // COMBAT BRIEFING
                      </span>
                      <h4 className="font-valorant text-xs tracking-wider text-white flex items-center gap-1.5 mt-0.5">
                        <HelpCircle className="h-3.5 w-3.5 text-accent" />
                        <span>HOW TO PLAY</span>
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-left">
                    <div className="p-2.5 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
                        01
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
                          SELECT SECRET AGENT
                        </span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Both players are assigned a hidden secret agent from the active roster.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
                        02
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
                          ASK YES/NO QUESTIONS
                        </span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Take turns asking questions about abilities, roles, or visual appearance.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
                        03
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
                          ELIMINATE CANDIDATES
                        </span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Eliminate agents on your 1v1 grid by clicking cards based on answers.
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-2.5">
                      <span className="font-mono text-[9px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
                        04
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-white block">
                          GUESS &amp; WIN
                        </span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Lock in your deduction when ready. Guess correctly to win the match!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/40">
                    <span>1V1 DEDUCTION RULES</span>
                    <span className="text-mint font-bold">READY TO PLAY</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-mint/30 bg-mint/5 text-mint text-[9px] font-display font-bold uppercase tracking-wider">
            <div className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span>ONLINE</span>
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xs border border-white/15 bg-white/[0.03] hover:border-accent/40 hover:bg-accent/5 text-white transition group cursor-pointer"
            title="Account & Profile Settings"
          >
            <User className="h-3.5 w-3.5 text-accent" />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-white max-w-[130px] truncate">
              {displayName}
            </span>
            <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white transition" />
          </Link>

          {onOpenLogout && (
            <button
              onClick={onOpenLogout}
              className="p-1.5 sm:p-2 rounded-xs border border-white/10 bg-white/[0.02] hover:bg-accent/15 hover:border-accent/40 text-white/50 hover:text-accent transition cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2 shrink-0">
          {onOpenFriends && (
            <button
              onClick={onOpenFriends}
              className="relative h-9 w-9 flex items-center justify-center rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 active:scale-95 transition cursor-pointer"
              title="Friends & Party"
            >
              <Users className="h-4 w-4 text-accent" />
              {friendRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
              )}
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="h-9 w-9 flex items-center justify-center rounded-xs border border-white/15 bg-white/5 hover:bg-accent/15 hover:border-accent text-white transition active:scale-95 cursor-pointer"
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
                    VALO<span className="text-accent">GUESS</span>
                  </span>
                </div>

                <button
                  onClick={closeMenu}
                  className="p-1.5 rounded-xs text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Link
                href="/settings"
                onClick={closeMenu}
                className="mt-4 p-3 rounded-xs border border-white/10 bg-white/[0.02] hover:border-accent/40 hover:bg-accent/5 flex items-center gap-3 transition group block"
              >
                <div className="relative h-10 w-10 rounded-xs bg-black border border-accent/60 overflow-hidden flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-accent" />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-mint rounded-tl-xs border-t border-l border-black" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-white uppercase tracking-wider truncate max-w-[140px]">
                      {displayName}
                    </span>
                    <span className="text-[8px] font-mono text-mint uppercase">ONLINE</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/50 truncate">
                    {user?.tagline || "CLUTCH SPECIALIST"}
                  </span>
                </div>
              </Link>

              <div className="mt-5 space-y-1.5">
                <Link
                  href="/lobby"
                  onClick={closeMenu}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xs font-display text-xs font-bold tracking-wider uppercase transition",
                    isLobby
                      ? "bg-accent text-white"
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
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xs font-display text-xs font-bold tracking-wider uppercase transition",
                    isHistory
                      ? "bg-accent/15 border border-accent/40 text-accent"
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
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xs font-display text-xs font-bold tracking-wider uppercase transition",
                    isLeaderboard
                      ? "bg-amber-400/15 border border-amber-400/40 text-amber-300"
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
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xs font-display text-xs font-bold tracking-wider uppercase transition",
                    isSettings
                      ? "bg-mint/15 border border-mint/40 text-mint"
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
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xs font-display text-xs font-bold tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer text-left"
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
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
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
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xs border border-[#FF4655]/30 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
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
