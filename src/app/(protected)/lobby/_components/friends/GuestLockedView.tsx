"use client";

import Link from "next/link";
import { Lock, ShieldAlert, Link2 } from "lucide-react";

interface GuestLockedViewProps {
  isCollapsed: boolean;
  onExpand: () => void;
}

export function GuestLockedView({
  isCollapsed,
  onExpand,
}: GuestLockedViewProps) {
  if (isCollapsed) {
    return (
      <div
        onClick={onExpand}
        className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-105 transition"
        title="Link Account to Unlock Friends"
      >
        <div className="h-9 w-9 rounded-full bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
          <Lock className="h-4 w-4" />
        </div>
        <span className="text-[8px] font-display font-bold uppercase tracking-widest text-[#FF4655] text-center">
          LOCKED
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center space-y-4 my-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-[#FF4655]/20 blur-xl rounded-full animate-pulse" />
        <div className="relative h-14 w-14 rounded-2xl bg-black/60 border border-[#FF4655]/50 flex items-center justify-center text-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.25)]">
          <ShieldAlert className="h-7 w-7" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF4655] bg-[#FF4655]/10 px-2.5 py-0.5 rounded-full border border-[#FF4655]/25">
          <Lock className="h-3 w-3" /> GUEST ACCOUNT
        </div>
        <h3 className="font-valorant text-base tracking-wider text-white">
          FRIENDS LOCKED
        </h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[220px]">
          Guest users cannot access the friends list, send friend requests, or invite players.
        </p>
      </div>

      <div className="w-full pt-1 space-y-2">
        <Link
          href="/login"
          className="w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-dim text-white font-display text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,70,85,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Link2 className="h-3.5 w-3.5" />
          <span>LINK ACCOUNT</span>
        </Link>
        <p className="text-[10px] text-zinc-500 leading-normal">
          Sign in with Google to unlock full social features and friend matchmaking.
        </p>
      </div>
    </div>
  );
}
