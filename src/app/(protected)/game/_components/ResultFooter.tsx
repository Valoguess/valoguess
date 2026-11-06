"use client";

import Link from "next/link";

interface ResultFooterProps {
  onBackToLobby: () => void;
}

export function ResultFooter({ onBackToLobby }: ResultFooterProps) {
  return (
    <footer className="h-16 sm:h-20 shrink-0 border-t border-white/10 bg-[#07090e] px-4 py-2 sm:py-4 flex items-center justify-center gap-3 sm:gap-4 z-10">
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="rounded-sm flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#FF4655] hover:bg-[#e03847] py-2.5 px-4 sm:px-8 text-xs font-display font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(255,70,85,0.25)] transition cursor-pointer"
      >
        BACK TO LOBBY
      </Link>
      <Link
        href="/lobby"
        onClick={onBackToLobby}
        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/[0.03] hover:border-white/20 hover:text-white hover:bg-white/[0.06] py-2.5 px-4 sm:px-8 text-xs font-display font-bold uppercase tracking-wider text-white/70 transition cursor-pointer"
      >
        LEAVE GAME
      </Link>
    </footer>
  );
}
