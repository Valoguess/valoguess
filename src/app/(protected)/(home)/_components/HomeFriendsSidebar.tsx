"use client";

import { useState, useRef, useEffect } from "react";
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
  Copy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Friend, FriendRequest } from "@/types/friends";
import { IncomingPartyInvite } from "@/types/party";
import { DEFAULT_AVATARS } from "@/consts";
import { FriendRow } from "./friends/FriendRow";
import {
  IncomingRequestRow,
  OutgoingRequestRow,
} from "./friends/FriendRequestRow";
import { AddFriendForm } from "./friends/AddFriendForm";
import { GuestLockedView } from "./friends/GuestLockedView";
import { RemoveFriendModal } from "./friends/RemoveFriendModal";

interface HomeFriendsSidebarProps {
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
  onAcceptPartyInvite?: (inviteId: string, partyId: string) => void;
  onDeclinePartyInvite?: (inviteId: string) => void;
  isAddingFriend?: boolean;
}

export function HomeFriendsSidebar({
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
  incomingPartyInvites = [],
  onAcceptPartyInvite,
  onDeclinePartyInvite,
  isAddingFriend = false,
}: HomeFriendsSidebarProps) {
  const { user } = useAuthStore();
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyUsername = () => {
    if (!user?.username) return;
    navigator.clipboard.writeText(user.username.replace(/^@/, ""));
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

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

  const asideRef = useRef<HTMLElement | null>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const justClosedRef = useRef(false);

  const isHoverSupported = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  };

  const handleMouseEnter = () => {
    if (!isHoverSupported()) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (justClosedRef.current) return;
    if (isFriendsCollapsed) {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      openTimeoutRef.current = setTimeout(() => {
        setIsFriendsCollapsed(false);
        openTimeoutRef.current = null;
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (!isHoverSupported()) return;
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    justClosedRef.current = false;
    if (isFriendsCollapsed || friendToRemove || isAddingFriend) return;

    if (asideRef.current && asideRef.current.contains(document.activeElement)) {
      const activeEl = document.activeElement as HTMLElement | null;
      if (activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA") {
        return;
      }
    }

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsFriendsCollapsed(true);
      closeTimeoutRef.current = null;
    }, 350);
  };

  const handleExplicitClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    justClosedRef.current = true;
    setIsFriendsCollapsed(true);
    setTimeout(() => {
      justClosedRef.current = false;
    }, 600);
  };

  const handleHeaderClick = () => {
    if (isFriendsCollapsed) {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      justClosedRef.current = false;
      setIsFriendsCollapsed(false);
    }
  };

  useEffect(() => {
    if (isFriendsCollapsed) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (friendToRemove) return;
      if (asideRef.current && !asideRef.current.contains(e.target as Node)) {
        setIsFriendsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFriendsCollapsed, friendToRemove, setIsFriendsCollapsed]);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  const incomingRequests = friendRequests.filter((r) => r.type === "incoming");
  const outgoingRequests = friendRequests.filter((r) => r.type === "outgoing");

  const unlistedInviteFriends: Friend[] = incomingPartyInvites
    .filter((inv) => !friendsList.some((f) => f.id === inv.sender.id))
    .map((inv) => ({
      id: inv.sender.id,
      name: inv.sender.name || "Player",
      username: inv.sender.username,
      avatar: inv.sender.avatar || DEFAULT_AVATARS.USER,
      status: "online",
      activity: "In Lobby",
    }));

  const onlineFriends = [
    ...unlistedInviteFriends,
    ...friendsList.filter(
      (f) =>
        f.status === "online" ||
        f.status === "ingame" ||
        incomingPartyInvites.some((inv) => inv.sender.id === f.id),
    ),
  ];
  const offlineFriends = friendsList.filter(
    (f) =>
      f.status === "offline" &&
      !incomingPartyInvites.some((inv) => inv.sender.id === f.id),
  );
  const totalRequestsCount = incomingRequests.length + outgoingRequests.length;

  return (
    <aside
      ref={asideRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex flex-col h-full w-full bg-[#070a12]/95 border-l border-white/10 backdrop-blur-xl transition-all duration-300 shrink-0 select-none overflow-hidden justify-between",
      )}
    >
      <div
        onClick={handleHeaderClick}
        className={cn(
          "border-b border-white/10 shrink-0 bg-black/40 transition-colors",
          isFriendsCollapsed
            ? "p-2.5 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 group"
            : "flex items-center justify-between p-3",
        )}
        title={isFriendsCollapsed ? "Friends" : undefined}
      >
        {isFriendsCollapsed ? (
          <div className="flex flex-col items-center gap-1 w-full">
            {isAnonymous ? (
              <Lock className="h-4 w-4 text-[#FF4655]" />
            ) : (
              <div className="relative">
                <Users className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
                {(incomingRequests.length > 0 ||
                  incomingPartyInvites.length > 0) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#FF4655] animate-ping" />
                )}
              </div>
            )}
            <ChevronLeft className="h-3.5 w-3.5 text-white/40 group-hover:text-accent transition-colors" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white truncate">
              {isAnonymous ? (
                <>
                  <Lock className="h-4 w-4 text-[#FF4655] shrink-0" />
                  <span>FRIENDS</span>
                  <span className="text-[9px] font-mono text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.2 rounded-xs border border-[#FF4655]/20">
                    LOCKED
                  </span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 text-accent shrink-0" />
                  <span>FRIENDS ({friendsList.length})</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleExplicitClose}
              className="p-1 hover:bg-white/10 rounded-xs text-white/60 hover:text-white transition cursor-pointer"
              title="Close Friends Menu"
            >
              <X className="h-4 w-4 lg:hidden" />
              <ChevronRight className="h-4 w-4 hidden lg:block" />
            </button>
          </>
        )}
      </div>

      {!isFriendsCollapsed && !isAnonymous && user?.username && (
        <div className="mx-2.5 mt-2.5 p-2 rounded-xs bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2 transition group shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative h-8 w-8 overflow-hidden shrink-0">
              <Image
                src={user.image || DEFAULT_AVATARS.USER}
                alt={user.name || "Me"}
                fill
                className="object-cover object-top rounded-full"
              />
              <div className="absolute bottom-0 right-0 h-1.5 w-1.5 z-10 bg-mint rounded-full" />
            </div>

            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-display font-bold text-accent tracking-wider truncate leading-tight cursor-text select-text">
                @{user.username.replace(/^@/, "")}
              </span>
              <span className="text-[9px] font-normal text-white/70 truncate leading-tight font-sans">
                You
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyUsername}
            className="px-2 py-1 bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/30 rounded-xs text-[9px] font-mono font-bold flex items-center gap-1 transition shrink-0 cursor-pointer active:scale-95"
            title="Copy username to share with friends"
          >
            {copiedId ? (
              <>
                <Check className="h-3 w-3 text-mint" />
                <span className="text-mint">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      )}

      {!isFriendsCollapsed && !isAnonymous && (
        <div className="flex items-center border-b border-white/10 bg-white/[0.02] p-1.5 gap-1 shrink-0 text-[10px] font-display font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex-1 py-1 px-2 rounded-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "all"
                ? "bg-accent text-white"
                : "text-white/60 hover:text-white hover:bg-white/5",
            )}
          >
            <span>FRIENDS</span>
            <span className="text-[9px] opacity-80">
              ({friendsList.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex-1 py-1 px-2 rounded-xs transition text-center flex items-center justify-center gap-1.5 cursor-pointer",
              activeTab === "requests"
                ? "bg-accent text-white"
                : "text-white/60 hover:text-white hover:bg-white/5",
            )}
          >
            <span>REQUESTS</span>
            {totalRequestsCount > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[8px] font-black",
                  activeTab === "requests"
                    ? "bg-white text-accent"
                    : "bg-accent text-white",
                )}
              >
                {totalRequestsCount}
              </span>
            )}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
        {isAnonymous ? (
          <GuestLockedView
            isCollapsed={isFriendsCollapsed}
            onExpand={() => setIsFriendsCollapsed(false)}
          />
        ) : isFriendsCollapsed ? (
          <div className="flex flex-col items-center space-y-2.5">
            {incomingPartyInvites.length > 0 && (
              <div
                onClick={() => setIsFriendsCollapsed(false)}
                className="relative h-8 w-8 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint cursor-pointer hover:scale-105 transition"
                title={`${incomingPartyInvites.length} Pending Party Invite(s)`}
              >
                <Radio className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-mint text-black text-[8px] font-bold flex items-center justify-center">
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

            {[...friendsList]
              .sort((a, b) => {
                const score = (s: string) =>
                  s === "ingame" ? 2 : s === "online" ? 1 : 0;
                return score(b.status) - score(a.status);
              })
              .map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setIsFriendsCollapsed(false)}
                  className="relative h-8 w-8 rounded-full overflow-hidden border border-white/10 hover:border-accent transition cursor-pointer hover:scale-105 shrink-0"
                  title={`${friend.name} (${friend.status})`}
                >
                  <Image
                    src={friend.avatar}
                    alt={friend.name}
                    fill
                    className={cn(
                      "object-cover object-top",
                      friend.status === "offline" && "opacity-40 grayscale",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black",
                      friend.status === "online"
                        ? "bg-mint"
                        : friend.status === "ingame"
                          ? "bg-amber-400"
                          : "bg-zinc-600",
                    )}
                  />
                </div>
              ))}
          </div>
        ) : (
          <>
            {activeTab === "requests" ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1">
                    <span className="flex items-center gap-1.5 text-accent">
                      <Clock className="h-3 w-3" /> PENDING REQUESTS (
                      {incomingRequests.length})
                    </span>
                  </div>

                  {incomingRequests.length === 0 ? (
                    <div className="p-3 text-center rounded-xs bg-white/[0.02] border border-white/5 text-[10px] text-white/40 font-mono">
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

                <div>
                  <div className="flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1">
                    <span className="flex items-center gap-1.5 text-white/40">
                      <Send className="h-3 w-3" /> SENT REQUESTS (
                      {outgoingRequests.length})
                    </span>
                  </div>

                  {outgoingRequests.length === 0 ? (
                    <div className="p-3 text-center rounded-xs bg-white/[0.02] border border-white/5 text-[10px] text-white/40 font-mono">
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
              <div className="space-y-3.5">
                {incomingRequests.length > 0 && (
                  <div
                    onClick={() => setActiveTab("requests")}
                    className="p-2 rounded-xs bg-accent/15 border border-accent/40 flex items-center justify-between text-accent hover:bg-accent/20 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-display font-bold uppercase tracking-wider">
                        {incomingRequests.length} Pending Request
                        {incomingRequests.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-white group-hover:underline">
                      VIEW →
                    </span>
                  </div>
                )}

                {friendsList.length === 0 ? (
                  <div className="p-4 text-center rounded-xs bg-white/[0.02] border border-white/5 space-y-1.5 my-2">
                    <Users className="h-6 w-6 text-white/20 mx-auto mb-1" />
                    <div className="text-[10.5px] font-display font-bold text-white/70 uppercase tracking-wider">
                      NO FRIENDS YET
                    </div>
                    <div className="text-[9.5px] text-white/40 leading-normal font-sans">
                      Send a friend request using the input below to add
                      players.
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <button
                        onClick={() => setShowOnline(!showOnline)}
                        className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/60 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-mint">
                          <Circle className="h-2 w-2 fill-mint text-mint" /> ONLINE (
                          {onlineFriends.length})
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            !showOnline && "-rotate-90",
                          )}
                        />
                      </button>

                      {showOnline && (
                        <div className="space-y-1.5">
                          {onlineFriends.length === 0 ? (
                            <div className="p-2.5 text-center rounded-xs bg-white/[0.02] border border-white/5 text-[10px] text-white/40 font-mono">
                              No friends currently online
                            </div>
                          ) : (
                            [...onlineFriends]
                              .sort((a, b) => {
                                const aHasInvite = incomingPartyInvites.some(
                                  (inv) =>
                                    inv.sender.id === a.id ||
                                    (a.username &&
                                      inv.sender.username === a.username) ||
                                    inv.sender.name.toLowerCase() ===
                                      a.name.toLowerCase(),
                                );
                                const bHasInvite = incomingPartyInvites.some(
                                  (inv) =>
                                    inv.sender.id === b.id ||
                                    (b.username &&
                                      inv.sender.username === b.username) ||
                                    inv.sender.name.toLowerCase() ===
                                      b.name.toLowerCase(),
                                );
                                if (aHasInvite && !bHasInvite) return -1;
                                if (!aHasInvite && bHasInvite) return 1;
                                return 0;
                              })
                              .map((friend) => {
                                const incomingInviteForFriend =
                                  incomingPartyInvites.find(
                                    (inv) =>
                                      inv.sender.id === friend.id ||
                                      (friend.username &&
                                        inv.sender.username ===
                                          friend.username) ||
                                      inv.sender.name.toLowerCase() ===
                                        friend.name.toLowerCase(),
                                  );

                                return (
                                  <FriendRow
                                    key={friend.id}
                                    friend={friend}
                                    onSelectToRemove={setFriendToRemove}
                                    onInvite={handleInviteFriend}
                                    hasIncomingInvite={Boolean(
                                      incomingInviteForFriend,
                                    )}
                                    onAcceptIncomingInvite={
                                      incomingInviteForFriend
                                        ? () =>
                                            onAcceptPartyInvite?.(
                                              incomingInviteForFriend.id,
                                              incomingInviteForFriend.partyId ||
                                                incomingInviteForFriend.roomId ||
                                                "",
                                            )
                                        : undefined
                                    }
                                    onDeclineIncomingInvite={
                                      incomingInviteForFriend
                                        ? () =>
                                            onDeclinePartyInvite?.(
                                              incomingInviteForFriend.id,
                                            )
                                        : undefined
                                    }
                                  />
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={() => setShowOffline(!showOffline)}
                        className="w-full flex items-center justify-between text-[9px] font-display font-bold uppercase tracking-wider text-white/50 mb-1.5 px-1 hover:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-white/40">
                          <Circle className="h-2 w-2 fill-zinc-600 text-zinc-600" />{" "}
                          OFFLINE ({offlineFriends.length})
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            !showOffline && "-rotate-90",
                          )}
                        />
                      </button>

                      {showOffline && (
                        <div className="space-y-1.5">
                          {offlineFriends.length === 0 ? (
                            <div className="p-2.5 text-center rounded-xs bg-white/[0.02] border border-white/5 text-[10px] text-white/40 font-mono">
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

      {!isFriendsCollapsed && !isAnonymous && (
        <AddFriendForm
          friendInput={friendInput}
          setFriendInput={setFriendInput}
          onSubmit={handleAddFriend}
          isAddingFriend={isAddingFriend}
          currentUsername={user?.username}
        />
      )}

      <RemoveFriendModal
        friendToRemove={friendToRemove}
        onClose={() => setFriendToRemove(null)}
        onConfirm={confirmRemoveFriend}
        isRemoving={isRemovingFriend}
      />
    </aside>
  );
}

export { HomeFriendsSidebar as LobbyFriendsSidebar };
