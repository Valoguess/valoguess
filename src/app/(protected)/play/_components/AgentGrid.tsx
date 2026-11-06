"use client";

import { X, Crosshair, RotateCcw } from "lucide-react";
import { AGENTS, Role } from "@/lib/data";
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
  onResetEliminated?: () => void;
  onOpenGuessModal?: () => void;
}

export function AgentGrid({
  externalEliminated,
  onToggleEliminated,
  onResetEliminated,
  onOpenGuessModal,
}: AgentGridProps = {}) {
  const [internalEliminated, setInternalEliminated] = useState<Set<string>>(
    new Set(),
  );
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | "ALL">("ALL");
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
    if (onResetEliminated) {
      onResetEliminated();
    }
    setInternalEliminated(new Set());
  };

  const myPlayer =
    game?.players.find(
      (p) => p.id === user?.id || (p.state && p.state.secretAgent !== null),
    ) || game?.players[0];
  const isMyTurn = Boolean(myPlayer?.state?.isMyTurn);
  const guessesRemaining = myPlayer?.state?.guessesRemaining ?? 0;
  const yourTurn = isMyTurn && guessesRemaining > 0;

  const filteredAgents =
    selectedRole === "ALL"
      ? AGENTS
      : AGENTS.filter((a) => a.role === selectedRole);

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
      <div className="mt-3 sm:mt-4 flex flex-col border border-white/10 bg-[#080b10]/90 backdrop-blur-md p-3 sm:p-4 rounded-sm">
        <div className="mb-3 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-valorant text-xs uppercase tracking-wider text-[#FF4655]">
                ELIMINATE AGENTS
              </span>
              <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-xs border border-white/10">
                {eliminated.size} / {AGENTS.length} OUT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetEliminated}
                disabled={eliminated.size === 0}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xs border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white text-[10px] font-display font-bold uppercase tracking-wider transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                title="Reset all eliminations"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden min-[380px]:inline">RESET</span>
              </button>

              {yourTurn && (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#FF4655] hover:bg-[#ff5a67] text-white text-[10px] font-display font-bold uppercase tracking-wider rounded-xs transition active:scale-95 cursor-pointer"
                  title="Make Final Guess"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>GUESS</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {(["ALL", "Duelist", "Initiator", "Controller", "Sentinel"] as const).map((r) => {
              const count =
                r === "ALL"
                  ? AGENTS.length
                  : AGENTS.filter((a) => a.role === r).length;
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-display font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5",
                    isSelected
                      ? "bg-[#FF4655] text-white"
                      : "text-white/50 hover:text-white bg-white/[0.03] hover:bg-white/5 border border-white/5",
                  )}
                >
                  <span>{r}</span>
                  <span
                    className={cn(
                      "text-[8px] font-mono",
                      isSelected ? "text-white/80" : "text-white/30",
                    )}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 min-[440px]:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-1.5 sm:gap-2">
          {filteredAgents.map((a) => {
            const isOut = eliminated.has(a.id);

            return (
              <button
                key={a.id}
                onClick={() => toggleEliminated(a.id)}
                className="group cursor-pointer"
                title={`${a.name} (${a.role})`}
              >
                <div
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-xs border bg-black transition-all duration-150",
                    isOut
                      ? "border-white/5 opacity-40 grayscale"
                      : "border-white/10 hover:border-[#FF4655]/60",
                  )}
                >
                  <Image
                    src={a.iconPath}
                    alt={a.name}
                    fill
                    draggable={false}
                    className="select-none object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black via-black/80 to-transparent" />

                  <p
                    className={cn(
                      "absolute bottom-1 left-0 right-0 z-20 truncate px-1 text-center font-display text-[8px] font-bold uppercase tracking-wider text-white",
                      isOut && "opacity-50",
                    )}
                  >
                    {a.name}
                  </p>

                  {isOut && (
                    <X
                      className="absolute right-1 top-1 h-3.5 w-3.5 text-[#FF4655]"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={handleResetEliminated}
            disabled={eliminated.size === 0}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/50 hover:text-white text-xs font-display font-bold uppercase tracking-wider transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>RESET ELIMINATIONS</span>
          </button>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-[10px] font-mono text-white/40">
              Guesses:{" "}
              <span className="font-bold text-[#FF4655]">{guessesRemaining}</span>
            </span>

            <button
              onClick={handleOpenModal}
              disabled={!yourTurn}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 sm:px-6 py-2 font-display text-xs font-bold uppercase tracking-wider text-white rounded-xs transition-all cursor-pointer",
                yourTurn
                  ? "bg-[#FF4655] hover:bg-[#ff5a67] active:scale-98"
                  : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50",
              )}
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>MAKE FINAL GUESS</span>
            </button>
          </div>
        </div>
      </div>

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
