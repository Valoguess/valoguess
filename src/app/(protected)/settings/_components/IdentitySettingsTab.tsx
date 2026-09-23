"use client";

import { AtSign, User, Clock, Check, Lock, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IdentitySettingsTabProps {
  isAnonymous: boolean;
  username: string;
  setUsername: (val: string) => void;
  usernameCooldownDays: number;
  toggleUsernameCooldownDemo?: () => void;
  name: string;
  setName: (val: string) => void;
  nameCooldownDays: number;
  toggleNameCooldownDemo?: () => void;
}

export function IdentitySettingsTab({
  isAnonymous,
  username,
  setUsername,
  usernameCooldownDays,
  toggleUsernameCooldownDemo,
  name,
  setName,
  nameCooldownDays,
  toggleNameCooldownDemo,
}: IdentitySettingsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* 1. USERNAME FIELD */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 flex flex-col justify-between text-left space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
              <AtSign className="h-4 w-4 text-accent" /> UNIQUE USERNAME
            </span>

            {/* Cooldown Status Badge */}
            {isAnonymous ? (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF4655] bg-[#FF4655]/10 px-2 py-0.5 rounded border border-[#FF4655]/30">
                LOCKED (GUEST)
              </span>
            ) : usernameCooldownDays > 0 ? (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {usernameCooldownDays}D COOLDOWN
              </span>
            ) : (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-mint bg-mint/10 px-2 py-0.5 rounded border border-mint/30 flex items-center gap-1">
                <Check className="h-3 w-3" /> READY TO CHANGE
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Your permanent identifier for adding friends and invites. Can be changed <span className="text-white font-semibold">once every 30 days</span>.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm">
              @
            </span>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              disabled={isAnonymous || usernameCooldownDays > 0}
              placeholder="username"
              className="pl-8 bg-black/60 border-white/15 text-white font-mono text-sm h-11 focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed uppercase"
            />
            {usernameCooldownDays > 0 && (
              <Lock className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Cooldown info message */}
          {usernameCooldownDays > 0 ? (
            <div className="p-3 bg-amber-400/5 border border-amber-400/20 rounded text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                You recently modified your username. You can change it again in <strong>{usernameCooldownDays} days</strong>.
              </span>
            </div>
          ) : isAnonymous ? (
            <div className="p-3 bg-[#FF4655]/10 border border-[#FF4655]/20 rounded text-[11px] text-[#FF4655] leading-relaxed flex items-start gap-2">
              <Lock className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Guest accounts cannot change their username. Link your Google account to unlock custom handles.</span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500 block">
              Use letters, numbers, and underscores (3-20 characters).
            </span>
          )}
        </div>
      </div>

      {/* 2. DISPLAY NAME FIELD */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 flex flex-col justify-between text-left space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
              <User className="h-4 w-4 text-accent" /> DISPLAY NAME
            </span>

            {/* Cooldown Status Badge */}
            {nameCooldownDays > 0 ? (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {nameCooldownDays}D COOLDOWN
              </span>
            ) : (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-mint bg-mint/10 px-2 py-0.5 rounded border border-mint/30 flex items-center gap-1">
                <Check className="h-3 w-3" /> READY TO CHANGE
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            The name displayed on leaderboards, lobby cards, and match history. Can be changed <span className="text-white font-semibold">once every 30 days</span>.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              disabled={nameCooldownDays > 0}
              placeholder="ENTER DISPLAY NAME"
              className="bg-black/60 border-white/15 text-white font-display text-sm uppercase h-11 focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
            />
            {nameCooldownDays > 0 && (
              <Lock className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {nameCooldownDays > 0 ? (
            <div className="p-3 bg-amber-400/5 border border-amber-400/20 rounded text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Display name changed recently. Eligible for update in <strong>{nameCooldownDays} days</strong>.
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500 block">
              Maximum 24 characters. Display names do not need to be unique.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
