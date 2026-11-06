"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import {
  Swords,
  Timer as TimerIcon,
  MessageSquare,
  Target,
  Compass,
  X,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingStepper } from "./SettingStepper";

interface GamemodeDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isHost: boolean;
  questionMode: "PRESET" | "FREEFORM";
  setQuestionMode: (mode: "PRESET" | "FREEFORM") => void;
  timer: number;
  setTimer: (val: number | ((prev: number) => number)) => void;
  maxNos: number;
  setMaxNos: (val: number | ((prev: number) => number)) => void;
  maxGuesses: number;
  setMaxGuesses: (val: number | ((prev: number) => number)) => void;
  questionCount: number;
  setQuestionCount: (val: number | ((prev: number) => number)) => void;
  showMoreOptions?: boolean;
  setShowMoreOptions?: (val: boolean) => void;
}

export function GamemodeDrawer({
  isOpen,
  onOpenChange,
  isHost,
  questionMode,
  setQuestionMode,
  timer,
  setTimer,
  maxNos,
  setMaxNos,
  maxGuesses,
  setMaxGuesses,
  questionCount,
  setQuestionCount,
}: GamemodeDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <DrawerContent className="bg-[#07090e]/98 border-r border-white/10 text-white backdrop-blur-2xl sm:max-w-md w-full sm:w-[440px] [--drawer-bleed-background:#07090e] flex flex-col h-full max-h-screen select-none">
        <div className="h-1 w-full bg-[#FF4655] shrink-0" />

        <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
              <Swords className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-valorant text-base tracking-[0.1em] text-white">
                MATCH CONFIGURATION
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                MODE &amp; GAME RULES
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-sm border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">
                1. SELECT QUESTION MODE
              </span>
              <span className="text-[9px] font-mono text-[#FF4655] uppercase font-bold">
                {questionMode === "FREEFORM" ? "OPEN DIALOGUE" : "CURATED CARDS"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => isHost && setQuestionMode("PRESET")}
                disabled={!isHost}
                className={cn(
                  "p-3 rounded-sm border text-left transition-all cursor-pointer relative",
                  questionMode === "PRESET"
                    ? "border-[#FF4655] bg-[#FF4655]/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]",
                  !isHost && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className={cn("h-4 w-4", questionMode === "PRESET" ? "text-[#FF4655]" : "text-white/40")} />
                  <span className="font-valorant text-xs tracking-wider">PRESET</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                  Pick from curated questions with fixed round turns.
                </p>
              </button>

              <button
                type="button"
                onClick={() => isHost && setQuestionMode("FREEFORM")}
                disabled={!isHost}
                className={cn(
                  "p-3 rounded-sm border text-left transition-all cursor-pointer relative",
                  questionMode === "FREEFORM"
                    ? "border-[#FF4655] bg-[#FF4655]/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]",
                  !isHost && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare className={cn("h-4 w-4", questionMode === "FREEFORM" ? "text-[#FF4655]" : "text-white/40")} />
                  <span className="font-valorant text-xs tracking-wider">FREEFORM</span>
                </div>
                <p className="text-[10px] text-white/50 leading-relaxed font-sans">
                  Ask anything in chat or voice. Deduce anytime!
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-3.5 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF4655] block">
              2. {questionMode === "FREEFORM" ? "FREEFORM RULES" : "PRESET RULES"}
            </span>

            {questionMode === "FREEFORM" ? (
              <div className="space-y-3">
                <SettingStepper
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="MAX NOs"
                  description="Allowed negative answers before penalty"
                  value={maxNos}
                  options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1]}
                  presets={[3, 5, 10, -1]}
                  disabled={!isHost}
                  unitLabel="NOS"
                  accent="violet"
                  onChange={setMaxNos}
                />

                <SettingStepper
                  icon={<Target className="h-4 w-4" />}
                  label="MAX GUESSES"
                  description="Number of final agent guesses per duel"
                  value={maxGuesses}
                  options={[1, 2, 3, 5, 10, -1]}
                  presets={[1, 3, 5, -1]}
                  disabled={!isHost}
                  unitLabel="GUESSES"
                  accent="red"
                  onChange={setMaxGuesses}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <SettingStepper
                  icon={<TimerIcon className="h-4 w-4" />}
                  label="ROUND TIMER"
                  description="Seconds allowed per question turn"
                  value={timer}
                  options={[30, 45, 60, 90, 120, 180, -1]}
                  presets={[30, 60, 120, -1]}
                  disabled={!isHost}
                  formatPreset={(v) => (v === -1 ? "∞" : `${v}s`)}
                  unitLabel="SECONDS"
                  accent="red"
                  onChange={setTimer}
                />

                <SettingStepper
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="MAX NOs"
                  description="Allowed negative answers before penalty"
                  value={maxNos}
                  options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1]}
                  presets={[3, 5, 10, -1]}
                  disabled={!isHost}
                  unitLabel="NOS"
                  accent="violet"
                  onChange={setMaxNos}
                />

                <SettingStepper
                  icon={<Target className="h-4 w-4" />}
                  label="MAX GUESSES"
                  description="Number of final agent guesses per duel"
                  value={maxGuesses}
                  options={[1, 2, 3, 5, 10, -1]}
                  presets={[1, 3, 5, -1]}
                  disabled={!isHost}
                  unitLabel="GUESSES"
                  accent="red"
                  onChange={setMaxGuesses}
                />

                <SettingStepper
                  icon={<Compass className="h-4 w-4" />}
                  label="QUESTION POOL COUNT"
                  description="Questions sampled into match deck"
                  value={questionCount}
                  options={[10, 15, 20, 25, 30]}
                  presets={[10, 15, 20, 25]}
                  disabled={!isHost}
                  unitLabel="CARDS"
                  accent="mint"
                  onChange={setQuestionCount}
                />
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
