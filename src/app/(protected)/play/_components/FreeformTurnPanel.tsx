"use client";

import { ArrowRightCircle, Crosshair, MessageSquare, Shield, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeformTurnPanelProps {
  isMyTurn: boolean;
  onEndTurn: () => void;
  onOpenGuessModal: () => void;
  opponentName: string;
  guessesRemaining: number;
  isEndingTurn?: boolean;
}

export function FreeformTurnPanel({
  isMyTurn,
  onEndTurn,
  onOpenGuessModal,
  opponentName,
  guessesRemaining,
  isEndingTurn = false,
}: FreeformTurnPanelProps) {
  return (
    <div className="clip-notch-both flex flex-col border border-white/10 bg-[#07090e]/90 backdrop-blur-md p-6 shadow-[0_8px_30px_rgba(0,0,0,0.7)] relative overflow-hidden min-h-[220px] justify-between mb-5">
      {/* Accent corner decorations */}
      <div className="absolute left-0 top-0 h-4 w-4">
        <div className="absolute left-0 top-0 h-px w-4 bg-accent/60" />
        <div className="absolute left-0 top-0 h-4 w-px bg-accent/60" />
      </div>
      <div className="absolute right-0 top-0 h-4 w-4">
        <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
        <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
      </div>

      {/* Top Header Tag */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rotate-45", isMyTurn ? "bg-mint shadow-[0_0_8px_#3cf2c4]" : "bg-accent shadow-[0_0_8px_rgba(255,70,85,0.4)]")} />
          <span className="font-valorant text-xs tracking-[0.2em] uppercase text-white">
            FREEFORM MODE
          </span>
          <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">
            OPEN QUESTIONS
          </span>
        </div>

        <div className="text-[10px] font-mono text-white/50">
          Remaining Guesses: <span className="font-bold text-white">{guessesRemaining}</span>
        </div>
      </div>

      {/* Center Status & Instructions */}
      <div className="my-auto py-4 text-center flex flex-col items-center">
        {isMyTurn ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 text-mint text-xs font-display font-bold uppercase tracking-wider mb-2 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              <span>YOUR TURN TO INQUIRE</span>
            </div>
            <h2 className="font-valorant text-2xl md:text-3xl text-white tracking-wider mb-2">
              ASK A QUESTION IN CHAT OR VOICE
            </h2>
            <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed">
              Ask <span className="text-white font-semibold">{opponentName}</span> any question to narrow down their secret agent. Once they respond, click <span className="text-mint font-semibold">End Turn</span> to pass or <span className="text-accent font-semibold">Make Guess</span>.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-display font-bold uppercase tracking-wider mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>OPPONENT&apos;S TURN</span>
            </div>
            <h2 className="font-valorant text-2xl md:text-3xl text-white tracking-wider mb-2">
              {opponentName.toUpperCase()} IS ASKING
            </h2>
            <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed">
              Listen to or read <span className="text-white font-semibold">{opponentName}</span>&apos;s question in Party Chat [T]. Answer them truthfully!
            </p>
          </>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-accent" />
          <span>Press [T] to type in Party Chat</span>
        </div>

        {isMyTurn ? (
          <div className="flex items-center gap-3">
            {/* End Turn Button */}
            <button
              onClick={onEndTurn}
              disabled={isEndingTurn}
              className="px-5 py-2.5 rounded-sm border border-mint/50 bg-mint/10 hover:bg-mint/20 text-mint font-valorant text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(60,242,196,0.15)] disabled:opacity-50"
            >
              {isEndingTurn ? (
                <Loader2 className="h-4 w-4 animate-spin text-mint" />
              ) : (
                <ArrowRightCircle className="h-4 w-4" />
              )}
              <span>END TURN</span>
            </button>

            {/* Make Guess Button */}
            <button
              onClick={onOpenGuessModal}
              disabled={guessesRemaining <= 0}
              className="px-6 py-2.5 rounded-sm bg-[#FF4655] hover:bg-[#ff5a67] text-white font-valorant text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,70,85,0.4)] disabled:opacity-40"
            >
              <Crosshair className="h-4 w-4" />
              <span>MAKE GUESS</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-mono text-white/40">
            Waiting for {opponentName} to end turn...
          </div>
        )}
      </div>
    </div>
  );
}
