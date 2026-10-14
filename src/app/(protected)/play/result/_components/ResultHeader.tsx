"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface ResultHeaderProps {
  onBackToLobby: () => void;
}

export function ResultHeader({ onBackToLobby }: ResultHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#090B11] px-6 z-10">
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex items-center gap-2 rounded-sm border border-white/10 bg-base-900 px-4 py-2 text-xs font-semibold text-ink-300 transition hover:border-white/20 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        BACK TO LOBBY
      </Link>

      <div className="flex items-center gap-3">
        <Image src="/logo.svg" width={24} height={24} alt="logo" />
        <span className="font-valorant text-sm tracking-[0.25em] text-zinc-400">
          MATCH RESULT
        </span>
      </div>

      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex items-center gap-2 rounded-sm border border-white/10 bg-base-900 px-4 py-2 text-xs font-semibold text-ink-300 transition hover:border-white/20 hover:text-white"
      >
        MAIN MENU
      </Link>
    </header>
  );
}
