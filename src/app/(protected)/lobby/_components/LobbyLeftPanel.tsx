"use client";

import { motion } from "framer-motion";
import { Swords, Sliders, Play, LogOut, Users, Sparkles, HelpCircle, MessageSquare, Hash, Plus, PlayOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Party } from "@/types/party";

interface LobbyLeftPanelProps {
  questionMode: "PRESET" | "FREEFORM";
  setQuestionMode: (mode: "PRESET" | "FREEFORM") => void;
  isHost: boolean;
  party: Party | null;
  opponent: any;
  onStartGame: () => void;
  onOpenSettings: () => void;
  onLeaveParty: () => void;
  timer: number;
  maxNos: number;
  maxGuesses: number;
  isCreatingOrJoining: boolean;
  handleCreateParty: () => void;
}

export function LobbyLeftPanel({
  questionMode,
  setQuestionMode,
  isHost,
  party,
  opponent,
  onStartGame,
  onOpenSettings,
  onLeaveParty,
  timer,
  maxNos,
  maxGuesses,
  isCreatingOrJoining,
  handleCreateParty,
}: LobbyLeftPanelProps) {
  const hasOpponent = Boolean(opponent);
  const canStart = Boolean(party && isHost && hasOpponent);

  return (
    <div className="w-full shrink-0 flex flex-col gap-2 select-none">
      {/* Top Section: Mode Card & Submode Selector */}
      <div className="flex flex-col gap-2">
        {/* Main Mode Banner */}
        <div className="clip-notch-both border border-white/10 bg-[#090d14]/85 backdrop-blur-xl p-3 shadow-[0_4px_25px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655]" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.25)]">
                <Swords className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655]">
                  MODE
                </span>
                <span className="font-valorant text-base tracking-[0.06em] text-white">
                  GUESS AGENT
                </span>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-sm border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white transition cursor-pointer"
              title="Game Settings"
            >
              <Sliders className="h-3 w-3 text-accent" />
            </button>
          </div>

          {/* <p className="text-[9.5px] text-white/50 leading-relaxed font-sans">
            Tactical 1v1 elimination duel. Deduce your opponent&apos;s secret Valorant agent before they classify yours.
          </p> */}
        </div>

        {/* Submode Selection (Preset vs Freeform) */}
        {/* <div className="border border-white/10 bg-[#070a12]/80 backdrop-blur-md rounded-sm p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/50">
              QUESTION SUBMODE
            </span>
            <span className="text-[8.5px] font-display font-bold uppercase text-accent tracking-wider">
              {questionMode === "PRESET" ? "CARDS POOL" : "OPEN QUESTIONS"}
            </span>
          </div>

          Submode Toggle Buttons
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-sm border border-white/5">
            <button
              type="button"
              onClick={() => isHost && setQuestionMode("PRESET")}
              disabled={!isHost}
              className={cn(
                "py-1.5 px-2 rounded-xs font-display text-[9.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                questionMode === "PRESET"
                  ? "bg-[#FF4655] text-white shadow-[0_0_12px_rgba(255,70,85,0.4)]"
                  : "text-white/50 hover:text-white hover:bg-white/5",
                !isHost && "cursor-default"
              )}
            >
              <HelpCircle className="h-3 w-3" />
              <span>PRESET</span>
            </button>

            <button
              type="button"
              onClick={() => isHost && setQuestionMode("FREEFORM")}
              disabled={!isHost}
              className={cn(
                "py-1.5 px-2 rounded-xs font-display text-[9.5px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                questionMode === "FREEFORM"
                  ? "bg-[#FF4655] text-white shadow-[0_0_12px_rgba(255,70,85,0.4)]"
                  : "text-white/50 hover:text-white hover:bg-white/5",
                !isHost && "cursor-default"
              )}
            >
              <MessageSquare className="h-3 w-3" />
              <span>FREEFORM</span>
            </button>
          </div>

          <div className="text-[9px] text-white/45 font-sans px-0.5">
            {questionMode === "PRESET" ? (
              <span>Take turns selecting from tactical question cards pool.</span>
            ) : (
              <span>Ask custom questions freely in chat or voice. End turns manually.</span>
            )}
          </div>
        </div> */}

        {/* Rules Summary Badge */}
        {/* <div className="border border-white/5 bg-white/[0.02] rounded-sm p-1.5 px-2.5 flex items-center justify-between text-[9.5px] font-mono text-white/60">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">TIMER:</span>
            <span className="text-white font-bold">{timer === -1 ? "∞" : `${timer}s`}</span>
          </div>
          <div className="h-2.5 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">NOs:</span>
            <span className="text-white font-bold">{maxNos === -1 ? "∞" : maxNos}</span>
          </div>
          <div className="h-2.5 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">GUESS:</span>
            <span className="text-white font-bold">{maxGuesses}</span>
          </div>
        </div> */}
      </div>

      
      <div className="clip-notch-both border border-white/10 bg-[#090d14]/85 backdrop-blur-xl p-3 shadow-[0_4px_25px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655]" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.25)]">
              <Hash className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8.5px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655]">
                PARTY
              </span>
              <span className="font-valorant text-base tracking-[0.06em] text-white">
                {party ? `#${party.id}` : "STANDALONE"}
              </span>
            </div>
          </div>

          {party ? (
            <span className="text-[9px] font-mono font-bold text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-xs">
              {party.members?.length || 1}/2 PLAYERS
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCreateParty}
              disabled={isCreatingOrJoining}
              className="px-2.5 py-1 rounded-xs bg-[#FF4655]/10 hover:bg-[#FF4655]/20 border border-[#FF4655]/30 text-[#FF4655] hover:text-white font-display text-[9.5px] font-bold uppercase tracking-wider transition cursor-pointer"
            >
              CREATE
            </button>
          )}
        </div>
      </div>

      {/* Action CTA: START MATCH & Leave Party */}
      <div className="flex flex-col gap-1.5 mt-1">
        <button
          onClick={onStartGame}
          disabled={!canStart}
          className={cn(
            "w-full h-11 font-valorant text-sm tracking-[0.2em] uppercase text-white flex items-center justify-center gap-2 transition-all duration-300 relative clip-notch-both border",
            canStart
              ? "bg-[#FF4655] hover:bg-[#ff5a67] border-[#FF4655] shadow-[0_0_30px_rgba(255,70,85,0.45)] cursor-pointer active:scale-98"
              : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-60"
          )}
        >
          {
            party ?
            <Play className={cn("h-3.5 w-3.5", canStart && "fill-white")} />
            : <PlayOff className={cn("h-3.5 w-3.5", !canStart && "fill-white/30")} />
          }
          <span>
            
          {
            party ? 
              isHost
                ? hasOpponent
                  ? "START MATCH"
                  : "WAITING FOR PLAYER"
                : "WAITING FOR LEADER"
              : "NOT IN PARTY"
          }
          </span>
        </button>

        <button
          onClick={onLeaveParty}
          disabled={party === null}
          // className="w-full py-1.5 rounded-sm border border-white/10 bg-white/[0.02] hover:bg-[#FF4655]/10 hover:border-[#FF4655]/40 text-white/50 hover:text-[#FF4655] font-display text-sm font-bold uppercase tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer"
          className={cn(
            "w-full py-1.5 rounded-sm tracking-widest uppercase text-white/70 text-sm font-display flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border",
            party !== null
              ? "bg-white/2 hover:bg-[#FF4655]/10 border-white/10 hover:border-[#FF4655]/40 hover:text-[#FF4655]  cursor-pointer active:scale-98"
              : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-60"
          )}
        >
          <LogOut className="h-3 w-3" />
          <span>LEAVE PARTY</span>
        </button>
      </div>
    </div>
  );
}
