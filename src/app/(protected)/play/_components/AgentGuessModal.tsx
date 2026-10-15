"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Crosshair,
  Search,
  Shield,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";
import { AGENTS, Agent, Role } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AgentGuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmGuess: (agentId: string) => void;
  eliminatedIds: Set<string>;
  guessesRemaining: number;
}

export function AgentGuessModal({
  isOpen,
  onClose,
  onConfirmGuess,
  eliminatedIds,
  guessesRemaining,
}: AgentGuessModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");

  const filteredAgents = AGENTS.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedAgent = AGENTS.find((a) => a.id === selectedAgentId);

  const handleConfirm = () => {
    if (selectedAgentId) {
      onConfirmGuess(selectedAgentId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full min-w-0 max-w-md sm:max-w-md bg-[#090d14]/98 border border-[#FF4655]/40 text-white backdrop-blur-2xl shadow-[0_0_50px_rgba(255,70,85,0.25)] py-6 rounded-sm select-none">
        <DialogHeader className="border-b border-white/10 pb-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/50 flex items-center justify-center text-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.3)]">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="font-valorant text-xl tracking-wider text-white">
                  MAKE FINAL GUESS
                </DialogTitle>
                <p className="text-xs text-white/50 font-sans mt-0.5">
                  Select the opponent&apos;s secret agent. Remaining guesses:{" "}
                  <span className="font-bold text-accent">
                    {guessesRemaining}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Controls: Search & Role Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-sm w-full sm:w-auto">
            {(
              ["ALL", "Duelist", "Initiator", "Controller", "Sentinel"] as const
            ).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  "px-2 py-1 text-[10px] font-display font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer",
                  roleFilter === r
                    ? "bg-[#FF4655] text-white shadow-[0_0_10px_rgba(255,70,85,0.3)]"
                    : "text-white/50 hover:text-white hover:bg-white/5",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8 bg-black/40 border-white/10 text-xs text-white placeholder-white/30 rounded-sm"
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="mt-4 max-h-85 overflow-y-auto pr-1 scrollbar-thin grid grid-cols-5 gap-2.5">
          {filteredAgents.map((agent) => {
            const isEliminated = eliminatedIds.has(agent.id);
            const isSelected = selectedAgentId === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => {
                  selectedAgentId === agent.id
                    ? setSelectedAgentId(null)
                    : setSelectedAgentId(agent.id);
                }}
                className={cn(
                  "flex flex-col items-center p-2 rounded-sm border transition-all text-left relative group cursor-pointer",
                  isSelected
                    ? "border-[#FF4655] bg-[#FF4655]/20 shadow-[0_0_18px_rgba(255,70,85,0.35)] scale-102"
                    : isEliminated
                      ? "border-white/5 bg-black/40 opacity-40 hover:opacity-75"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/30",
                )}
              >
                {/* Agent Icon */}
                <div className="relative h-14 w-14 rounded-xs overflow-hidden bg-black/60 border border-white/10 mb-1.5 shrink">
                  <Image
                    src={agent.iconPath}
                    alt={agent.name}
                    fill
                    className={cn(
                      "object-cover object-top transition-transform group-hover:scale-105",
                      isEliminated && !isSelected && "grayscale",
                    )}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-[#FF4655] pointer-events-none" />
                  )}
                </div>

                {/* Name */}
                <span className="font-valorant text-[10px] tracking-wider text-white uppercase truncate w-full text-center">
                  {agent.name}
                </span>

                {/* Role badge */}
                <span className="text-[8px] font-mono text-white/40 uppercase truncate">
                  {agent.role}
                </span>

                {isEliminated && !isSelected && (
                  <span className="absolute top-1 right-1 text-[7px] font-bold text-accent bg-black/80 px-1 py-0.2 rounded border border-accent/40">
                    OUT
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirmation Footer Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/30 p-3 rounded-sm">
          {selectedAgent ? (
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-xs overflow-hidden border border-[#FF4655] shrink-0">
                <Image
                  src={selectedAgent.iconPath}
                  alt={selectedAgent.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-accent uppercase font-bold tracking-widest">
                  TARGET LOCKED:
                </span>
                <span className="font-valorant text-base text-white tracking-wider">
                  {selectedAgent.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-white/40 font-mono">
              Click to lock in your guess.
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleConfirm}
              disabled={!selectedAgentId}
              className="flex-1 sm:flex-initial px-6 py-2 rounded-sm bg-[#FF4655] hover:bg-[#ff5a67] disabled:opacity-40 disabled:pointer-events-none text-white font-valorant text-xs tracking-[0.15em] uppercase shadow-[0_0_18px_rgba(255,70,85,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="h-4 w-4" />
              <span>CONFIRM</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
