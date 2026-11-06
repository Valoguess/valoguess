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
import { Friend } from "@/types/friends";
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
        className="bg-[#070a12]/98 border border-white/10 text-white backdrop-blur-2xl sm:max-w-sm w-full p-0 overflow-hidden select-none rounded-sm"
      >
        <DialogTitle className="sr-only">
          INVITE FRIENDS ({friendsList.length})
        </DialogTitle>

        <div className="flex items-center justify-between p-3.5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2 text-xs font-valorant tracking-wider text-white">
            <Users className="h-4 w-4 text-[#FF4655] shrink-0" />
            <span>INVITE TO DUEL ({friendsList.length})</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-white/10 rounded-sm text-white/60 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[460px] overflow-y-auto p-3.5 space-y-3 scrollbar-thin">
          {friendsList.length === 0 ? (
            <div className="p-6 text-center rounded-sm bg-white/[0.02] border border-white/5 space-y-2">
              <Users className="h-8 w-8 text-white/20 mx-auto" />
              <div className="text-xs font-valorant text-white/70 tracking-wider">
                NO FRIENDS FOUND
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                Add friends via your sidebar to invite them directly.
              </p>
            </div>
          ) : (
            <>
              <div>
                <button
                  type="button"
                  onClick={() => setShowOnline(!showOnline)}
                  className="w-full flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-mint">
                    <Circle className="h-2 w-2 fill-mint" /> ONLINE ({onlineFriends.length})
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      !showOnline && "-rotate-90"
                    )}
                  />
                </button>

                {showOnline && (
                  <div className="space-y-1.5">
                    {onlineFriends.length === 0 ? (
                      <div className="p-2.5 text-center rounded-sm bg-white/[0.02] border border-white/5 text-[10px] text-zinc-500 font-mono">
                        No friends currently online
                      </div>
                    ) : (
                      onlineFriends.map((friend) => {
                        const isInvited = invitedIds.has(friend.id);

                        return (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-2 rounded-sm bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <Image
                                  src={friend.avatar || DEFAULT_AVATARS.USER}
                                  alt={friend.name}
                                  fill
                                  className="object-cover object-top"
                                />
                                <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black bg-mint" />
                              </div>

                              <div className="flex flex-col text-left min-w-0">
                                <span className="font-display text-xs font-bold text-white tracking-wide truncate max-w-[140px]">
                                  {friend.name}
                                </span>
                                <span className="text-[9px] uppercase font-mono tracking-wider text-mint">
                                  {friend.activity || "Online"}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleInvite(friend)}
                              disabled={isInvited}
                              className={cn(
                                "px-2 py-1 rounded-sm text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer flex items-center gap-1 shrink-0",
                                isInvited
                                  ? "text-mint bg-mint/15 border border-mint/30"
                                  : "text-white bg-[#FF4655] hover:bg-[#ff5a67]"
                              )}
                              title={isInvited ? "Invited" : "Invite to Party"}
                            >
                              {isInvited ? (
                                <>
                                  <Check className="h-3 w-3 stroke-[2.5]" />
                                  <span>SENT</span>
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-3 w-3" />
                                  <span>INVITE</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowOffline(!showOffline)}
                  className="w-full flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Circle className="h-2 w-2 fill-zinc-600 text-zinc-600" /> OFFLINE ({offlineFriends.length})
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      !showOffline && "-rotate-90"
                    )}
                  />
                </button>

                {showOffline && (
                  <div className="space-y-1.5">
                    {offlineFriends.length === 0 ? (
                      <div className="p-2.5 text-center rounded-sm bg-white/[0.02] border border-white/5 text-[10px] text-zinc-500 font-mono">
                        No friends offline
                      </div>
                    ) : (
                      offlineFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-2 rounded-sm bg-white/[0.01] border border-white/5 opacity-50"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                              <Image
                                src={friend.avatar || DEFAULT_AVATARS.USER}
                                alt={friend.name}
                                fill
                                className="object-cover object-top grayscale opacity-50"
                              />
                            </div>

                            <div className="flex flex-col text-left min-w-0">
                              <span className="font-display text-xs font-bold text-white tracking-wide truncate max-w-[140px]">
                                {friend.name}
                              </span>
                              <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">
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
