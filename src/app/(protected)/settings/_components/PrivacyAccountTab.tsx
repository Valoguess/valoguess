"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Eye, EyeOff, Link2, AlertTriangle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentBanner } from "../constants";

interface PrivacyAccountTabProps {
  currentBanner: AgentBanner;
  name: string;
  username: string;
  isAnonymous: boolean;
  userEmail?: string | null;
  onRequestLogout?: () => void;
}

export function PrivacyAccountTab({
  currentBanner,
  name,
  username,
  isAnonymous,
  userEmail,
  onRequestLogout,
}: PrivacyAccountTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">

      {/* 2. ACCOUNT AUTHENTICATION & SESSION MANAGEMENT */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 space-y-4">
        <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
          <Link2 className="h-4 w-4 text-accent" /> ACCOUNT AUTHENTICATION
        </span>

        {isAnonymous ? (
          <div className="p-4 rounded bg-[#FF4655]/10 border border-[#FF4655]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase text-[#FF4655]">
                <AlertTriangle className="h-3.5 w-3.5" /> GUEST ACCOUNT ACTIVE
              </div>
              <p className="text-xs text-zinc-300">
                You are currently using an anonymous session. Link your Google account to secure your stats, unlock friends list, and choose custom handles.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onRequestLogout && (
                <button
                  type="button"
                  onClick={onRequestLogout}
                  className="py-2.5 px-4 bg-white/5 hover:bg-[#FF4655]/20 border border-white/15 hover:border-[#FF4655]/40 text-white/80 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>EXIT GUEST</span>
                </button>
              )}

              <Link
                href="/login"
                className="py-2.5 px-4 bg-accent hover:bg-accent-dim text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.3)] transition shrink-0 cursor-pointer"
              >
                LINK GOOGLE ACCOUNT
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded bg-mint/10 border border-mint/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-display font-bold text-mint uppercase tracking-wider block">
                ✓ ACCOUNT VERIFIED
              </span>
              <span className="text-[11px] text-zinc-400">
                Signed in as <strong className="text-white">{userEmail || "Google User"}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-mint border border-mint/40 bg-mint/10 px-2.5 py-1 rounded">
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

      {/* 3. SESSION TERMINATION (DANGER ZONE) */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
              <LogOut className="h-4 w-4 text-[#FF4655]" /> SESSION TERMINATION
            </span>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              End your active session on this device. You will be redirected to the sign-in screen.
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
