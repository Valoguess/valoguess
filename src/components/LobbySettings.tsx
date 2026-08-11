import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer as TimerIcon, MessageSquare, Target, Compass, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LobbySettingsProps = {
  isHost: boolean;
  timer: number;
  setTimer: (val: number | ((prev: number) => number)) => void;
  maxNos: number;
  setMaxNos: (val: number | ((prev: number) => number)) => void;
  maxGuesses: number;
  setMaxGuesses: (val: number | ((prev: number) => number)) => void;
  showMoreOptions: boolean;
  setShowMoreOptions: (val: boolean) => void;
};

export function LobbySettings({
  isHost,
  timer,
  setTimer,
  maxNos,
  setMaxNos,
  maxGuesses,
  setMaxGuesses,
  showMoreOptions,
  setShowMoreOptions,
}: LobbySettingsProps) {
  return (
    <div className="border border-white/[0.05] bg-[#07090e]/60 backdrop-blur-md rounded-sm p-5 flex flex-col justify-between relative overflow-hidden h-full min-h-0">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="text-left shrink-0">
        <h3 className="font-valorant text-xs tracking-widest text-[#FF4655] drop-shadow-[0_0_6px_rgba(255,70,85,0.2)]">
          GAME SETTINGS
        </h3>
        {/* Solid red bar below game settings */}
        <div className="h-[2px] w-12 bg-[#FF4655] mt-1.5 mb-4" />
      </div>

      {/* Settings list container - Scrollable */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1 scrollbar-thin">
        
        {/* SETTING 1: TIMER */}
        <div className="flex flex-col text-left">
          {/* Icon & Title */}
          <div className="flex items-start gap-2 mb-2">
            <TimerIcon className="h-4.5 w-4.5 text-accent mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-valorant text-[11px] tracking-wider text-white">TIMER</span>
              <span className="text-[9.5px] font-sans text-white/60 uppercase tracking-wide">Time per round</span>
            </div>
          </div>
          
          {/* Value Adjuster - Floating */}
          <div className="flex items-center justify-between px-8 py-1 mb-2">
            {/* Decrement */}
            <button 
              onClick={() => {
                const timerOpts = [30, 45, 60, 90, 120, 180, -1];
                const idx = timerOpts.indexOf(timer);
                if (idx > 0) setTimer(timerOpts[idx - 1]);
                else if (idx === -1) setTimer(180);
              }}
              disabled={!isHost || timer === 30}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              -
            </button>
            
            {/* LARGE STACKED VALUE */}
            <div className="flex flex-col items-center select-none">
              <span className="font-display text-3xl font-black text-white leading-none">
                {timer === -1 ? "∞" : timer}
              </span>
              <span className="text-[8.5px] text-white/50 uppercase tracking-widest font-black mt-0.5">
                {timer === -1 ? "INFINITE" : "SECONDS"}
              </span>
            </div>

            {/* Increment */}
            <button 
              onClick={() => {
                const timerOpts = [30, 45, 60, 90, 120, 180, -1];
                const idx = timerOpts.indexOf(timer);
                if (idx >= 0 && idx < timerOpts.length - 1) setTimer(timerOpts[idx + 1]);
                else if (idx === -1) setTimer(-1);
              }}
              disabled={!isHost || timer === -1}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[30, 60, 120, -1].map((preset) => (
              <button
                key={preset}
                onClick={() => setTimer(preset)}
                disabled={!isHost}
                className={cn(
                  "py-1 rounded-sm text-[9.5px] font-display font-bold uppercase tracking-wider transition-all border cursor-pointer",
                  timer === preset 
                    ? "bg-[#FF4655]/5 border-[#FF4655] text-white shadow-[0_0_10px_rgba(255,70,85,0.2)]" 
                    : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {preset === -1 ? "∞" : `${preset}s`}
              </button>
            ))}
          </div>
        </div>

        {/* SETTING 2: MAX NUMBER OF NOS */}
        <div className="flex flex-col text-left">
          {/* Icon & Title */}
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="h-4.5 w-4.5 text-violet mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-valorant text-[11px] tracking-wider text-white">MAX NUMBER OF NOS</span>
              <span className="text-[9.5px] font-sans text-white/60 uppercase tracking-wide">Number of &quot;No&quot; answers</span>
            </div>
          </div>
          
          {/* Value Adjuster - Floating */}
          <div className="flex items-center justify-between px-8 py-1 mb-2">
            {/* Decrement */}
            <button 
              onClick={() => {
                const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                const idx = nosOpts.indexOf(maxNos);
                if (idx > 0) setMaxNos(nosOpts[idx - 1]);
                else if (idx === -1) setMaxNos(10);
              }}
              disabled={!isHost || maxNos === 0}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              -
            </button>
            
            {/* LARGE STACKED VALUE */}
            <div className="flex flex-col items-center select-none">
              <span className="font-display text-3xl font-black text-white leading-none">
                {maxNos === -1 ? "∞" : maxNos}
              </span>
              <span className="text-[8.5px] text-white/50 uppercase tracking-widest font-black mt-0.5">
                {maxNos === -1 ? "INFINITE" : "NOS"}
              </span>
            </div>

            {/* Increment */}
            <button 
              onClick={() => {
                const nosOpts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1];
                const idx = nosOpts.indexOf(maxNos);
                if (idx >= 0 && idx < nosOpts.length - 1) setMaxNos(nosOpts[idx + 1]);
                else if (idx === -1) setMaxNos(-1);
              }}
              disabled={!isHost || maxNos === -1}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[3, 5, 10, -1].map((preset) => (
              <button
                key={preset}
                onClick={() => setMaxNos(preset)}
                disabled={!isHost}
                className={cn(
                  "py-1 rounded-sm text-[9.5px] font-display font-bold uppercase tracking-wider transition-all border cursor-pointer",
                  maxNos === preset 
                    ? "bg-violet/5 border-violet text-white shadow-[0_0_10px_rgba(140,123,255,0.2)]" 
                    : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {preset === -1 ? "∞" : preset}
              </button>
            ))}
          </div>
        </div>

        {/* SETTING 3: MAX GUESSES */}
        <div className="flex flex-col text-left">
          {/* Icon & Title */}
          <div className="flex items-start gap-2 mb-2">
            <Target className="h-4.5 w-4.5 text-accent mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-valorant text-[11px] tracking-wider text-white">MAX GUESSES</span>
              <span className="text-[9.5px] font-sans text-white/60 uppercase tracking-wide">Number of guesses per game</span>
            </div>
          </div>
          
          {/* Value Adjuster - Floating */}
          <div className="flex items-center justify-between px-8 py-1 mb-2">
            {/* Decrement */}
            <button 
              onClick={() => {
                const guessOpts = [1, 2, 3, 5, 10, -1];
                const idx = guessOpts.indexOf(maxGuesses);
                if (idx > 0) setMaxGuesses(guessOpts[idx - 1]);
                else if (idx === -1) setMaxGuesses(10);
              }}
              disabled={!isHost || maxGuesses === 1}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              -
            </button>
            
            {/* LARGE STACKED VALUE */}
            <div className="flex flex-col items-center select-none">
              <span className="font-display text-3xl font-black text-white leading-none">
                {maxGuesses === -1 ? "∞" : maxGuesses}
              </span>
              <span className="text-[8.5px] text-white/50 uppercase tracking-widest font-black mt-0.5">
                {maxGuesses === -1 ? "INFINITE" : "GUESSES"}
              </span>
            </div>

            {/* Increment */}
            <button 
              onClick={() => {
                const guessOpts = [1, 2, 3, 5, 10, -1];
                const idx = guessOpts.indexOf(maxGuesses);
                if (idx >= 0 && idx < guessOpts.length - 1) setMaxGuesses(guessOpts[idx + 1]);
                else if (idx === -1) setMaxGuesses(-1);
              }}
              disabled={!isHost || maxGuesses === -1}
              className="h-8 w-8 rounded-sm border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/50 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 3, 5, -1].map((preset) => (
              <button
                key={preset}
                onClick={() => setMaxGuesses(preset)}
                disabled={!isHost}
                className={cn(
                  "py-1 rounded-sm text-[9.5px] font-display font-bold uppercase tracking-wider transition-all border cursor-pointer",
                  maxGuesses === preset 
                    ? "bg-[#FF4655]/5 border-[#FF4655] text-white shadow-[0_0_10px_rgba(255,70,85,0.2)]" 
                    : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {preset === -1 ? "∞" : preset}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* MORE OPTIONS ACCORDION */}
      <div className="mt-3 border-t border-white/[0.05] pt-3 shrink-0">
        <button 
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="flex items-center justify-between w-full text-white/50 hover:text-white transition-colors py-0.5"
        >
          <div className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.18em]">
            <Compass className="h-4 w-4 text-white/50" />
            <span>MORE OPTIONS</span>
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
                <label className="flex items-center justify-between py-0.5 border-b border-white/[0.02] cursor-pointer hover:text-white transition-colors">
                  <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">Reveal Secret Agent Roles</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    disabled={!isHost}
                    className="accent-accent h-3.5 w-3.5 rounded border-white/10 bg-black cursor-pointer"
                  />
                </label>
                
                <label className="flex items-center justify-between py-0.5 border-b border-white/[0.02] cursor-pointer hover:text-white transition-colors">
                  <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">Allow Spec Match-Spectating</span>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    disabled={!isHost}
                    className="accent-accent h-3.5 w-3.5 rounded border-white/10 bg-black cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-0.5 hover:text-white transition-colors">
                  <span className="font-display uppercase tracking-wide text-[9.5px] text-white/70">Match Map Selection</span>
                  <Select defaultValue="Bind" disabled={!isHost}>
                    <SelectTrigger className="w-24 bg-black/80 border-white/10 text-[9px] font-display uppercase tracking-wider h-6 py-0.5 px-2 text-white">
                      <SelectValue placeholder="Map" />
                    </SelectTrigger>
                    <SelectContent className="bg-base-800 border-white/10 text-white">
                      <SelectItem value="Bind" className="text-xs">Bind</SelectItem>
                      <SelectItem value="Haven" className="text-xs">Haven</SelectItem>
                      <SelectItem value="Split" className="text-xs">Split</SelectItem>
                      <SelectItem value="Ascent" className="text-xs">Ascent</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
