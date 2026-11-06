"use client";

import { useState } from "react";
import {
  Swords,
  Play,
  LogOut,
  Hash,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
  Users,
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
  isStartingGame?: boolean;
  onLeaveParty: () => void;
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
  isCreatingOrJoining: boolean;
  handleCreateParty: () => void;
  handleJoinPartyWithCode: (code: string) => void;
  handleKickGuest?: () => void;
  myId?: string;
  userName?: string;
  showPartyCode: boolean;
  onToggleRevealCode: () => void;
  handleCopyCode: () => void;
  copied: boolean;
  onOpenInviteDialog?: () => void;
}

export function LobbyLeftPanel({
  questionMode,
  setQuestionMode,
  isHost,
  party,
  opponent,
  onStartGame,
  isStartingGame = false,
  onLeaveParty,
  timer,
  setTimer,
  maxNos,
  setMaxNos,
  maxGuesses,
  setMaxGuesses,
  questionCount,
  setQuestionCount,
  showMoreOptions = false,
  setShowMoreOptions,
  isCreatingOrJoining,
  handleCreateParty,
  handleJoinPartyWithCode,
  handleKickGuest,
  myId,
  userName,
  showPartyCode,
  onToggleRevealCode,
  handleCopyCode,
  copied,
  onOpenInviteDialog,
}: LobbyLeftPanelProps) {
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
  const [isGamemodeDrawerOpen, setIsGamemodeDrawerOpen] = useState(false);

  const hasOpponent = Boolean(opponent);
  const canStart = Boolean(party && isHost && hasOpponent);
  const isLaunching = Boolean(isStartingGame);

  const rulesSummary =
    questionMode === "FREEFORM"
      ? `Open Inquiries • ${maxNos === -1 ? "∞" : maxNos} NOs • ${maxGuesses === -1 ? "∞" : maxGuesses} Guess`
      : `${timer === -1 ? "∞" : `${timer}s`} • ${maxNos === -1 ? "∞" : maxNos} NOs • ${maxGuesses === -1 ? "∞" : maxGuesses} Guess`;

  return (
    <>
      <div className="w-full max-w-sm lg:w-72 shrink-0 flex flex-col gap-2.5 select-none">
        <div className="flex flex-col gap-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => !isLaunching && setIsGamemodeDrawerOpen(true)}
            onKeyDown={(e) => !isLaunching && e.key === "Enter" && setIsGamemodeDrawerOpen(true)}
            className={cn(
              "group relative flex flex-col p-3 rounded-sm border bg-[#080c14]/85 backdrop-blur-md transition-all text-left",
              isLaunching
                ? "opacity-50 cursor-not-allowed border-white/10"
                : "border-white/10 hover:border-white/25 hover:bg-[#0c121d]/90 cursor-pointer"
            )}
            title="Configure Game Mode & Rules"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
                  <Swords className="h-3.5 w-3.5" />
                </div>
                <span className="font-valorant text-sm tracking-wider text-white">
                  GUESS AGENT
                </span>
              </div>

              <div className="flex items-center gap-1 text-[9px] font-mono text-[#FF4655] font-bold bg-[#FF4655]/10 border border-[#FF4655]/30 px-2 py-0.5 rounded-xs">
                <span>{questionMode}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono pl-8">
              <span className="truncate">{rulesSummary}</span>
              <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => !isLaunching && setIsPartyDrawerOpen(true)}
            onKeyDown={(e) => !isLaunching && e.key === "Enter" && setIsPartyDrawerOpen(true)}
            className={cn(
              "group relative flex flex-col p-3 rounded-sm border bg-[#080c14]/85 backdrop-blur-md transition-all text-left",
              isLaunching
                ? "opacity-50 cursor-not-allowed border-white/10"
                : "border-white/10 hover:border-white/25 hover:bg-[#0c121d]/90 cursor-pointer"
            )}
            title="Manage Squad & Codes"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-xs bg-mint/15 border border-mint/40 flex items-center justify-center text-mint">
                  <Hash className="h-3.5 w-3.5" />
                </div>
                <span className="font-valorant text-sm tracking-wider text-white">
                  SQUAD
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-xs">
                {party?.members?.length || 1}/2 PLAYERS
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono pl-8">
              <span className="truncate">
                {party ? (party.members.length > 1 ? "Duel Squad Ready" : "Waiting for Challenger") : "Solo Lobby"}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <button
            type="button"
            onClick={party ? onStartGame : handleCreateParty}
            disabled={isLaunching || (party ? !canStart : isCreatingOrJoining)}
            className={cn(
              "w-full h-11 font-valorant text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 rounded-sm transition-all duration-200 border",
              isLaunching
                ? "bg-[#FF4655]/80 border-[#FF4655] cursor-wait animate-pulse"
                : canStart || !party
                  ? "bg-[#FF4655] hover:bg-[#ff5a67] border-[#FF4655] shadow-sm cursor-pointer active:scale-98"
                  : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {isLaunching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>LAUNCHING MATCH...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>
                  {!party
                    ? isCreatingOrJoining
                      ? "CREATING PARTY..."
                      : "CREATE PARTY"
                    : isHost
                      ? hasOpponent
                        ? "START MATCH"
                        : "WAITING FOR OPPONENT"
                      : "WAITING FOR LEADER"}
                </span>
              </>
            )}
          </button>

          {party !== null && (
            <button
              type="button"
              disabled={isLaunching}
              onClick={onLeaveParty}
              className={cn(
                "w-full py-1.5 rounded-sm tracking-widest uppercase text-white/70 text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-1.5 transition-all duration-300 border bg-white/[0.02] hover:bg-[#FF4655]/10 border-white/10 hover:border-[#FF4655]/40 hover:text-[#FF4655]",
                isLaunching ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-98"
              )}
            >
              <LogOut className="h-3 w-3" />
              <span>LEAVE PARTY</span>
            </button>
          )}
        </div>
      </div>

      <PartyDrawer
        isOpen={isPartyDrawerOpen}
        onOpenChange={setIsPartyDrawerOpen}
        party={party}
        isHost={isHost}
        myId={myId}
        userName={userName}
        onLeaveParty={onLeaveParty}
        onCreateParty={handleCreateParty}
        onJoinParty={handleJoinPartyWithCode}
        onKickPlayer={handleKickGuest}
        isCreatingOrJoining={isCreatingOrJoining}
        showPartyCode={showPartyCode}
        onToggleRevealCode={onToggleRevealCode}
        handleCopyCode={handleCopyCode}
        copied={copied}
        onOpenInviteDialog={onOpenInviteDialog}
      />

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
