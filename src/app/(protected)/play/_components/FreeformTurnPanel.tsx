"use client";

import { Crosshair, MessageSquare, Loader2, Sparkles, MinusCircle, AlertCircle } from "lucide-react";
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
    <div className="clip-notch-both flex flex-col border border-white/10 bg-[#07090e]/90 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.7)] relative overflow-hidden min-h-[220px] justify-between mb-5">
      {/* Accent corner decorations */}
      <div className="absolute left-0 top-0 h-4 w-4">
        <div className="absolute left-0 top-0 h-px w-4 bg-[#FF4655]/60" />
        <div className="absolute left-0 top-0 h-4 w-px bg-[#FF4655]/60" />
      </div>
      <div className="absolute right-0 top-0 h-4 w-4">
        <div className="absolute right-0 top-0 h-px w-4 bg-[#FF4655]/60" />
        <div className="absolute right-0 top-0 h-4 w-px bg-[#FF4655]/60" />
      </div>

      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rotate-45 bg-mint shadow-[0_0_8px_#3cf2c4]" />
          <span className="font-valorant text-xs tracking-[0.2em] uppercase text-white">
            FREEFORM MODE
          </span>
          <span className="text-[9px] font-mono bg-mint/10 border border-mint/30 px-2 py-0.5 rounded text-mint">
            LIVE OPEN INQUIRY
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="text-white/60">
            YOUR NOs: <span className={cn("font-bold", hasNosLeft ? "text-mint" : "text-[#FF4655]")}>{nosRemaining}</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="text-white/60">
            YOUR GUESSES: <span className={cn("font-bold", hasGuessesLeft ? "text-white" : "text-[#FF4655]")}>{guessesRemaining}</span>
          </div>
        </div>
      </div>

      {/* Center Status & Tactical Guidance */}
      <div className="my-auto py-3 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10.5px] font-display font-bold uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5 text-mint" />
          <span>OPEN TACTICAL DUEL</span>
        </div>

        <h2 className="font-valorant text-xl sm:text-2xl md:text-3xl text-white tracking-wider mb-2">
          ASK FREELY &amp; DEDUCE
        </h2>

        <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed mb-4">
          Ask <span className="text-white font-semibold">{opponentName}</span> questions freely in Party Chat or voice.
          Whenever they answer <span className="text-[#FF4655] font-bold">&quot;NO&quot;</span>, consume a No.
          When you know their secret agent, submit your guess!
        </p>

        {/* Tactical status pill indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/40 border border-white/10">
            <span className="text-white/40">YOU:</span>
            <span className="text-mint font-bold">{nosRemaining} NOs</span>
            <span className="text-white/20">/</span>
            <span className="text-white font-bold">{guessesRemaining} GUESSES</span>
          </div>

          {(opponentNosRemaining != null || opponentGuessesRemaining != null) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/40 border border-white/10">
              <span className="text-white/40">{opponentName.toUpperCase()}:</span>
              <span className="text-mint font-bold">{opponentNosRemaining ?? 0} NOs</span>
              <span className="text-white/20">/</span>
              <span className="text-white font-bold">{opponentGuessesRemaining ?? 0} GUESSES</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-white/40 flex items-center justify-center sm:justify-start gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-accent" />
          <span>Type in Party Chat to converse</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Consume No Button */}
          <button
            type="button"
            onClick={onConsumeNo}
            disabled={!hasNosLeft || isConsumingNo}
            className={cn(
              "px-4 sm:px-5 py-2.5 rounded-sm border font-valorant text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-sm",
              hasNosLeft
                ? "border-violet/60 bg-violet/15 hover:bg-violet/25 text-violet shadow-[0_0_15px_rgba(140,123,255,0.2)] active:scale-98"
                : "border-white/10 bg-white/5 text-white/30 cursor-not-allowed opacity-50"
            )}
            title={hasNosLeft ? "Consume a No when opponent answers No" : "No more NOs remaining"}
          >
            {isConsumingNo ? (
              <Loader2 className="h-4 w-4 animate-spin text-violet" />
            ) : (
              <MinusCircle className="h-4 w-4" />
            )}
            <span>CONSUME NO ({nosRemaining})</span>
          </button>

          {/* Make Guess Button */}
          <button
            type="button"
            onClick={onOpenGuessModal}
            disabled={!hasGuessesLeft}
            className={cn(
              "px-5 sm:px-6 py-2.5 rounded-sm font-valorant text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-sm",
              hasGuessesLeft
                ? "bg-[#FF4655] hover:bg-[#ff5a67] text-white shadow-[0_0_20px_rgba(255,70,85,0.4)] active:scale-98"
                : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50"
            )}
            title={hasGuessesLeft ? "Make a final guess on opponent's agent" : "No guesses remaining"}
          >
            <Crosshair className="h-4 w-4" />
            <span>MAKE GUESS ({guessesRemaining})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
