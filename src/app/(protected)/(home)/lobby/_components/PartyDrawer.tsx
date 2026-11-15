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

  const members = party?.members ?? [];
  const hasMembers = members.length > 0;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} swipeDirection="left">
      <DrawerContent className="bg-[#07090e]/98 border-r border-white/10 text-white backdrop-blur-2xl sm:max-w-md w-full sm:w-[440px] [--drawer-bleed-background:#07090e] flex flex-col h-full max-h-screen select-none">
        <div className="h-1 w-full bg-[#FF4655] shrink-0" />

        <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xs bg-[#FF4655]/15 border border-[#FF4655]/40 flex items-center justify-center text-[#FF4655]">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-valorant text-base tracking-[0.1em] text-white">
                PARTY
              </h2>
              <p className="text-xs text-white/40 font-sans">
                Invite friends or join with a code
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
          <div className="border border-white/10 bg-[#090d14]/90 p-4 rounded-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#FF4655]" />
                <span className="text-xs font-sans font-medium text-white/70">
                  Party Code
                </span>
              </div>
              <span className="text-xs font-sans text-white/40">
                Hidden by default
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-black/60 border border-white/10 rounded-sm py-2 px-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-sans text-white/40">
                  Code
                </span>
                <div className="font-valorant text-base tracking-[0.15em] text-white truncate flex items-center gap-2">
                  {showPartyCode && party?.id ? (
                    <span className="text-[#FF4655]">
                      #{party.id}
                    </span>
                  ) : isCreatingOrJoining && !party?.id ? (
                    <span className="flex items-center gap-1.5 text-[#FF4655] text-xs font-mono tracking-wider">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      CREATING...
                    </span>
                  ) : (
                    <span className="text-white/40 font-mono tracking-[0.25em] text-sm">
                      ••••••••••••
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={onToggleRevealCode}
                  disabled={isCreatingOrJoining}
                  className={cn(
                    "p-2 rounded-xs border transition flex items-center gap-1 cursor-pointer text-xs font-sans",
                    showPartyCode
                      ? "bg-[#FF4655]/20 border-[#FF4655]/50 text-white"
                      : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10",
                    isCreatingOrJoining && "opacity-50 cursor-not-allowed"
                  )}
                  title={showPartyCode ? "Hide code" : "Reveal code"}
                >
                  {showPartyCode ? (
                    <EyeOff className="h-3.5 w-3.5 text-[#FF4655]" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  disabled={isCreatingOrJoining}
                  className={cn(
                    "p-2 rounded-xs border font-sans text-xs transition flex items-center gap-1 cursor-pointer",
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
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#FF4655]" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-mint" />
                <span className="text-xs font-sans font-medium text-white/70">
                  Players
                </span>
              </div>
              <span className="text-xs font-sans text-mint font-medium bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-xs">
                {members.length || 1}/2 Players
              </span>
            </div>

            <div className="space-y-2">
              {hasMembers ? (
                members.map((member) => {
                  const isLeader = member.id === party?.leaderId;
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
                          <span className="font-sans font-medium text-sm text-white">
                            {member.name}{" "}
                            {isMe && <span className="text-white/40 font-normal text-xs">(You)</span>}
                          </span>
                          <span className="text-xs font-sans text-white/40">
                            {isLeader ? "Party Leader" : "Member"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isLeader && (
                          <span className="text-xs font-sans px-2 py-0.5 bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] rounded-xs font-semibold">
                            HOST
                          </span>
                        )}

                        {isHost && !isMe && onKickPlayer && (
                          <button
                            type="button"
                            onClick={() => onKickPlayer(member.id)}
                            className="p-1.5 rounded-xs border border-white/10 bg-white/5 hover:bg-[#FF4655]/20 hover:border-[#FF4655]/40 text-white/50 hover:text-[#FF4655] transition cursor-pointer"
                            title="Kick player"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 flex items-center justify-center font-valorant text-xs text-white">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-sm text-white">
                        {userName} <span className="text-white/40 font-normal text-xs">(You)</span>
                      </span>
                      <span className="text-xs font-sans text-white/40">
                        Party Leader
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-sans px-2 py-0.5 bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] rounded-xs font-semibold">
                    HOST
                  </span>
                </div>
              )}

              {members.length < 2 && (
                <div
                  onClick={() => {
                    if (onOpenInviteDialog) {
                      onOpenChange(false);
                      onOpenInviteDialog();
                    }
                  }}
                  className="flex items-center justify-between p-3 bg-black/20 border border-dashed border-white/15 hover:border-white/30 rounded-sm transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full border border-dashed border-white/20 group-hover:border-[#FF4655]/60 flex items-center justify-center text-white/30 group-hover:text-[#FF4655] transition">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-medium text-sm text-white/70 group-hover:text-white transition">
                        Open Slot
                      </span>
                      <span className="text-xs font-sans text-white/30">
                        Waiting for player...
                      </span>
                    </div>
                  </div>

                  {onOpenInviteDialog && (
                    <span className="text-xs font-sans font-semibold px-2.5 py-1 bg-white/5 group-hover:bg-[#FF4655] text-white/70 group-hover:text-white rounded-xs transition">
                      Invite
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {party && (
            <button
              type="button"
              onClick={() => {
                onLeaveParty();
                onOpenChange(false);
              }}
              className="w-full py-2.5 rounded-sm border border-white/15 bg-white/[0.02] hover:bg-[#FF4655]/15 hover:border-[#FF4655]/60 text-white/60 hover:text-[#FF4655] font-valorant text-xs tracking-widest uppercase transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>LEAVE PARTY</span>
            </button>
          )}

          <div className="border-t border-white/10 pt-5 space-y-3">
            <span className="text-xs font-sans font-semibold text-white/70 block">
              Join with Party Code
            </span>

            <form onSubmit={handleJoinSubmit} className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="Enter party code..."
                className="flex-1 h-9 bg-black/60 border border-white/15 px-3 rounded-sm font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF4655]"
              />
              <button
                type="submit"
                disabled={!joinCodeInput.trim() || isCreatingOrJoining}
                className="px-4 h-9 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-valorant text-xs uppercase tracking-wider rounded-sm transition cursor-pointer disabled:opacity-40"
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
