"use client";

import { X, Search, Crosshair, RotateCcw, AlertTriangle } from "lucide-react";
import { AGENTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useAuthStore } from "@/store/authStore";
import { submitGuess } from "@/socket/emitter";
import { AgentGuessModal } from "./AgentGuessModal";

interface AgentGridProps {
  externalEliminated?: Set<string>;
  onToggleEliminated?: (id: string) => void;
  onOpenGuessModal?: () => void;
}

export function AgentGrid({
  externalEliminated,
  onToggleEliminated,
  onOpenGuessModal,
}: AgentGridProps = {}) {
  const [internalEliminated, setInternalEliminated] = useState<Set<string>>(new Set());
  const [showGuessModal, setShowGuessModal] = useState(false);
  const { game } = useGameStore();
  const { user } = useAuthStore();

  const eliminated = externalEliminated ?? internalEliminated;

  const toggleEliminated = (id: string) => {
    if (onToggleEliminated) {
      onToggleEliminated(id);
      return;
    }
    setInternalEliminated((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleResetEliminated = () => {
    setInternalEliminated(new Set());
  };

  const myPlayer =
    game?.players.find(
      (p) => p.id === user?.id || (p.state && p.state.secretAgent !== null)
    ) || game?.players[0];
  const isMyTurn = Boolean(myPlayer?.state?.isMyTurn);
  const guessesRemaining = myPlayer?.state?.guessesRemaining ?? 0;
  const yourTurn = isMyTurn && guessesRemaining > 0;

  const handleGuessConfirm = (agentId: string) => {
    if (!game || !isMyTurn) return;
    submitGuess(agentId);
  };

  const handleOpenModal = () => {
    if (onOpenGuessModal) {
      onOpenGuessModal();
    } else {
      setShowGuessModal(true);
    }
  };

  return (
    <>
      <div className="clip-notch-both mt-5 flex flex-col border border-white/5 bg-base-850 p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-accent">
              Eliminate Agents
            </span>
            <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
              {eliminated.size} / {AGENTS.length} OUT
            </span>
          </div>
          <span className="text-xs text-ink-500">
            Click on agents to eliminate or restore them
          </span>
        </div>

        <div className="grid grid-cols-10 gap-2.5">
          {AGENTS.map((a) => {
            const isOut = eliminated.has(a.id);

            return (
              <button
                key={a.id}
                onClick={() => toggleEliminated(a.id)}
                className="group cursor-pointer"
                title={`${a.name} (${a.role}) - Click to toggle eliminated`}
              >
                <div
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-[4px] border bg-zinc-900 transition-all duration-200",
                    isOut
                      ? "border-white/5"
                      : "border-white/10 hover:border-accent/70 hover:shadow-[0_0_18px_rgba(255,70,85,0.18)]"
                  )}
                >
                  {/* Image */}
                  <Image
                    src={`/agents/icon/${a.id}.avif`}
                    alt={a.name}
                    fill
                    draggable={false}
                    className={cn(
                      "select-none object-cover transition-all duration-300",
                      isOut
                        ? "grayscale brightness-[0.25] saturate-0"
                        : "group-hover:scale-105"
                    )}
                  />

                  {/* Hover Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors duration-200",
                      isOut ? "bg-black/45" : "bg-black/10 group-hover:bg-black/0"
                    )}
                  />

                  {/* Bottom Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-black via-black/80 to-transparent" />

                  {/* Agent Name */}
                  <p
                    className={cn(
                      "absolute bottom-1 left-0 right-0 z-20 truncate px-1 text-center font-display text-[8px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity",
                      isOut && "opacity-50"
                    )}
                  >
                    {a.name}
                  </p>

                  {/* Elimination Slash */}
                  {isOut && (
                    <X
                      className="absolute right-1 top-1 h-4 w-4 text-accent drop-shadow-[0_0_6px_rgba(255,70,85,.8)]"
                      strokeWidth={2.8}
                    />
                  )}

                  {/* Top Right Corner */}
                  <div className="absolute right-0 top-0 h-3 w-3">
                    <div className="absolute right-0 top-0 h-px w-3 bg-accent/60" />
                    <div className="absolute right-0 top-0 h-3 w-px bg-accent/60" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Action Bar: Reset Eliminations & Make Final Guess Button */}
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
          {/* Reset Eliminations */}
          <button
            onClick={handleResetEliminated}
            disabled={eliminated.size === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white text-xs font-display font-bold uppercase tracking-wider transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Eliminations</span>
          </button>

          {/* MAKE GUESS TRIGGER BUTTON */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/40">
              Remaining: <span className="font-bold text-accent">{guessesRemaining}</span>
            </span>

            <button
              onClick={handleOpenModal}
              disabled={!yourTurn}
              className={cn(
                "clip-tag flex items-center justify-center gap-2.5 px-8 py-3 font-valorant text-xs uppercase tracking-[0.15em] text-white transition-all shadow-md cursor-pointer",
                yourTurn
                  ? "bg-accent hover:bg-accent-dim shadow-[0_0_20px_rgba(255,70,85,0.4)] active:scale-98"
                  : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50"
              )}
              title={
                !isMyTurn
                  ? "Wait for your turn to make a guess"
                  : guessesRemaining <= 0
                  ? "No guesses remaining"
                  : "Make your final guess"
              }
            >
              <Crosshair className="h-4 w-4" />
              <span>MAKE FINAL GUESS</span>
            </button>
          </div>
        </div>
      </div>

      {/* TACTICAL AGENT GUESS MODAL */}
      <AgentGuessModal
        isOpen={showGuessModal}
        onClose={() => setShowGuessModal(false)}
        onConfirmGuess={handleGuessConfirm}
        eliminatedIds={eliminated}
        guessesRemaining={guessesRemaining}
      />
    </>
  );
}
