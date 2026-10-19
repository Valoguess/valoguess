"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import {
  Hash,
  Eye,
  EyeOff,
  Copy,
  Check,
  Users,
  UserX,
  LogOut,
  LogIn,
  X,
  Shield,
  Loader2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Party } from "@/types/party";

interface PartyDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  party: Party | null;
  isHost: boolean;
  myId?: string;
  userName?: string;
  onLeaveParty: () => void;
  onCreateParty: () => void;
  onJoinParty: (partyId: string) => void;
  onKickPlayer?: (playerId: string) => void;
  isCreatingOrJoining?: boolean;
  showPartyCode: boolean;
  onToggleRevealCode: () => void;
  handleCopyCode: () => void;
  copied: boolean;
  onOpenInviteDialog?: () => void;
}

export function PartyDrawer({
  isOpen,
  onOpenChange,
  party,
  isHost,
  myId,
  userName = "AGENT",
  onLeaveParty,
  onCreateParty,
  onJoinParty,
  onKickPlayer,
  isCreatingOrJoining = false,
  showPartyCode,
  onToggleRevealCode,
  handleCopyCode,
  copied,
  onOpenInviteDialog,
}: PartyDrawerProps) {
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || isCreatingOrJoining) return;
    onJoinParty(joinCodeInput.trim());
    setJoinCodeInput("");
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <DrawerContent className="bg-[#07090e]/98 border-r border-white/10 text-white backdrop-blur-2xl sm:max-w-md w-full sm:w-[440px] [--drawer-bleed-background:#07090e] flex flex-col h-full max-h-screen select-none">
        {/* Top Valorant Accent Line */}
        <div className="h-1 w-full bg-[#FF4655] shrink-0" />

        {/* Header */}
        <div className="p-5 pb-3 border-b border-white/10 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655] shadow-[0_0_10px_rgba(255,70,85,0.25)]">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-valorant text-base tracking-[0.1em] text-white">
                PARTY
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                SQUAD MANAGEMENT & CODES
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {/* STREAM-SAFE PARTY CODE CARD */}
          <div className="clip-notch-both border border-white/10 bg-[#090d14]/90 p-4 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655]" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/60">
                  PARTY CODE
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                STREAM SAFE
              </span>
            </div>

            {/* Password-like code display */}
            <div className="flex items-center justify-between gap-3 bg-black/60 border border-white/10 rounded-sm py-2 px-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-mono uppercase text-white/40 tracking-widest">
                  INVITE CODE
                </span>
                <div className="font-valorant text-lg tracking-[0.2em] text-white select-all truncate flex items-center gap-2">
                  {showPartyCode && party?.id ? (
                    <span className="text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]">
                      #{party.id}
                    </span>
                  ) : isCreatingOrJoining && !party?.id ? (
                    <span className="flex items-center gap-1.5 text-accent text-xs font-mono tracking-wider">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      CREATING...
                    </span>
                  ) : (
                    <span className="text-white/40 font-mono tracking-[0.3em] text-base">
                      ••••••••••••
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Reveal / Hide Toggle Button (Creates party lazily on click if needed) */}
                <button
                  type="button"
                  onClick={onToggleRevealCode}
                  disabled={isCreatingOrJoining}
                  className={cn(
                    "p-2 rounded-xs border transition flex items-center gap-1 cursor-pointer text-xs font-display font-bold uppercase tracking-wider",
                    showPartyCode
                      ? "bg-[#FF4655]/20 border-[#FF4655]/50 text-white"
                      : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10",
                    isCreatingOrJoining && "opacity-50 cursor-not-allowed"
                  )}
                  title={showPartyCode ? "Hide code from screen" : "Unhide / Reveal code"}
                >
                  {showPartyCode ? (
                    <EyeOff className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Copy Button (Creates party lazily on click if needed) */}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  disabled={isCreatingOrJoining}
                  className={cn(
                    "p-2 rounded-xs border font-display text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer",
                    copied
                      ? "bg-mint/20 border-mint/50 text-mint"
                      : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10",
                    isCreatingOrJoining && "opacity-50 cursor-not-allowed"
                  )}
                  title="Copy Party Code"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-mint" />
                      <span className="text-[9px]">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-accent" />
                      <span className="text-[9px]">COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SQUAD MEMBERS LIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-mint" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/70">
                  SQUAD MEMBERS
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-mint font-bold bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-xs">
                {party?.members?.length || 1}/2 PLAYERS
              </span>
            </div>

            <div className="space-y-2">
              {party?.members && party.members.length > 0 ? (
                party.members.map((member) => {
                  const isLeader = member.id === party.leaderId;
                  const isMe = member.id === myId;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-base-800 border border-white/15 flex items-center justify-center font-valorant text-xs text-white">
                          {member.name?.slice(0, 2).toUpperCase() || "AG"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-sm text-white tracking-wide">
                            {member.name}{" "}
                            {isMe && <span className="text-white/40 font-normal text-xs">(YOU)</span>}
                          </span>
                          <span className="text-[9px] font-mono text-white/40 uppercase">
                            {isLeader ? "PARTY LEADER" : "SQUAD MEMBER"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLeader && (
                          <span className="text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 bg-accent/15 border border-accent/40 text-accent rounded-xs font-bold">
                            LEADER
                          </span>
                        )}

                        {isHost && !isMe && onKickPlayer && (
                          <button
                            type="button"
                            onClick={() => onKickPlayer(member.id)}
                            className="p-1.5 rounded-xs border border-white/10 bg-white/5 hover:bg-accent/20 hover:border-accent/40 text-white/50 hover:text-accent transition cursor-pointer"
                            title="Kick member"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* SOLO / LOBBY STATE (NOT YET ON SERVER) */
                <>
                  {/* YOU */}
                  <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 flex items-center justify-center font-valorant text-xs text-white">
                        {userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-sm text-white tracking-wide">
                          {userName} <span className="text-white/40 font-normal text-xs">(YOU)</span>
                        </span>
                        <span className="text-[9px] font-mono text-white/40 uppercase">
                          PARTY LEADER
                        </span>
                      </div>
                    </div>

                    <span className="text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 bg-accent/15 border border-accent/40 text-accent rounded-xs font-bold">
                      LEADER
                    </span>
                  </div>

                  {/* OPEN SLOT */}
                  <div
                    onClick={() => {
                      if (onOpenInviteDialog) {
                        onOpenChange(false);
                        onOpenInviteDialog();
                      }
                    }}
                    className="flex items-center justify-between p-3 bg-black/20 border border-dashed border-white/15 hover:border-accent/50 rounded-sm transition cursor-pointer group"
                    title="Invite an online friend"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border border-dashed border-white/20 group-hover:border-accent/60 flex items-center justify-center text-white/30 group-hover:text-accent transition">
                        <UserPlus className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-sm text-white/60 group-hover:text-white tracking-wide transition">
                          OPEN SLOT
                        </span>
                        <span className="text-[9px] font-mono text-white/30 uppercase">
                          WAITING FOR DUELIST
                        </span>
                      </div>
                    </div>

                    {onOpenInviteDialog && (
                      <span className="text-[9px] font-display font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 group-hover:bg-[#FF4655] text-white/70 group-hover:text-white rounded-xs transition">
                        INVITE
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* LEAVE PARTY (WHEN ACTUALLY IN A BACKEND PARTY) */}
          {party && (
            <div>
              <button
                type="button"
                onClick={() => {
                  onLeaveParty();
                  onOpenChange(false);
                }}
                className="w-full py-2.5 rounded-sm border border-white/15 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/60 text-white/60 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>LEAVE CURRENT PARTY</span>
              </button>
            </div>
          )}

          {/* JOIN ANOTHER PARTY */}
          <div className="border-t border-white/10 pt-5 space-y-3">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/50 block">
              JOIN VIA PARTY CODE
            </span>

            <form onSubmit={handleJoinSubmit} className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="ENTER PARTY CODE #"
                className="flex-1 h-9 bg-black/60 border border-white/15 px-3 rounded-sm font-display text-xs uppercase tracking-wider text-white placeholder-white/30 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!joinCodeInput.trim() || isCreatingOrJoining}
                className="px-4 h-9 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer disabled:opacity-40"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
