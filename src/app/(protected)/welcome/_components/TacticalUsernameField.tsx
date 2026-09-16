"use client";

import { AtSign, Lock, Loader2, Check, X, RefreshCw } from "lucide-react";
import { UsernameStatus } from "../constants";

interface TacticalUsernameFieldProps {
  isAnonymous: boolean;
  username: string;
  setUsername: (val: string) => void;
  usernameStatus: UsernameStatus;
  statusMessage: string;
  suggestions: string[];
  onApplySuggestion: (sug: string) => void;
  onRandomize: () => void;
}

export function TacticalUsernameField({
  isAnonymous,
  username,
  setUsername,
  usernameStatus,
  statusMessage,
  suggestions,
  onApplySuggestion,
  onRandomize,
}: TacticalUsernameFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
          <AtSign className="h-3.5 w-3.5 text-[#FF4655]" />
          Tactical Username
        </label>
        {isAnonymous ? (
          <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
            <Lock className="h-3 w-3 text-zinc-400" /> Locked for Guests
          </span>
        ) : (
          <span className="text-[11px] text-[#FF4655] font-semibold">
            Unique Handle Required
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-zinc-500 font-mono text-sm select-none">
          @
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            if (!isAnonymous) {
              setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"));
            }
          }}
          disabled={isAnonymous}
          readOnly={isAnonymous}
          placeholder={isAnonymous ? "guest_handle" : "e.g. shadow_reaper"}
          maxLength={20}
          className={`w-full h-12 border rounded-xl pl-8 pr-10 text-sm font-sans transition-colors ${
            isAnonymous
              ? "bg-white/[0.03] border-white/10 text-zinc-400 cursor-not-allowed select-none opacity-80"
              : usernameStatus === "available"
              ? "bg-black/50 border-[#3CF2C4]/70 focus:border-[#3CF2C4] text-white"
              : usernameStatus === "taken" || usernameStatus === "invalid"
              ? "bg-black/50 border-[#FF4655]/70 focus:border-[#FF4655] text-white"
              : "bg-black/50 border-white/15 focus:border-[#FF4655] text-white"
          }`}
          required
        />

        {/* Status Indicator Icon */}
        <div className="absolute right-3.5 flex items-center">
          {isAnonymous ? (
            <Lock className="h-4 w-4 text-zinc-500" />
          ) : (
            <>
              {usernameStatus === "checking" && (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              )}
              {usernameStatus === "available" && (
                <div className="h-5 w-5 rounded-full bg-[#3CF2C4]/20 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-[#3CF2C4] stroke-[3]" />
                </div>
              )}
              {usernameStatus === "taken" && (
                <div className="h-5 w-5 rounded-full bg-[#FF4655]/20 flex items-center justify-center">
                  <X className="h-3.5 w-3.5 text-[#FF4655] stroke-[3]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Status or Helper Message */}
      {isAnonymous ? (
        <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
          Guest accounts cannot change their tactical username. Sign in with Google to choose a custom handle.
        </p>
      ) : (
        <>
          {statusMessage && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`text-xs font-medium ${
                  usernameStatus === "available"
                    ? "text-[#3CF2C4]"
                    : usernameStatus === "taken" || usernameStatus === "invalid"
                    ? "text-[#FF4655]"
                    : "text-zinc-400"
                }`}
              >
                {statusMessage}
              </span>
            </div>
          )}

          {/* Suggestions if taken */}
          {usernameStatus === "taken" && suggestions.length > 0 && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-[#FF4655]/10 border border-[#FF4655]/20 text-xs">
              <span className="text-zinc-300 font-medium block mb-1.5">
                Available alternatives:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => onApplySuggestion(sug)}
                    className="px-2.5 py-1 rounded bg-black/60 hover:bg-[#FF4655]/20 border border-white/10 hover:border-[#FF4655]/40 text-[#3CF2C4] font-mono text-[11px] transition cursor-pointer"
                  >
                    @{sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Randomizer helper */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-zinc-500">
              Letters, numbers, underscores and hyphens
            </span>
            <button
              type="button"
              onClick={onRandomize}
              className="flex items-center gap-1 text-[11px] font-medium text-[#FF4655] hover:text-white transition cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Suggest Handle</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
