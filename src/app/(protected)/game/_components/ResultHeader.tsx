"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface ResultHeaderProps {
  onBackToLobby: () => void;
}

export function ResultHeader({ onBackToLobby }: ResultHeaderProps) {
  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#07090e] px-3 sm:px-6 z-10">
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex items-center gap-1.5 sm:gap-2 rounded-sm border border-white/10 bg-white/[0.03] px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">BACK TO LOBBY</span>
        <span className="sm:hidden">LOBBY</span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Image src="/logo.svg" width={22} height={22} alt="logo" />
        <span className="font-valorant text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] text-white/60">
          MATCH RESULT
        </span>
      </div>

      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex items-center gap-2 rounded-sm border border-white/10 bg-white/[0.03] px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
      >
        <span className="hidden sm:inline">MAIN MENU</span>
        <span className="sm:hidden">MENU</span>
      </Link>
    </header>
  );
}
