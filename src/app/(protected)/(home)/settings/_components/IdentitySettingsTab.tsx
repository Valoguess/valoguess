"use client";

import { AtSign, User, Clock, Check, Lock, Info, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileAvatarUploadCard } from "./ProfileAvatarUploadCard";

interface IdentitySettingsTabProps {
  isAnonymous: boolean;
  username: string;
  setUsername: (val: string) => void;
  usernameCooldownDays: number;
  name: string;
  setName: (val: string) => void;
  nameCooldownDays: number;
  defaultIconPath: string;
  onSave?: () => void;
  isSaving?: boolean;
}

export function IdentitySettingsTab({
  isAnonymous,
  username,
  setUsername,
  usernameCooldownDays,
  name,
  setName,
  nameCooldownDays,
  defaultIconPath,
  onSave,
  isSaving = false,
}: IdentitySettingsTabProps) {
  return (
    <div className="space-y-6">
      <ProfileAvatarUploadCard
        isAnonymous={isAnonymous}
        defaultIconPath={defaultIconPath}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
                <AtSign className="h-4 w-4 text-[#FF4655]" /> UNIQUE USERNAME
              </span>

              {isAnonymous ? (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#FF4655] bg-[#FF4655]/10 px-2 py-0.5 rounded-xs border border-[#FF4655]/30">
                  LOCKED (GUEST)
                </span>
              ) : usernameCooldownDays > 0 ? (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-xs border border-amber-400/30 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {usernameCooldownDays}D COOLDOWN
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-mint bg-mint/10 px-2 py-0.5 rounded-xs border border-mint/30 flex items-center gap-1">
                  <Check className="h-3 w-3" /> READY
                </span>
              )}
            </div>

            <p className="text-xs text-white/50 leading-relaxed font-sans">
              Your unique handle used for party invites and friend requests. Can be changed <span className="text-white font-semibold">once every 30 days</span>.
            </p>
          </div>

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
                className="pl-8 bg-black/60 border-white/15 text-white font-mono text-sm h-11 focus:border-[#FF4655] disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {usernameCooldownDays > 0 && (
                <Lock className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {usernameCooldownDays > 0 ? (
              <div className="p-2.5 bg-amber-400/5 border border-amber-400/20 rounded-xs text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Username modified recently. You can update it again in <strong>{usernameCooldownDays} days</strong>.
                </span>
              </div>
            ) : isAnonymous ? (
              <div className="p-2.5 bg-[#FF4655]/10 border border-[#FF4655]/20 rounded-xs text-[11px] text-[#FF4655] flex items-start gap-2">
                <Lock className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Guest accounts cannot modify usernames. Link a Google account to unlock.</span>
              </div>
            ) : (
              <span className="text-[11px] text-white/40 font-mono block">
                Allowed: lowercase letters, numbers, and underscores (3-20 chars).
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 flex flex-col justify-between text-left space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
                <User className="h-4 w-4 text-[#FF4655]" /> DISPLAY NAME
              </span>

              {nameCooldownDays > 0 ? (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-xs border border-amber-400/30 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {nameCooldownDays}D COOLDOWN
                </span>
              ) : (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-mint bg-mint/10 px-2 py-0.5 rounded-xs border border-mint/30 flex items-center gap-1">
                  <Check className="h-3 w-3" /> READY
                </span>
              )}
            </div>

            <p className="text-xs text-white/50 leading-relaxed font-sans">
              The primary display name shown in match podiums and leaderboards. Can be changed <span className="text-white font-semibold">once every 30 days</span>.
            </p>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                disabled={nameCooldownDays > 0}
                placeholder="ENTER DISPLAY NAME"
                className="bg-black/60 border-white/15 text-white font-display text-sm h-11 focus:border-[#FF4655] disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {nameCooldownDays > 0 && (
                <Lock className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {nameCooldownDays > 0 ? (
              <div className="p-2.5 bg-amber-400/5 border border-amber-400/20 rounded-xs text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  Display name updated recently. Eligible for another change in <strong>{nameCooldownDays} days</strong>.
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-white/40 font-mono block">
                Up to 24 characters. Display names do not need to be unique.
              </span>
            )}
          </div>
        </div>
      </div>

      {onSave && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080b10]/60 border border-white/10 rounded-sm p-4">
          <span className="text-xs text-white/40 font-mono">
            Save username and display name changes.
          </span>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto py-2.5 px-6 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>SAVE IDENTITY CHANGES</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
