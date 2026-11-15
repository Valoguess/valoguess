"use client";

import { Crosshair, MessageSquare, Sparkles, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeformTurnPanelProps {
  onConsumeNo: () => void;
  onOpenGuessModal: () => void;
  opponentName: string;
  nosRemaining: number;
  guessesRemaining: number;
  opponentNosRemaining?: number;
  opponentGuessesRemaining?: number;
  isConsumingNo?: boolean;
}

export function FreeformTurnPanel({
  onConsumeNo,
  onOpenGuessModal,
  opponentName,
  nosRemaining,
  guessesRemaining,
  opponentNosRemaining,
  opponentGuessesRemaining,
  isConsumingNo = false,
}: FreeformTurnPanelProps) {
  const hasNosLeft = nosRemaining > 0;
  const hasGuessesLeft = guessesRemaining > 0;

  return (
    <div className="flex flex-col border border-white/10 bg-[#080b10]/90 backdrop-blur-md p-4 sm:p-5 rounded-sm relative overflow-hidden min-h-[200px] justify-between mb-4 select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-mint" />
          <span className="font-valorant text-xs sm:text-sm tracking-wider uppercase text-white">
            FREEFORM DUEL
          </span>
          <span className="text-xs font-mono bg-mint/10 border border-mint/30 px-2 py-0.5 rounded-xs text-mint font-bold">
            UNRESTRICTED
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-white/60">
            YOUR NOs: <span className={cn("font-bold", hasNosLeft ? "text-mint" : "text-[#FF4655]")}>{nosRemaining}</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="text-white/60">
            YOUR GUESSES: <span className={cn("font-bold", hasGuessesLeft ? "text-white" : "text-[#FF4655]")}>{guessesRemaining}</span>
          </div>
        </div>
      </div>

      <div className="my-auto py-4 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-white/5 border border-white/10 text-white/80 text-xs font-display font-bold uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5 text-mint" />
          <span>VOICE &amp; CHAT INTERROGATION</span>
        </div>

        <h2 className="font-valorant text-xl sm:text-2xl text-white tracking-wider mb-2">
          ASK QUESTIONS FREELY
        </h2>

        <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed mb-4">
          Ask <span className="text-white font-semibold">{opponentName}</span> questions freely in Party Chat or voice.
          Whenever they answer <span className="text-[#FF4655] font-bold">&quot;NO&quot;</span>, consume a No.
          When you know their secret agent, lock in your guess!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-black/40 border border-white/10">
            <span className="text-white/40">YOU:</span>
            <span className="text-mint font-bold">{nosRemaining} NOs</span>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">{guessesRemaining} GUESSES</span>
          </div>

          {(opponentNosRemaining != null || opponentGuessesRemaining != null) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-black/40 border border-white/10">
              <span className="text-white/40">{opponentName.toUpperCase()}:</span>
              <span className="text-mint font-bold">{opponentNosRemaining ?? 0} NOs</span>
              <span className="text-white/20">/</span>
              <span className="text-white font-bold">{opponentGuessesRemaining ?? 0} GUESSES</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs font-mono text-white/40 flex items-center justify-center sm:justify-start gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-[#FF4655]" />
          <span>Type in Party Chat to converse</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onConsumeNo}
            disabled={!hasNosLeft || isConsumingNo}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-sm border font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
              hasNosLeft
                ? "border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300"
                : "border-white/10 bg-white/5 text-white/30 cursor-not-allowed",
            )}
            title="Opponent answered NO"
          >
            <MinusCircle className="h-3.5 w-3.5" />
            <span>OPPONENT SAID NO ({nosRemaining} LEFT)</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuessModal}
            disabled={!hasGuessesLeft}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-2 rounded-sm font-valorant text-xs uppercase tracking-widest text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.3)]",
              hasGuessesLeft
                ? "bg-[#FF4655] hover:bg-[#ff5a67]"
                : "bg-white/10 text-white/30 cursor-not-allowed",
            )}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>FINAL GUESS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
