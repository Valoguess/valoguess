"use client";

import Link from "next/link";

interface ResultFooterProps {
  onBackToLobby: () => void;
}

export function ResultFooter({ onBackToLobby }: ResultFooterProps) {
  return (
    <footer className="h-20 shrink-0 border-t border-white/10 bg-[#090B11] p-4 flex items-center justify-center gap-4 z-10">
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="clip-tag flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim py-2.5 px-8 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,70,85,0.15)] transition"
      >
        BACK TO LOBBY
      </Link>
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-base-900 hover:border-white/20 hover:text-white hover:bg-base-800 py-2.5 px-8 text-xs font-bold uppercase tracking-wider text-ink-300 transition"
      >
        LEAVE GAME
      </Link>
    </footer>
  );
}
