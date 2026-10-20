"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

interface SettingsHeaderProps {
  onOpenLogout: () => void;
}

export function SettingsHeader({ onOpenLogout }: SettingsHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#080B10]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0 shadow-lg">
      <div className="flex items-center gap-4">
        <Link
          href="/lobby"
          className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white/60 hover:text-white transition py-1.5 px-3 rounded-sm border border-white/10 bg-white/3 hover:bg-white/8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-accent" />
          <span>BACK TO LOBBY</span>
        </Link>

        <div className="h-4 w-px bg-white/15 hidden sm:block" />

        <div className="flex items-center gap-2 font-valorant">
          <span className="text-sm tracking-widest text-white">SETTINGS</span>
          <span className="text-[10px] tracking-widest text-accent font-mono bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
            PROFILE & PRIVACY
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLogout}
          className="py-2 px-3.5 rounded-sm border border-white/10 bg-white/3 hover:bg-[#FF4655]/15 hover:border-[#FF4655]/40 text-white/60 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          title="Log out of account"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">LOG OUT</span>
        </button>
      </div>
    </header>
  );
}
