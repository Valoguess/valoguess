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
        className="flex flex-col items-center gap-1.5 py-4 cursor-pointer hover:scale-105 transition"
        title="Sign in to unlock friends"
      >
        <div className="h-9 w-9 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
          <Lock className="h-4 w-4" />
        </div>
        <span className="text-xs font-display font-bold uppercase tracking-wider text-[#FF4655] text-center">
          LOCKED
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center space-y-4 my-auto">
      <div className="h-12 w-12 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
        <ShieldAlert className="h-6 w-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-valorant text-base tracking-wider text-white">
          FRIENDS LOCKED
        </h3>
        <p className="text-xs text-white/50 leading-relaxed max-w-[220px] font-sans">
          Guest accounts cannot manage friends, send requests, or invite players to custom parties.
        </p>
      </div>

      <div className="w-full pt-1 space-y-2">
        <Link
          href="/login"
          className="w-full py-2.5 px-4 rounded-sm bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Link2 className="h-3.5 w-3.5" />
          <span>SIGN IN TO UNLOCK</span>
        </Link>
        <p className="text-xs text-white/40 leading-normal font-sans">
          Sign in with Google to unlock full social features and party matchmaking.
        </p>
      </div>
    </div>
  );
}
