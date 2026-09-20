"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Send,
  UserCheck,
  Circle,
  Lock,
  Radio,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend, FriendRequest, IncomingPartyInvite } from "./types";
import { FriendRow } from "./friends/FriendRow";
import { IncomingRequestRow, OutgoingRequestRow } from "./friends/FriendRequestRow";
import { AddFriendForm } from "./friends/AddFriendForm";
import { GuestLockedView } from "./friends/GuestLockedView";
import { RemoveFriendModal } from "./friends/RemoveFriendModal";

interface LobbyFriendsSidebarProps {
  isFriendsCollapsed: boolean;
  setIsFriendsCollapsed: (collapsed: boolean) => void;
  isAnonymous?: boolean;
  friendsList: Friend[];
  friendRequests: FriendRequest[];
  friendInput: string;
  setFriendInput: (val: string) => void;
  handleAddFriend: (e: React.FormEvent) => void;
  handleAcceptRequest: (requestId: string) => void;
  handleDeclineRequest: (requestId: string) => void;
  handleCancelRequest: (requestId: string) => void;
  handleRemoveFriend: (friendId: string) => void | Promise<void>;
  handleInviteFriend: (friend: Friend) => void;
  invitedFriendIds?: string[];
  onCancelInviteFriend?: (friend: Friend) => void;
  incomingPartyInvites?: IncomingPartyInvite[];
  onAcceptPartyInvite?: (inviteId: string, roomId: string) => void;
  onDeclinePartyInvite?: (inviteId: string) => void;
  friendAddedToast: string;
  isAddingFriend?: boolean;
}

