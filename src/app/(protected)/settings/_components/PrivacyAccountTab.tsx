"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, Eye, EyeOff, Link2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentBanner } from "../constants";

interface PrivacyAccountTabProps {
  hideName: boolean;
  setHideName: (val: boolean) => void;
  currentBanner: AgentBanner;
  name: string;
  username: string;
  isAnonymous: boolean;
  userEmail?: string | null;
}

export function PrivacyAccountTab({
  hideName,
  setHideName,
  currentBanner,
  name,
  username,
  isAnonymous,
  userEmail,
}: PrivacyAccountTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* 1. HIDE NAME FROM NON-FRIENDS TOGGLE */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-mint" />
              <span className="font-valorant text-base tracking-wider text-white">
                HIDE NAME FOR STRANGERS (NON-FRIENDS)
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              When enabled, players outside your friends list will see you as an anonymous agent in public queues, match lobbies, and results.
            </p>
          </div>

          {/* Tactical Toggle Switch */}
          <button
            type="button"
            onClick={() => setHideName(!hideName)}
            className={cn(
              "relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
              hideName
                ? "bg-mint/20 border-mint shadow-[0_0_12px_rgba(60,242,196,0.35)]"
                : "bg-black/80 border-white/20"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5",
                hideName ? "translate-x-7 bg-mint" : "translate-x-1 bg-zinc-500"
              )}
            />
          </button>
        </div>

        {/* Live Preview Box Comparing What Friends vs Strangers See */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
          {/* Friends View */}
          <div className="p-4 rounded bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mint flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" /> WHAT FRIENDS SEE
              </span>
              <span className="text-[8px] font-mono text-zinc-500">VERIFIED</span>
            </div>

            <div className="p-3 bg-black/60 rounded border border-white/5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden border border-white/20 relative shrink-0">
                <Image
                  src={currentBanner.iconPath}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-valorant text-xs text-white">
                  {name || "AGENT"}
                </span>
                <span className="text-[9px] font-mono text-accent">
                  @{username || "agent"}
                </span>
              </div>
            </div>
          </div>

          {/* Strangers View */}
          <div className="p-4 rounded bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF4655] flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5" /> WHAT NON-FRIENDS SEE
              </span>
              <span className="text-[8px] font-mono text-zinc-500">
                {hideName ? "MASKED" : "PUBLIC"}
              </span>
            </div>

            <div className="p-3 bg-black/60 rounded border border-white/5 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden border border-white/20 relative shrink-0 grayscale opacity-70">
                <Image
                  src={currentBanner.iconPath}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-valorant text-xs text-zinc-300">
                  {hideName ? "AGENT #????" : (name || "AGENT")}
                </span>
                <span className="text-[9px] font-mono text-zinc-500">
                  {hideName ? "@hidden_agent" : `@${username || "agent"}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACCOUNT LINKING / AUTH STATUS */}
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

            <Link
              href="/login"
              className="py-2.5 px-4 bg-accent hover:bg-accent-dim text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.3)] transition shrink-0 cursor-pointer"
            >
              LINK GOOGLE ACCOUNT
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded bg-mint/10 border border-mint/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-display font-bold text-mint uppercase tracking-wider block">
                ✓ ACCOUNT VERIFIED
              </span>
              <span className="text-[11px] text-zinc-400">
                Signed in as <strong className="text-white">{userEmail || "Google User"}</strong>
              </span>
            </div>

            <span className="text-[9px] font-mono text-mint border border-mint/40 bg-mint/10 px-2.5 py-1 rounded">
              ACTIVE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
