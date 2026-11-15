"use client";

import { X, Crosshair, RotateCcw } from "lucide-react";
import { AGENTS, Role } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useAuthStore } from "@/store/authStore";
import { submitGuess } from "@/socket/emitter";

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

  const remainingCount = AGENTS.length - eliminated.size;

  return (
    <div className="mt-3 sm:mt-4 flex flex-col border border-white/10 bg-[#080b10]/90 backdrop-blur-md p-3 sm:p-5 rounded-sm select-none">
      <div className="mb-3.5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-valorant text-xs sm:text-sm uppercase tracking-wider text-white">
              ELIMINATE CANDIDATES
            </span>
            <span className="text-xs font-mono text-white/60 bg-white/5 px-2.5 py-0.5 rounded-xs border border-white/10">
              <strong className="text-white">{remainingCount}</strong> REMAINING
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetEliminated}
              disabled={eliminated.size === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white text-xs font-display font-bold uppercase tracking-wider transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Reset all eliminations"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET BOARD</span>
            </button>

            {yourTurn && onOpenGuessModal && (
              <button
                onClick={onOpenGuessModal}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF4655] hover:bg-[#ff5a67] text-white text-xs font-display font-bold uppercase tracking-wider rounded-sm transition active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.3)]"
                title="Make Final Guess"
              >
                <Crosshair className="h-3.5 w-3.5" />
                <span>LOCK IN GUESS</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
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
                  "px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5",
                  isSelected
                    ? "bg-[#FF4655] text-white"
                    : "text-white/60 hover:text-white bg-white/[0.02] hover:bg-white/5 border border-white/5",
                )}
              >
                <span>{r}</span>
                <span
                  className={cn(
                    "text-xs font-mono",
                    isSelected ? "text-white/90" : "text-white/40",
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 min-[440px]:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-2 sm:gap-2.5">
        {filteredAgents.map((a) => {
          const isOut = eliminated.has(a.id);

          return (
            <button
              key={a.id}
              onClick={() => toggleEliminated(a.id)}
              className="group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-xs"
              title={`${a.name} (${a.role}) - Click to ${isOut ? "restore" : "eliminate"}`}
            >
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-xs border transition-all duration-150 bg-black",
                  isOut
                    ? "border-white/5 opacity-35 grayscale"
                    : "border-white/10 hover:border-[#FF4655]/60 hover:scale-[1.02]",
                )}
              >
                <Image
                  src={a.iconPath}
                  alt={a.name}
                  fill
                  draggable={false}
                  className="select-none object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <p
                  className={cn(
                    "absolute bottom-1 left-0 right-0 z-20 truncate px-1 text-center font-display text-xs font-bold uppercase tracking-wide text-white",
                    isOut && "opacity-40 line-through",
                  )}
                >
                  {a.name}
                </p>

                {isOut && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                    <X
                      className="h-8 w-8 text-[#FF4655] opacity-90 drop-shadow"
                      strokeWidth={3}
                    />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
