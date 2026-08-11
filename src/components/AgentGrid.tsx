"use client";

import { X, Search, Crosshair, RefreshCw } from "lucide-react";
import { AGENTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useRoomStore } from "@/store/roomStore";

import { submitGuess } from "@/socket/emitter";

export function AgentGrid() {
  const [eliminated, setEliminated] = useState<Set<string>>(new Set());
  const [guess, setGuess] = useState<string>("");
  const { room } = useRoomStore();

  const toggleEliminated = (id: string) => {
    setEliminated((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const onGuess = () => {
    if (!room || !guess || !room.me.state.isMyTurn) return;
    submitGuess(room.id, guess);
    setGuess("");
  };

  const yourTurn = !!room?.me.state.isMyTurn && (room?.me.state.guessesRemaining ?? 0) > 0;
  
  return (
    <div className="clip-notch-both mt-5 flex flex-col border border-white/5 bg-base-850 p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-sm font-bold uppercase tracking-widest text-accent">
          Eliminate Agents
        </span>
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
              className="group"
            >
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-[4px] border bg-zinc-900 transition-all duration-200",
                  isOut
                    ? "border-white/10"
                    : "border-white/10 hover:border-accent/70 hover:shadow-[0_0_18px_rgba(255,70,85,0.18)]"
                )}
              >
                {/* Image */}
                <Image
                  src={`/agents/icon/${a.id}.png`}
                  alt={a.name}
                  fill
                  draggable={false}
                  className={cn(
                    "select-none object-cover transition-all duration-300",
                    isOut
                      ? "grayscale brightness-[0.28] saturate-0"
                      : "group-hover:scale-105"
                  )}
                />

                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 transition-colors duration-200",
                    isOut ? "bg-black/35" : "bg-black/10 group-hover:bg-black/0"
                  )}
                />

                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-black via-black/80 to-transparent" />

                {/* Agent Name */}
                <p
                  className={cn(
                    "absolute bottom-1 left-0 right-0 z-20 truncate px-1 text-center font-display text-[8px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity",
                    isOut && "opacity-70"
                  )}
                >
                  {a.name}
                </p>

                {/* Elimination Slash */}
                {isOut && (
                  <>

                    <X
                      className="absolute right-1 top-1 h-4 w-4 text-accent drop-shadow-[0_0_6px_rgba(255,70,85,.8)]"
                      strokeWidth={2.8}
                    />
                  </>
                )}

                {/* Top Right Corner */}
                <div className="absolute right-0 top-0 h-4 w-4">
                  <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
                  <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
                </div>

                {/* Bottom Left Corner */}
                <div className="absolute bottom-0 left-0 h-4 w-4">
                  <div className="absolute bottom-0 left-0 h-px w-4 bg-accent/30" />
                  <div className="absolute bottom-0 left-0 h-4 w-px bg-accent/30" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <select
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={!yourTurn}
            className="w-full appearance-none rounded-sm border border-white/10 bg-base-800 py-3 pl-9 pr-4 text-sm text-ink-100 outline-none transition focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select an agent to guess...</option>
            {AGENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onGuess}
          disabled={!yourTurn || !guess}
          className="clip-tag flex flex-[2] items-center justify-center gap-2 bg-accent py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <Crosshair className="h-4 w-4" />
          Guess Agent
        </button>
      </div>
    </div>
  );
}
