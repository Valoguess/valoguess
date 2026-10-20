"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Circle,
  ChevronDown,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "./types";
import { DEFAULT_AVATARS } from "@/consts";

interface InviteFriendsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friendsList: Friend[];
  onInviteFriend: (friend: Friend) => void;
}

export function InviteFriendsDialog({
  isOpen,
  onOpenChange,
  friendsList,
  onInviteFriend,
}: InviteFriendsDialogProps) {
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(true);

  const onlineFriends = friendsList.filter(
    (f) => f.status === "online" || f.status === "ingame"
  );
  const offlineFriends = friendsList.filter(
    (f) => f.status === "offline"
  );

  const handleInvite = (friend: Friend) => {
    onInviteFriend(friend);
    setInvitedIds((prev) => new Set(prev).add(friend.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#070a12]/98 border border-white/10 text-white backdrop-blur-2xl sm:max-w-xs w-full shadow-[0_10px_50px_rgba(0,0,0,0.8)] p-0 overflow-hidden select-none clip-notch-both"
      >
        <DialogTitle className="sr-only">
          FRIENDS ({friendsList.length})
        </DialogTitle>

        {/* 1. TOP HEADER BAR: FRIENDS (NUMBER) + CLOSE BUTTON */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white">
            <Users className="h-4 w-4 text-accent shrink-0" />
            <span>FRIENDS ({friendsList.length})</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 2. BODY: ONLINE & OFFLINE SECTIONS */}
        <div className="h-[520px] overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
          {friendsList.length === 0 ? (
            <div className="p-4 text-center rounded bg-white/2 border border-white/5 space-y-1.5 my-2">
              <Users className="h-6 w-6 text-white/20 mx-auto mb-1" />
              <div className="text-[10.5px] font-display font-bold text-white/70 uppercase tracking-wider">
                NO FRIENDS YET
              </div>
            </div>
          ) : (
            <>
              {/* Online Section */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowOnline(!showOnline)}
                  className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/60 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-mint">
                    <Circle className="h-2 w-2 fill-mint" /> ONLINE ({onlineFriends.length})
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      !showOnline && "-rotate-90"
                    )}
                  />
                </button>

                {showOnline && (
                  <div className="space-y-1.5">
                    {onlineFriends.length === 0 ? (
                      <div className="p-2.5 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                        No friends currently online
                      </div>
                    ) : (
                      onlineFriends.map((friend) => {
                        const isInvited = invitedIds.has(friend.id);

                        return (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-2 rounded bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <Image
                                  src={friend.avatar || DEFAULT_AVATARS.USER}
                                  alt={friend.name}
                                  fill
                                  className="object-cover object-top"
                                />
                                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black bg-mint shadow-[0_0_6px_#3cf2c4]" />
                              </div>

                              <div className="flex flex-col text-left min-w-0">
                                <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[130px]">
                                  {friend.name}
                                </span>
                                <span className="text-[8px] uppercase font-semibold tracking-wider font-display text-mint">
                                  • {friend.activity || "Online"}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleInvite(friend)}
                              disabled={isInvited}
                              className={cn(
                                "p-1.5 rounded transition cursor-pointer hover:scale-110 shrink-0",
                                isInvited
                                  ? "text-mint bg-mint/15 shadow-[0_0_8px_rgba(60,242,196,0.3)]"
                                  : "text-white/40 hover:text-accent hover:bg-white/5"
                              )}
                              title={isInvited ? "Invited" : "Invite to Party"}
                            >
                              {isInvited ? (
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              ) : (
                                <UserPlus className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Offline Section */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowOffline(!showOffline)}
                  className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Circle className="h-2 w-2 fill-zinc-600 text-zinc-600" /> OFFLINE ({offlineFriends.length})
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      !showOffline && "-rotate-90"
                    )}
                  />
                </button>

                {showOffline && (
                  <div className="space-y-1.5">
                    {offlineFriends.length === 0 ? (
                      <div className="p-2.5 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                        No friends currently offline
                      </div>
                    ) : (
                      offlineFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-2 rounded bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 opacity-60 hover:opacity-80 transition group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                              <Image
                                src={friend.avatar || DEFAULT_AVATARS.USER}
                                alt={friend.name}
                                fill
                                className="object-cover object-top grayscale opacity-50"
                              />
                              <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black bg-zinc-600" />
                            </div>

                            <div className="flex flex-col text-left min-w-0">
                              <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[130px]">
                                {friend.name}
                              </span>
                              <span className="text-[8px] uppercase font-semibold tracking-wider font-display text-zinc-500">
                                Offline
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