export function LobbyFriendsSidebar({
  isFriendsCollapsed,
  setIsFriendsCollapsed,
  isAnonymous = false,
  friendsList,
  friendRequests,
  friendInput,
  setFriendInput,
  handleAddFriend,
  handleAcceptRequest,
  handleDeclineRequest,
  handleCancelRequest,
  handleRemoveFriend,
  handleInviteFriend,
  invitedFriendIds = [],
  onCancelInviteFriend,
  incomingPartyInvites = [],
  onAcceptPartyInvite,
  onDeclinePartyInvite,
  friendAddedToast,
  isAddingFriend = false,
}: LobbyFriendsSidebarProps) {
  // Confirmation modal state for removing a friend
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [isRemovingFriend, setIsRemovingFriend] = useState(false);

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;
    setIsRemovingFriend(true);
    try {
      await handleRemoveFriend(friendToRemove.id);
    } finally {
      setIsRemovingFriend(false);
      setFriendToRemove(null);
    }
  };

  // Collapsible section toggles
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  // Filter tabs: "all" | "requests"
  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  const incomingRequests = friendRequests.filter((r) => r.type === "incoming");
  const outgoingRequests = friendRequests.filter((r) => r.type === "outgoing");

  const unlistedInviteFriends: Friend[] = incomingPartyInvites
    .filter((inv) => !friendsList.some((f) => f.id === inv.sender.id))
    .map((inv) => ({
      id: inv.sender.id,
      name: inv.sender.name || "Player",
      username: inv.sender.username,
      avatar: inv.sender.avatar || "/agents/icon/omen.png",
      status: "online",
      activity: "In Lobby",
    }));

  const onlineFriends = [
    ...unlistedInviteFriends,
    ...friendsList.filter(
      (f) =>
        f.status === "online" ||
        f.status === "ingame" ||
        incomingPartyInvites.some((inv) => inv.sender.id === f.id)
    ),
  ];
  const offlineFriends = friendsList.filter(
    (f) =>
      f.status === "offline" &&
      !incomingPartyInvites.some((inv) => inv.sender.id === f.id)
  );
  const totalRequestsCount = incomingRequests.length + outgoingRequests.length;


  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full max-h-130 bg-black/60 border border-white/10 rounded-sm backdrop-blur-md transition-all duration-300 shrink-0 select-none overflow-hidden",
        isFriendsCollapsed ? "w-16 p-2 justify-between" : "w-80 p-0 justify-between"
      )}
    >
      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between border-b border-white/10 p-3 shrink-0 bg-black/40">
        {!isFriendsCollapsed ? (
          <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white truncate">
            {isAnonymous ? (
              <>
                <Lock className="h-4 w-4 text-[#FF4655] shrink-0" />
                <span>SOCIAL HUB</span>
                <span className="text-[9px] font-mono text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.2 rounded border border-[#FF4655]/20">
                  LOCKED
                </span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-accent shrink-0" />
                <span>SOCIAL HUB ({friendsList.length})</span>
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center gap-1">
            {isAnonymous ? (
              <Lock className="h-4 w-4 text-[#FF4655]" />
            ) : (
              <>
                <Users className="h-4 w-4 text-accent" />
                {incomingRequests.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-[#FF4655] animate-ping" />
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={() => setIsFriendsCollapsed(!isFriendsCollapsed)}
          className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition mx-auto md:mx-0 cursor-pointer"
          title={isFriendsCollapsed ? "Expand Friends Menu" : "Collapse Friends Menu"}
        >
          {isFriendsCollapsed ? (
            <ChevronLeft className="h-4 w-4 text-accent" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 2. TAB SWITCHER (Shown when expanded AND NOT anonymous) */}
      {!isFriendsCollapsed && !isAnonymous && (
        <div className="flex items-center border-b border-white/10 bg-white/2 p-1.5 gap-1 shrink-0 text-[10px] font-display font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-1 py-1 px-2 rounded-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "all"
                ? "bg-accent text-white shadow-[0_0_10px_rgba(255,70,85,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <span>FRIENDS</span>
            <span className="text-[9px] opacity-80">({friendsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex-1 py-1 px-2 rounded-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "requests"
                ? "bg-accent text-white shadow-[0_0_10px_rgba(255,70,85,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <span>REQUESTS</span>
            {totalRequestsCount > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[8px] font-black",
                  activeTab === "requests" ? "bg-white text-accent" : "bg-accent text-white animate-pulse"
                )}
              >
                {totalRequestsCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 3. SCROLLABLE CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
        {/* CASE A: GUEST / ANONYMOUS USER ACCESS LOCKED */}
        {isAnonymous ? (
          <GuestLockedView
            isCollapsed={isFriendsCollapsed}
            onExpand={() => setIsFriendsCollapsed(false)}
          />
        ) : isFriendsCollapsed ? (
          /* CASE B: COLLAPSED VIEW (AUTHENTICATED) */
          <div className="flex flex-col items-center space-y-2.5">
            {incomingPartyInvites.length > 0 && (
              <div
                onClick={() => setIsFriendsCollapsed(false)}
                className="relative h-8 w-8 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint cursor-pointer hover:scale-105 transition animate-pulse"
                title={`${incomingPartyInvites.length} Pending Party Invite(s)`}
              >
                <Radio className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-mint text-black text-[8px] font-bold flex items-center justify-center shadow-[0_0_6px_#3cf2c4]">
                  {incomingPartyInvites.length}
                </span>
              </div>
            )}

            {incomingRequests.length > 0 && (
              <div
                onClick={() => setIsFriendsCollapsed(false)}
                className="relative h-8 w-8 rounded-full bg-[#FF4655]/20 border border-[#FF4655] flex items-center justify-center text-[#FF4655] cursor-pointer hover:scale-105 transition"
                title={`${incomingRequests.length} Pending Friend Request(s)`}
              >
                <UserCheck className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#FF4655] text-white text-[8px] font-bold flex items-center justify-center">
                  {incomingRequests.length}
                </span>
              </div>
            )}

            {friendsList.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setIsFriendsCollapsed(false)}
                className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10 hover:border-accent transition cursor-pointer hover:scale-105"
                title={`${friend.name} (${friend.status})`}
              >
                <Image
                  src={friend.avatar}
                  alt={friend.name}
                  fill
                  className={cn(
                    "object-cover object-top",
                    friend.status === "offline" && "opacity-40 grayscale"
                  )}
                />
                <div
                  className={cn(
                    "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black",
                    friend.status === "online"
                      ? "bg-mint shadow-[0_0_6px_#3cf2c4]"
                      : friend.status === "ingame"
                      ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                      : "bg-zinc-600"
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          /* CASE C: EXPANDED VIEW (AUTHENTICATED) */
          <>
            {activeTab === "requests" ? (
              /* TAB 1: REQUESTS */
              <div className="space-y-4">
                {/* Incoming requests */}
                <div>
                  <div className="flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1">
                    <span className="flex items-center gap-1.5 text-accent">
                      <Clock className="h-3 w-3" /> PENDING REQUESTS ({incomingRequests.length})
                    </span>
                  </div>

                  {incomingRequests.length === 0 ? (
                    <div className="p-3 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                      No incoming friend requests
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {incomingRequests.map((req) => (
                        <IncomingRequestRow
                          key={req.id}
                          request={req}
                          onAccept={handleAcceptRequest}
                          onDecline={handleDeclineRequest}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Outgoing sent requests */}
                <div>
                  <div className="flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Send className="h-3 w-3" /> SENT REQUESTS ({outgoingRequests.length})
                    </span>
                  </div>

                  {outgoingRequests.length === 0 ? (
                    <div className="p-3 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                      No outgoing sent requests
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {outgoingRequests.map((req) => (
                        <OutgoingRequestRow
                          key={req.id}
                          request={req}
                          onCancel={handleCancelRequest}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: ALL FRIENDS */
              <div className="space-y-3.5">
                {/* Incoming notification banner */}
                {incomingRequests.length > 0 && (
                  <div
                    onClick={() => setActiveTab("requests")}
                    className="p-2 rounded bg-accent/15 border border-accent/40 flex items-center justify-between text-accent hover:bg-accent/25 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider">
                        {incomingRequests.length} Pending Request{incomingRequests.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-white group-hover:underline">
                      VIEW →
                    </span>
                  </div>
                )}

                {friendsList.length === 0 ? (
                  <div className="p-4 text-center rounded bg-white/2 border border-white/5 space-y-1.5 my-2">
                    <Users className="h-6 w-6 text-white/20 mx-auto mb-1" />
                    <div className="text-[10.5px] font-display font-bold text-white/70 uppercase tracking-wider">
                      NO FRIENDS YET
                    </div>
                    <div className="text-[9.5px] text-zinc-500 leading-normal">
                      Send a friend request using the input below to add players.
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Online friends */}
                    <div>
                      <button
                        onClick={() => setShowOnline(!showOnline)}
                        className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/60 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-mint">
                          <Circle className="h-2 w-2 fill-mint" /> ONLINE ({onlineFriends.length})
                        </span>
                        <ChevronDown
                          className={cn("h-3 w-3 transition-transform", !showOnline && "-rotate-90")}
                        />
                      </button>

                      {showOnline && (
                        <div className="space-y-1.5">
                          {onlineFriends.length === 0 ? (
                            <div className="p-2.5 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                              No friends currently online
                            </div>
                          ) : (
                            [...onlineFriends]
                              .sort((a, b) => {
                                const aHasInvite = incomingPartyInvites.some(
                                  (inv) =>
                                    inv.sender.id === a.id ||
                                    (a.username && inv.sender.username === a.username) ||
                                    inv.sender.name.toLowerCase() === a.name.toLowerCase()
                                );
                                const bHasInvite = incomingPartyInvites.some(
                                  (inv) =>
                                    inv.sender.id === b.id ||
                                    (b.username && inv.sender.username === b.username) ||
                                    inv.sender.name.toLowerCase() === b.name.toLowerCase()
                                );
                                if (aHasInvite && !bHasInvite) return -1;
                                if (!aHasInvite && bHasInvite) return 1;
                                return 0;
                              })
                              .map((friend) => {
                                const incomingInviteForFriend = incomingPartyInvites.find(
                                  (inv) =>
                                    inv.sender.id === friend.id ||
                                    (friend.username && inv.sender.username === friend.username) ||
                                    inv.sender.name.toLowerCase() === friend.name.toLowerCase()
                                );

                                return (
                                  <FriendRow
                                    key={friend.id}
                                    friend={friend}
                                    onSelectToRemove={setFriendToRemove}
                                    onInvite={handleInviteFriend}
                                    hasIncomingInvite={Boolean(incomingInviteForFriend)}
                                    onAcceptIncomingInvite={
                                      incomingInviteForFriend
                                        ? () =>
                                            onAcceptPartyInvite?.(
                                              incomingInviteForFriend.id,
                                              incomingInviteForFriend.roomId
                                            )
                                        : undefined
                                    }
                                    onDeclineIncomingInvite={
                                      incomingInviteForFriend
                                        ? () =>
                                            onDeclinePartyInvite?.(incomingInviteForFriend.id)
                                        : undefined
                                    }
                                  />
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Offline friends */}
                    <div>
                      <button
                        onClick={() => setShowOffline(!showOffline)}
                        className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <Circle className="h-2 w-2 fill-zinc-600 text-zinc-600" /> OFFLINE ({offlineFriends.length})
                        </span>
                        <ChevronDown
                          className={cn("h-3 w-3 transition-transform", !showOffline && "-rotate-90")}
                        />
                      </button>

                      {showOffline && (
                        <div className="space-y-1.5">
                          {offlineFriends.length === 0 ? (
                            <div className="p-2.5 text-center rounded bg-white/2 border border-white/5 text-[10px] text-zinc-500 font-medium">
                              No offline friends
                            </div>
                          ) : (
                            offlineFriends.map((friend) => (
                              <FriendRow
                                key={friend.id}
                                friend={friend}
                                onSelectToRemove={setFriendToRemove}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. ADD FRIEND INPUT SECTION */}
      {!isFriendsCollapsed && !isAnonymous && (
        <AddFriendForm
          friendInput={friendInput}
          setFriendInput={setFriendInput}
          onSubmit={handleAddFriend}
          isAddingFriend={isAddingFriend}
          friendAddedToast={friendAddedToast}
        />
      )}

      {/* REMOVE FRIEND CONFIRMATION POPUP */}
      <RemoveFriendModal
        friendToRemove={friendToRemove}
        onClose={() => setFriendToRemove(null)}
        onConfirm={confirmRemoveFriend}
        isRemoving={isRemovingFriend}
      />
    </div>
  );
}
