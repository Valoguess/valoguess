"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Swords,
  Sliders,
  Timer as TimerIcon,
  MessageSquare,
  Target,
  Compass,
  X,
  Check,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  showMoreOptions: boolean;
  setShowMoreOptions: (val: boolean) => void;
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
  showMoreOptions,
  setShowMoreOptions,
}: GamemodeDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <DrawerContent className="bg-[#07090e]/98 border-r border-white/10 text-white backdrop-blur-2xl sm:max-w-md w-full sm:w-[460px] [--drawer-bleed-background:#07090e] flex flex-col h-full max-h-screen select-none">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-white/10 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
                <Swords className="h-3.5 w-3.5" />
              </div>
              <h2 className="font-valorant text-base tracking-[0.1em] text-white">
                GAME MODE &amp; SETTINGS
              </h2>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* 1. GAMEMODE SELECTOR */}
          <div className="space-y-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF4655] block">
              1. SELECT GAME MODE
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Active Mode: GUESS AGENT */}
              <div className="clip-notch-both border border-[#FF4655] bg-[#FF4655]/10 p-3.5 relative overflow-hidden shadow-[0_0_20px_rgba(255,70,85,0.2)]">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF4655]" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xs bg-[#FF4655] flex items-center justify-center text-white shadow-sm">
                      <Swords className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-valorant text-sm tracking-wide text-white block">
                        GUESS AGENT
                      </span>
                      <span className="text-[9px] font-mono uppercase text-accent tracking-wider">
                        1V1 TACTICAL DEDUCTION
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold bg-[#FF4655] text-white px-2 py-0.5 rounded-xs tracking-wider flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. QUESTION SUBMODE SELECTION */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">
                2. QUESTION SUBMODE
              </span>
              <span className="text-[9px] font-mono text-accent uppercase font-bold">
                {questionMode === "FREEFORM" ? "OPEN QUESTIONS" : "CURATED CARDS"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* PRESET BUTTON */}
              <button
                type="button"
                onClick={() => isHost && setQuestionMode("PRESET")}
                disabled={!isHost}
                className={cn(
                  "p-3 rounded-sm border text-left transition-all cursor-pointer relative overflow-hidden",
                  questionMode === "PRESET"
                    ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_15px_rgba(255,70,85,0.25)]"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]",
                  !isHost && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className={cn("h-4 w-4", questionMode === "PRESET" ? "text-accent" : "text-white/40")} />
                  <span className="font-valorant text-xs tracking-wider">PRESET</span>
                </div>
                <p className="text-[9.5px] text-white/50 leading-relaxed font-sans">
                  Draw questions from curated tactical card pool. Fixed round turns.
                </p>
              </button>

              {/* FREEFORM BUTTON */}
              <button
                type="button"
                onClick={() => isHost && setQuestionMode("FREEFORM")}
                disabled={!isHost}
                className={cn(
                  "p-3 rounded-sm border text-left transition-all cursor-pointer relative overflow-hidden",
                  questionMode === "FREEFORM"
                    ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_15px_rgba(255,70,85,0.25)]"
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05]",
                  !isHost && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare className={cn("h-4 w-4", questionMode === "FREEFORM" ? "text-accent" : "text-white/40")} />
                  <span className="font-valorant text-xs tracking-wider">FREEFORM</span>
                </div>
                <p className="text-[9.5px] text-white/50 leading-relaxed font-sans">
                  Ask custom questions freely in chat or voice. Deduce anytime!
                </p>
              </button>
            </div>
          </div>

          {/* 3. DYNAMIC SETTINGS BASED ON SUBMODE */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF4655] block">
              3. {questionMode === "FREEFORM" ? "FREEFORM SETTINGS" : "PRESET MATCH SETTINGS"}
            </span>

            {/* ===================== FREEFORM MODE ===================== */}
            {questionMode === "FREEFORM" ? (
              <div className="space-y-4">
                {/* SETTING: MAX NOS */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-violet mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">MAX NOS</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Allowed &apos;No&apos; answers</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                        const idx = nosOpts.indexOf(maxNos);
                        if (idx > 0) setMaxNos(nosOpts[idx - 1]);
                        else if (idx === -1) setMaxNos(10);
                      }}
                      disabled={!isHost || maxNos === 0}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {maxNos === -1 ? "∞" : maxNos}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        {maxNos === -1 ? "INFINITE" : "NOS"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                        const idx = nosOpts.indexOf(maxNos);
                        if (idx >= 0 && idx < nosOpts.length - 1) setMaxNos(nosOpts[idx + 1]);
                        else if (idx === -1) setMaxNos(-1);
                      }}
                      disabled={!isHost || maxNos === -1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 10, -1].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setMaxNos(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          maxNos === preset
                            ? "bg-violet/20 border-violet text-white shadow-[0_0_8px_rgba(140,123,255,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset === -1 ? "∞" : preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SETTING: MAX GUESSES */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <Target className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">MAX GUESSES</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Guesses per game</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const guessOpts = [1, 2, 3, 5, 10, -1];
                        const idx = guessOpts.indexOf(maxGuesses);
                        if (idx > 0) setMaxGuesses(guessOpts[idx - 1]);
                        else if (idx === -1) setMaxGuesses(10);
                      }}
                      disabled={!isHost || maxGuesses === 1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {maxGuesses === -1 ? "∞" : maxGuesses}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        {maxGuesses === -1 ? "INFINITE" : "GUESSES"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const guessOpts = [1, 2, 3, 5, 10, -1];
                        const idx = guessOpts.indexOf(maxGuesses);
                        if (idx >= 0 && idx < guessOpts.length - 1) setMaxGuesses(guessOpts[idx + 1]);
                        else if (idx === -1) setMaxGuesses(-1);
                      }}
                      disabled={!isHost || maxGuesses === -1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 3, 5, -1].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setMaxGuesses(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          maxGuesses === preset
                            ? "bg-[#FF4655]/20 border-[#FF4655] text-white shadow-[0_0_8px_rgba(255,70,85,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset === -1 ? "∞" : preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ===================== PRESET MODE SETTINGS ===================== */
              <div className="space-y-5">
                {/* SETTING: TIMER */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <TimerIcon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">TIMER</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Time per round</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const timerOpts = [30, 45, 60, 90, 120, 180, -1];
                        const idx = timerOpts.indexOf(timer);
                        if (idx > 0) setTimer(timerOpts[idx - 1]);
                        else if (idx === -1) setTimer(180);
                      }}
                      disabled={!isHost || timer === 30}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {timer === -1 ? "∞" : timer}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        {timer === -1 ? "INFINITE" : "SECONDS"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const timerOpts = [30, 45, 60, 90, 120, 180, -1];
                        const idx = timerOpts.indexOf(timer);
                        if (idx >= 0 && idx < timerOpts.length - 1) setTimer(timerOpts[idx + 1]);
                        else if (idx === -1) setTimer(-1);
                      }}
                      disabled={!isHost || timer === -1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[30, 60, 120, -1].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setTimer(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          timer === preset
                            ? "bg-[#FF4655]/20 border-[#FF4655] text-white shadow-[0_0_8px_rgba(255,70,85,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset === -1 ? "∞" : `${preset}s`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SETTING: MAX NOS */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-violet mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">MAX NOS</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Allowed &apos;No&apos; answers</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                        const idx = nosOpts.indexOf(maxNos);
                        if (idx > 0) setMaxNos(nosOpts[idx - 1]);
                        else if (idx === -1) setMaxNos(10);
                      }}
                      disabled={!isHost || maxNos === 0}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {maxNos === -1 ? "∞" : maxNos}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        {maxNos === -1 ? "INFINITE" : "NOS"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                        const idx = nosOpts.indexOf(maxNos);
                        if (idx >= 0 && idx < nosOpts.length - 1) setMaxNos(nosOpts[idx + 1]);
                        else if (idx === -1) setMaxNos(-1);
                      }}
                      disabled={!isHost || maxNos === -1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 10, -1].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setMaxNos(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          maxNos === preset
                            ? "bg-violet/20 border-violet text-white shadow-[0_0_8px_rgba(140,123,255,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset === -1 ? "∞" : preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SETTING: MAX GUESSES */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <Target className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">MAX GUESSES</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Guesses per game</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const guessOpts = [1, 2, 3, 5, 10, -1];
                        const idx = guessOpts.indexOf(maxGuesses);
                        if (idx > 0) setMaxGuesses(guessOpts[idx - 1]);
                        else if (idx === -1) setMaxGuesses(10);
                      }}
                      disabled={!isHost || maxGuesses === 1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {maxGuesses === -1 ? "∞" : maxGuesses}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        {maxGuesses === -1 ? "INFINITE" : "GUESSES"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const guessOpts = [1, 2, 3, 5, 10, -1];
                        const idx = guessOpts.indexOf(maxGuesses);
                        if (idx >= 0 && idx < guessOpts.length - 1) setMaxGuesses(guessOpts[idx + 1]);
                        else if (idx === -1) setMaxGuesses(-1);
                      }}
                      disabled={!isHost || maxGuesses === -1}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 3, 5, -1].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setMaxGuesses(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          maxGuesses === preset
                            ? "bg-[#FF4655]/20 border-[#FF4655] text-white shadow-[0_0_8px_rgba(255,70,85,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset === -1 ? "∞" : preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SETTING: QUESTION POOL COUNT */}
                <div className="flex flex-col text-left bg-black/30 border border-white/10 rounded-sm p-3.5">
                  <div className="flex items-start gap-2 mb-2">
                    <Compass className="h-4 w-4 text-mint mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-valorant text-xs tracking-wider text-white">QUESTION POOL COUNT</span>
                      <span className="text-[9px] font-mono text-white/50 uppercase">Questions sampled per match</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const poolOpts = [10, 15, 20, 25, 30];
                        const idx = poolOpts.indexOf(questionCount);
                        if (idx > 0) setQuestionCount(poolOpts[idx - 1]);
                      }}
                      disabled={!isHost || questionCount <= 10}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl font-black text-white leading-none">
                        {questionCount}
                      </span>
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-mono mt-0.5">
                        QUESTIONS
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const poolOpts = [10, 15, 20, 25, 30];
                        const idx = poolOpts.indexOf(questionCount);
                        if (idx >= 0 && idx < poolOpts.length - 1) setQuestionCount(poolOpts[idx + 1]);
                      }}
                      disabled={!isHost || questionCount >= 30}
                      className="h-7 w-7 rounded-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 15, 20, 25].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => isHost && setQuestionCount(preset)}
                        disabled={!isHost}
                        className={cn(
                          "py-1 rounded-xs text-[9px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                          questionCount === preset
                            ? "bg-mint/20 border-mint text-white shadow-[0_0_8px_rgba(60,242,196,0.25)]"
                            : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white"
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MORE OPTIONS ACCORDION */}
                <div className="border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="flex items-center justify-between w-full text-white/50 hover:text-white transition-colors py-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.18em]">
                      <Compass className="h-4 w-4 text-white/50" />
                      <span>MORE MATCH OPTIONS</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showMoreOptions && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showMoreOptions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden text-left"
                      >
                        <div className="pt-2.5 space-y-2.5 text-xs text-white/60">
                          <label className="flex items-center justify-between py-1 border-b border-white/[0.03] cursor-pointer hover:text-white transition-colors">
                            <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">
                              Reveal Secret Agent Roles
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked
                              disabled={!isHost}
                              className="accent-accent h-3.5 w-3.5 rounded border-white/10 bg-black cursor-pointer"
                            />
                          </label>

                          <label className="flex items-center justify-between py-1 border-b border-white/[0.03] cursor-pointer hover:text-white transition-colors">
                            <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">
                              Allow Match Spectating
                            </span>
                            <input
                              type="checkbox"
                              defaultChecked
                              disabled={!isHost}
                              className="accent-accent h-3.5 w-3.5 rounded border-white/10 bg-black cursor-pointer"
                            />
                          </label>

                          <div className="flex items-center justify-between py-1 hover:text-white transition-colors">
                            <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">
                              Match Map Selection
                            </span>
                            <Select defaultValue="Bind" disabled={!isHost}>
                              <SelectTrigger className="w-28 bg-black/80 border-white/15 text-[9.5px] font-display uppercase tracking-wider h-7 px-2 text-white">
                                <SelectValue placeholder="Map" />
                              </SelectTrigger>
                              <SelectContent className="bg-base-900 border-white/15 text-white">
                                <SelectItem value="Bind" className="text-xs">Bind</SelectItem>
                                <SelectItem value="Haven" className="text-xs">Haven</SelectItem>
                                <SelectItem value="Split" className="text-xs">Split</SelectItem>
                                <SelectItem value="Ascent" className="text-xs">Ascent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
