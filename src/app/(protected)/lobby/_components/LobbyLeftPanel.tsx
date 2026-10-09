"use client";

import { useState } from "react";
import {
  Swords,
  Play,
  LogOut,
  Hash,
  PlayOff,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Party } from "@/types/party";
import { PartyDrawer } from "./PartyDrawer";
import { GamemodeDrawer } from "./GamemodeDrawer";

interface LobbyLeftPanelProps {
  questionMode: "PRESET" | "FREEFORM";
  setQuestionMode: (mode: "PRESET" | "FREEFORM") => void;
  isHost: boolean;
  party: Party | null;
  opponent: any;
  onStartGame: () => void;
  onOpenSettings?: () => void;
  onLeaveParty: () => void;
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
  isCreatingOrJoining: boolean;
  handleCreateParty: () => void;
  handleJoinPartyWithCode: (code: string) => void;
  handleKickGuest?: () => void;
  myId?: string;
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
  setTimer,
  maxNos,
  setMaxNos,
  maxGuesses,
  setMaxGuesses,
  questionCount,
  setQuestionCount,
  showMoreOptions,
  setShowMoreOptions,
  isCreatingOrJoining,
  handleCreateParty,
  handleJoinPartyWithCode,
  handleKickGuest,
  myId,
}: LobbyLeftPanelProps) {
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
  const [isGamemodeDrawerOpen, setIsGamemodeDrawerOpen] = useState(false);

  const hasOpponent = Boolean(opponent);
  const canStart = Boolean(party && isHost && hasOpponent);

  return (
    <>
      <div className="w-full shrink-0 flex flex-col gap-2 select-none">
        {/* TOP SECTION: GAMEMODE CARD (CLICK TO OPEN DRAWER) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsGamemodeDrawerOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setIsGamemodeDrawerOpen(true)}
          className="clip-notch-both border border-white/10 hover:border-white/25 bg-[#090d14]/85 hover:bg-[#0c121d]/90 backdrop-blur-xl p-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] relative overflow-hidden cursor-pointer transition-all group flex items-center justify-between"
          title="Click to open Game Mode drawer"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655] group-hover:w-1.5 transition-all" />

          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.25)] group-hover:scale-105 transition-transform">
              <Swords className="h-3.5 w-3.5" />
            </div>
            <span className="font-valorant text-base tracking-[0.08em] text-white">
              GUESS AGENT
            </span>
          </div>

          {/* Drawer open indicator */}
          <div className="flex items-center gap-1.5 text-white/35 group-hover:text-accent transition-colors">
            <div className="h-6 w-6 rounded-xs bg-white/[0.03] border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 flex items-center justify-center transition-all">
              <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: PARTY CARD (CLICK TO OPEN DRAWER) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsPartyDrawerOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setIsPartyDrawerOpen(true)}
          className="clip-notch-both border border-white/10 hover:border-white/25 bg-[#090d14]/85 hover:bg-[#0c121d]/90 backdrop-blur-xl p-3.5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] relative overflow-hidden cursor-pointer transition-all group flex items-center justify-between"
          title="Click to open Party drawer"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655] group-hover:w-1.5 transition-all" />

          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-sm bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.25)] group-hover:scale-105 transition-transform">
              <Hash className="h-3.5 w-3.5" />
            </div>
            <span className="font-valorant text-base tracking-[0.08em] text-white">
              PARTY
            </span>
          </div>

          {/* Drawer open indicator + player count */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-mint bg-mint/10 border border-mint/20 px-2.5 py-0.5 rounded-xs">
              {party?.members?.length || 1}/2
            </span>
            <div className="h-6 w-6 rounded-xs bg-white/[0.03] border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/10 flex items-center justify-center text-white/35 group-hover:text-accent transition-all">
              <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* ACTION CTA: START MATCH & LEAVE PARTY */}
        <div className="flex flex-col gap-1.5 mt-1">
          <button
            type="button"
            onClick={onStartGame}
            disabled={!canStart}
            className={cn(
              "w-full h-11 font-valorant text-sm tracking-[0.2em] uppercase text-white flex items-center justify-center gap-2 transition-all duration-300 relative clip-notch-both border",
              canStart
                ? "bg-[#FF4655] hover:bg-[#ff5a67] border-[#FF4655] shadow-[0_0_30px_rgba(255,70,85,0.45)] cursor-pointer active:scale-98"
                : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-60"
            )}
          >
            {party ? (
              <Play className={cn("h-3.5 w-3.5", canStart && "fill-white")} />
            ) : (
              <PlayOff className={cn("h-3.5 w-3.5", !canStart && "fill-white/30")} />
            )}
            <span>
              {party
                ? isHost
                  ? hasOpponent
                    ? "START MATCH"
                    : "WAITING FOR PLAYER"
                  : "WAITING FOR LEADER"
                : "NOT IN PARTY"}
            </span>
          </button>

          <button
            type="button"
            onClick={onLeaveParty}
            disabled={party === null}
            className={cn(
              "w-full py-1.5 rounded-sm tracking-widest uppercase text-white/70 text-sm font-display flex items-center justify-center gap-1.5 transition-all duration-300 border",
              party !== null
                ? "bg-white/2 hover:bg-[#FF4655]/10 border-white/10 hover:border-[#FF4655]/40 hover:text-[#FF4655] cursor-pointer active:scale-98"
                : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-60"
            )}
          >
            <LogOut className="h-3 w-3" />
            <span>LEAVE PARTY</span>
          </button>
        </div>
      </div>

      {/* PARTY DRAWER (SLIDES IN FROM LEFT) */}
      <PartyDrawer
        isOpen={isPartyDrawerOpen}
        onOpenChange={setIsPartyDrawerOpen}
        party={party}
        isHost={isHost}
        myId={myId}
        onLeaveParty={onLeaveParty}
        onCreateParty={handleCreateParty}
        onJoinParty={handleJoinPartyWithCode}
        onKickPlayer={handleKickGuest}
        isCreatingOrJoining={isCreatingOrJoining}
      />

      {/* GAMEMODE & SETTINGS DRAWER (SLIDES IN FROM LEFT) */}
      <GamemodeDrawer
        isOpen={isGamemodeDrawerOpen}
        onOpenChange={setIsGamemodeDrawerOpen}
        isHost={isHost}
        questionMode={questionMode}
        setQuestionMode={setQuestionMode}
        timer={timer}
        setTimer={setTimer}
        maxNos={maxNos}
        setMaxNos={setMaxNos}
        maxGuesses={maxGuesses}
        setMaxGuesses={setMaxGuesses}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        showMoreOptions={showMoreOptions}
        setShowMoreOptions={setShowMoreOptions}
      />
    </>
  );
}
