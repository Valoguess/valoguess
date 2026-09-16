"use client";

import { User, Shield, Lock } from "lucide-react";

interface DisplayNameFieldProps {
  isAnonymous: boolean;
  guestPrefix: string;
  displayNameSuffix: string;
  setDisplayNameSuffix: (val: string) => void;
  displayName: string;
  setDisplayName: (val: string) => void;
}

export function DisplayNameField({
  isAnonymous,
  guestPrefix,
  displayNameSuffix,
  setDisplayNameSuffix,
  displayName,
  setDisplayName,
}: DisplayNameFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-zinc-400" />
          Display Name
        </label>
        {isAnonymous ? (
          <span className="text-[11px] text-[#3CF2C4] font-medium flex items-center gap-1 font-mono">
            <Shield className="h-3 w-3" /> Fixed Prefix
          </span>
        ) : (
          <span className="text-[11px] text-zinc-500 font-medium">
            Public • Not Unique
          </span>
        )}
      </div>

      {isAnonymous ? (
        /* Anonymous User: Can only customize after Guest.[5-6letters] */
        <div className="space-y-2">
          <div className="relative flex items-center w-full h-12 bg-black/50 border border-white/15 rounded-xl overflow-hidden focus-within:border-[#FF4655] transition-colors">
            {/* Fixed, Locked Guest Prefix */}
            <div className="bg-white/10 px-3.5 h-full flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-200 border-r border-white/15 select-none shrink-0">
              <Lock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{guestPrefix}</span>
            </div>

            {/* Editable Suffix */}
            <input
              type="text"
              value={displayNameSuffix}
              onChange={(e) => setDisplayNameSuffix(e.target.value)}
              placeholder=" (add custom name, e.g. Ace)"
              maxLength={25}
              className="w-full h-full bg-transparent px-3 text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
            />
          </div>

          <div className="text-[11px] text-zinc-400 bg-white/[0.02] border border-white/5 p-2.5 rounded-lg">
            <span className="text-zinc-500 block mb-0.5">Preview of your display name:</span>
            <span className="font-mono text-white font-semibold text-xs">
              {guestPrefix}{displayNameSuffix || ""}
            </span>
          </div>
        </div>
      ) : (
        /* Non-Anonymous User: Standard Display Name Input */
        <div>
          <div className="relative">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. TenZ or Ace Duelist"
              maxLength={30}
              className="w-full h-12 bg-black/50 border border-white/15 rounded-xl px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4655] transition-colors"
              required
            />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
            Visible on scoreboards, party lists, and in-game chat. Can be changed anytime.
          </p>
        </div>
      )}
    </div>
  );
}
