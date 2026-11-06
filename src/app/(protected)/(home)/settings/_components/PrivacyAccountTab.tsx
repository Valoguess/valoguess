"use client";

import Link from "next/link";
import {
  Link2,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { AgentBanner } from "@/consts";

interface PrivacyAccountTabProps {
  currentBanner?: AgentBanner;
  name?: string;
  username?: string;
  isAnonymous: boolean;
  userEmail?: string | null;
  onRequestLogout?: () => void;
}

export function PrivacyAccountTab({
  isAnonymous,
  userEmail,
  onRequestLogout,
}: PrivacyAccountTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 space-y-4">
        <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
          <Link2 className="h-4 w-4 text-[#FF4655]" /> ACCOUNT AUTHENTICATION
        </span>

        {isAnonymous ? (
          <div className="p-4 rounded-sm bg-[#FF4655]/10 border border-[#FF4655]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase text-[#FF4655]">
                <AlertTriangle className="h-3.5 w-3.5" /> GUEST ACCOUNT
              </div>
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                You are playing on an anonymous guest session. Link your Google account to secure duel statistics and unlock custom usernames.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {onRequestLogout && (
                <button
                  type="button"
                  onClick={onRequestLogout}
                  className="py-2.5 px-4 bg-white/5 hover:bg-[#FF4655]/20 border border-white/15 hover:border-[#FF4655]/40 text-white/80 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>EXIT GUEST</span>
                </button>
              )}

              <Link
                href="/login"
                className="py-2.5 px-4 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer"
              >
                LINK GOOGLE
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-sm bg-mint/10 border border-mint/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-display font-bold text-mint uppercase tracking-wider block">
                ✓ ACCOUNT VERIFIED
              </span>
              <span className="text-[11px] text-white/60 font-mono">
                Signed in as <strong className="text-white">{userEmail || "Google User"}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-mint border border-mint/40 bg-mint/10 px-2.5 py-1 rounded-xs uppercase font-bold">
                ACTIVE
              </span>

              {onRequestLogout && (
                <button
                  type="button"
                  onClick={onRequestLogout}
                  className="py-1.5 px-3 bg-white/5 hover:bg-[#FF4655]/20 border border-white/15 hover:border-[#FF4655]/40 text-white/70 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>LOG OUT</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
              <LogOut className="h-4 w-4 text-[#FF4655]" /> SESSION TERMINATION
            </span>
            <p className="text-xs text-white/50 max-w-xl leading-relaxed font-sans">
              Terminate your active protocol session and return to the sign-in screen.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestLogout}
            className="py-2.5 px-5 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 border border-[#FF4655]/40 hover:border-[#FF4655] text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>LOG OUT OF ACCOUNT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
