"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
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
  Plus,
  LogIn,
  X,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Party } from "@/types/party";

interface PartyDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  party: Party | null;
  isHost: boolean;
  myId?: string;
  onLeaveParty: () => void;
  onCreateParty: () => void;
  onJoinParty: (partyId: string) => void;
  onKickPlayer?: (playerId: string) => void;
  isCreatingOrJoining?: boolean;
}

export function PartyDrawer({
  isOpen,
  onOpenChange,
  party,
  isHost,
  myId,
  onLeaveParty,
  onCreateParty,
  onJoinParty,
  onKickPlayer,
  isCreatingOrJoining = false,
}: PartyDrawerProps) {
  const [showPartyCode, setShowPartyCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const handleCopyCode = () => {
    if (!party?.id) return;
    navigator.clipboard.writeText(party.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || isCreatingOrJoining) return;
    onJoinParty(joinCodeInput.trim());
    setJoinCodeInput("");
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <DrawerContent className="bg-[#07090e]/98 border-r border-white/10 text-white backdrop-blur-2xl sm:max-w-md w-full sm:w-[440px] [--drawer-bleed-background:#07090e] flex flex-col h-full max-h-screen select-none">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-white/10 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
                <Hash className="h-3.5 w-3.5" />
              </div>
              <h2 className="font-valorant text-base tracking-[0.1em] text-white">
                PARTY
              </h2>
            </div>
            <p className="text-[10px] font-mono tracking-wider text-white/50 uppercase mt-1">
              Party &amp; Squad Settings
            </p>
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
          {party ? (
            /* =================== USER IS IN A PARTY =================== */
            <>
              {/* STREAM-SAFE PARTY CODE CARD */}
              <div className="clip-notch-both border border-white/10 bg-[#090d14]/90 p-4 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4655]" />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">
                      PARTY CODE (STREAM SAFE)
                    </span>
                  </div>

                  <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded-xs bg-white/5 text-white/40 border border-white/10">
                    {showPartyCode ? "REVEALED" : "PROTECTED"}
                  </span>
                </div>

                {/* Password-like code display */}
                <div className="flex items-center justify-between gap-3 bg-black/60 border border-white/10 rounded-sm p-3 my-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[8px] font-mono uppercase text-white/40 tracking-widest">
                      INVITE CODE
                    </span>
                    <div className="font-valorant text-lg tracking-[0.2em] text-white select-all truncate">
                      {showPartyCode ? (
                        <span className="text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]">
                          #{party.id}
                        </span>
                      ) : (
                        <span className="text-white/40 font-mono tracking-[0.3em] text-base">
                          ••••••••••••
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Unhide / Hide Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPartyCode(!showPartyCode)}
                      className={cn(
                        "p-2 rounded-xs border transition flex items-center gap-1 cursor-pointer text-xs font-display font-bold uppercase tracking-wider",
                        showPartyCode
                          ? "bg-[#FF4655]/20 border-[#FF4655]/50 text-white"
                          : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10"
                      )}
                      title={showPartyCode ? "Hide code from screen" : "Unhide code"}
                    >
                      {showPartyCode ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-accent" />
                          <span className="text-[9px] hidden sm:inline">HIDE</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-[9px] hidden sm:inline">REVEAL</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className={cn(
                        "p-2 rounded-xs border font-display text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer",
                        copied
                          ? "bg-mint/20 border-mint/50 text-mint"
                          : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10"
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

                <p className="text-[9px] text-white/40 font-sans leading-relaxed">
                  Code is hidden by default to prevent leaking while streaming. Click &apos;REVEAL&apos; to view or &apos;COPY&apos; to send directly.
                </p>
              </div>

              {/* PARTY MEMBERS LIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-mint" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/70">
                      SQUAD MEMBERS
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-mint font-bold bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-xs">
                    {party.members?.length || 1}/2 PLAYERS
                  </span>
                </div>

                <div className="space-y-2">
                  {party.members?.map((member) => {
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
                              {member.name} {isMe && <span className="text-white/40 font-normal text-xs">(YOU)</span>}
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
                  })}
                </div>
              </div>

              {/* LEAVE PARTY BUTTON */}
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

              {/* JOIN ANOTHER PARTY */}
              <div className="border-t border-white/10 pt-5 space-y-3">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/50 block">
                  OR JOIN ANOTHER SQUAD
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
            </>
          ) : (
            /* =================== USER IS NOT IN A PARTY =================== */
            <>
              {/* Standalone Status */}
              <div className="clip-notch-both border border-white/10 bg-[#090d14]/90 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-white/20" />
                <h3 className="font-valorant text-sm text-white tracking-wider mb-1">
                  STANDALONE LOBBY
                </h3>
                <p className="text-xs text-white/50 font-sans leading-relaxed">
                  You are not currently in a squad. Create a party to host 1v1 duels or enter a code to join an existing friend&apos;s lobby.
                </p>
              </div>

              {/* CREATE PARTY CTA */}
              <div className="space-y-2">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/50 block">
                  CREATE NEW SQUAD
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onCreateParty();
                    onOpenChange(false);
                  }}
                  disabled={isCreatingOrJoining}
                  className="w-full h-11 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-valorant text-xs tracking-[0.2em] uppercase rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.35)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span>CREATE SQUAD</span>
                </button>
              </div>

              {/* JOIN PARTY FORM */}
              <div className="border-t border-white/10 pt-5 space-y-3">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.2em] text-white/50 block">
                  JOIN VIA PARTY CODE
                </span>

                <form onSubmit={handleJoinSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="ENTER 6-DIGIT CODE #"
                    className="w-full h-10 bg-black/60 border border-white/15 px-3 rounded-sm font-display text-xs uppercase tracking-wider text-white placeholder-white/30 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    disabled={!joinCodeInput.trim() || isCreatingOrJoining}
                    className="w-full h-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display text-xs font-bold uppercase tracking-widest rounded-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>JOIN SQUAD</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
