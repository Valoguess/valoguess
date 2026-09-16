"use client";

import { Zap, Loader2, ArrowRight } from "lucide-react";

interface GuestAuthButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function GuestAuthButton({
  onClick,
  isLoading,
  disabled = false,
}: GuestAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full rounded-xl bg-white/4 hover:bg-white/8 border border-white/10 hover:border-white/20 p-3.5 flex items-center justify-between group transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-[#FF4655]/15 border border-[#FF4655]/30 flex items-center justify-center text-[#FF4655] shrink-0 group-hover:scale-105 transition-transform">
          <Zap className="h-4 w-4 fill-current" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-white group-hover:text-[#FF4655] transition-colors">
            Play as Guest Instantly
          </span>
          <span className="text-[11px] text-zinc-400">
            No signup required • Jump right in
          </span>
        </div>
      </div>

      <div className="text-zinc-400 group-hover:text-white transition-colors">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
        )}
      </div>
    </button>
  );
}
