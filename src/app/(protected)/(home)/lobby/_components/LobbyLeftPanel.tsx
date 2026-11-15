"use client";

import { useState } from "react";
import {
  Play,
  LogOut,
  SlidersHorizontal,
  Loader2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Party } from "@/types/party";
import { GamemodeDrawer } from "./GamemodeDrawer";
import { PartyDrawer } from "./PartyDrawer";

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
  myId?: string;
  userName?: string;
  handleCreateParty: () => void;
  handleJoinPartyWithCode: (code: string) => void;
  handleKickGuest?: (playerId?: string) => void;
  isCreatingOrJoining?: boolean;
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
  myId,
  userName = "AGENT",
  handleCreateParty,
  handleJoinPartyWithCode,
  handleKickGuest,
  isCreatingOrJoining = false,
  showPartyCode,
  onToggleRevealCode,
  handleCopyCode,
  copied,
  onOpenInviteDialog,
}: LobbyLeftPanelProps) {
  const [isGamemodeDrawerOpen, setIsGamemodeDrawerOpen] = useState(false);
  const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);

  const hasOpponent = Boolean(opponent);
  const canStart = Boolean(isHost && hasOpponent);
  const isLaunching = Boolean(isStartingGame);
  const memberCount = party?.members?.length || 1;

  return (
    <>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2.5 select-none">
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsGamemodeDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-white/10 bg-[#07090e]/80 hover:bg-white/[0.06] hover:border-white/20 text-white/80 hover:text-white transition cursor-pointer backdrop-blur-md"
            title="Configure match mode & rules"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-white/40" />
            <span className="font-valorant tracking-wider text-xs text-white">
              {questionMode === "FREEFORM" ? "FREEFORM" : "PRESET"}
            </span>
            <span className="text-white/25">•</span>
            <span className="text-white/50 font-sans text-xs">
              {questionMode === "FREEFORM"
                ? `${maxNos === -1 ? "Unlimited" : maxNos} No's`
                : `${timer === -1 ? "No timer" : `${timer}s`}`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsPartyDrawerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-white/10 bg-[#07090e]/80 hover:bg-white/[0.06] hover:border-white/20 text-white/80 hover:text-white transition cursor-pointer backdrop-blur-md"
            title="Open party management & settings"
          >
            <Users className="h-3.5 w-3.5 text-mint" />
            <span className="font-valorant tracking-wider text-xs text-white">
              PARTY
            </span>
            <span className="text-white/25">•</span>
            <span className="text-mint font-sans text-xs font-medium">
              {memberCount}/2
            </span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2.5 w-full max-w-sm">
          <button
            type="button"
            onClick={onStartGame}
            disabled={isLaunching || !canStart}
            className={cn(
              "flex-1 h-12 font-valorant text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2.5 rounded-sm transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4655]/80",
              isLaunching
                ? "bg-[#FF4655]/80 border-[#FF4655] cursor-wait animate-pulse"
                : canStart
                  ? "bg-[#FF4655] hover:bg-[#ff5a67] border-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.35)] hover:shadow-[0_0_30px_rgba(255,70,85,0.55)] cursor-pointer active:scale-98"
                  : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {isLaunching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>STARTING MATCH...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>
                  {hasOpponent
                    ? isHost
                      ? "START MATCH"
                      : "WAITING FOR HOST"
                    : "WAITING FOR OPPONENT"}
                </span>
              </>
            )}
          </button>

          {party !== null && (
            <button
              type="button"
              disabled={isLaunching}
              onClick={onLeaveParty}
              className="h-12 px-3.5 rounded-sm border border-white/10 bg-[#07090e]/80 hover:bg-[#FF4655]/10 hover:border-[#FF4655]/40 text-white/50 hover:text-[#FF4655] transition flex items-center justify-center cursor-pointer active:scale-98"
              title="Leave Party"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
    </>
  );
}