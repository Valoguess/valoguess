"use client";

import { Crosshair, MessageSquare, Loader2, Sparkles, MinusCircle } from "lucide-react";
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
    <div className="flex flex-col border border-white/10 bg-[#080b10]/90 backdrop-blur-md p-5 rounded-sm relative overflow-hidden min-h-[200px] justify-between mb-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rotate-45 bg-mint" />
          <span className="font-valorant text-xs tracking-wider uppercase text-white">
            FREEFORM MODE
          </span>
          <span className="text-[9px] font-mono bg-mint/10 border border-mint/30 px-2 py-0.5 rounded-xs text-mint">
            FREE QUESTIONS
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

      <div className="my-auto py-3 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-white/5 border border-white/10 text-white/80 text-[10.5px] font-display font-bold uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5 text-mint" />
          <span>FREE-FORM MODE</span>
        </div>

        <h2 className="font-valorant text-xl sm:text-2xl text-white tracking-wider mb-2">
          ASK QUESTIONS FREELY
        </h2>

        <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed mb-4">
          Ask <span className="text-white font-semibold">{opponentName}</span> questions freely in Party Chat or voice.
          Whenever they answer <span className="text-[#FF4655] font-bold">&quot;NO&quot;</span>, consume a No.
          When you know their secret agent, submit your guess!
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
        <div className="text-[10px] font-mono text-white/40 flex items-center justify-center sm:justify-start gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-[#FF4655]" />
          <span>Type in Party Chat to converse</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onConsumeNo}
            disabled={!hasNosLeft || isConsumingNo}
            className={cn(
              "px-4 sm:px-5 py-2 rounded-xs border font-display text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer",
              hasNosLeft
                ? "border-[#8C7BFF]/50 bg-[#8C7BFF]/15 hover:bg-[#8C7BFF]/25 text-[#8C7BFF] active:scale-98"
                : "border-white/10 bg-white/5 text-white/30 cursor-not-allowed opacity-50"
            )}
            title={hasNosLeft ? "Consume a No when opponent answers No" : "No more NOs remaining"}
          >
            {isConsumingNo ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#8C7BFF]" />
            ) : (
              <MinusCircle className="h-4 w-4" />
            )}
            <span>CONSUME NO ({nosRemaining})</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuessModal}
            disabled={!hasGuessesLeft}
            className={cn(
              "px-5 sm:px-6 py-2 rounded-xs font-display text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer",
              hasGuessesLeft
                ? "bg-[#FF4655] hover:bg-[#ff5a67] text-white active:scale-98"
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
