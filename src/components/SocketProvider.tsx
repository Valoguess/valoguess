"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { socket } from "@/socket";
import { ClientEvents, ServerEvents } from "@/socket/events";
import { usePartyStore } from "@/store/partyStore";
import { useGameStore } from "@/store/gameStore";
import { useInviteStore } from "@/store/inviteStore";
import { useAuthStore } from "@/store/authStore";
import { usePresenceStore } from "@/store/presenceStore";
import { useFriendStore } from "@/store/friendStore";
import { Party } from "@/types/party";
import { GuessAgentGameDTO } from "@/types/game";
import { DEFAULT_AVATARS } from "@/consts";
import { toast } from "sonner";
import { useTempResultStore } from "@/store/tempResultStore";

function SocketProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<any>(null);
  const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);
  const hasSyncedPartyRef = React.useRef(false);
  const hasSyncedFriendsRef = React.useRef(false);
  const partyHydrated = usePartyStore((s) => s.hydrated);
  const gameHydrated = useGameStore((s) => s.hydrated);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInitialSyncDone(true);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const { user } = useAuthStore();
  const { setGame, clearGame } = useGameStore();
  const { setFriendsPresence, setSinglePresence } = usePresenceStore();
  const { addIncomingInvite, setLastDeclinedInvite } = useInviteStore();
  const { setInitialFriendsData, triggerFriendSync } = useFriendStore();
  const { party, setParty, clearParty, addPartyMessage } = usePartyStore();

  const handlePartySync = (syncedParty: Party | null) => {
    hasSyncedPartyRef.current = true;
    if (hasSyncedFriendsRef.current) {
      setIsInitialSyncDone(true);
    }

    if (!syncedParty) {
      clearParty();
      return;
    }
    setParty(syncedParty);
  };

  const handlePartyChatSync = (data: { userId: string; message: string }) => {
    if (!data || !data.message) return;
    const currentUserId = user?.id || useAuthStore.getState().user?.id;
    const isMe = data.userId === currentUserId;
    const member = party?.members.find((m) => m.id === data.userId);

    const senderName = isMe ? user?.name || "YOU" : member?.name || "Player";

    addPartyMessage({
      id: crypto.randomUUID(),
      sender: senderName,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: data.message,
      colorClass: isMe ? "text-[#3CF2C4]" : "text-[#8C7BFF]",
      avatar: isMe ? DEFAULT_AVATARS.GUEST : DEFAULT_AVATARS.USER,
    });
  };

  const handlePartyInviteSync = (data: {
    partyId: string;
    inviterId?: string;
    otherPlayerId?: string;
    status: "PENDING" | "DECLINED";
  }) => {
    if (!data || !data.partyId) return;

    const { partyId, inviterId, otherPlayerId, status } = data;

    if (status === "DECLINED") {
      setLastDeclinedInvite({
        otherPlayerId: otherPlayerId || inviterId || "",
        partyId,
        roomId: partyId,
        timestamp: Date.now(),
      });
      return;
    }

    if (status === "PENDING" && inviterId) {
      const id = `inv-${inviterId}-${partyId}`;
      addIncomingInvite({
        id,
        inviteId: id,
        partyId,
        roomId: partyId,
        sender: {
          id: inviterId,
          name: "Player",
          avatar: DEFAULT_AVATARS.USER,
        },
        sentAt: Date.now(),
      });
    }
  };

  const handleGameSync = (syncedGame: GuessAgentGameDTO | null) => {
    if (!syncedGame || (typeof syncedGame === "object" && !syncedGame.id)) {
      clearGame();
      if (pathname === "/play") {
        toast.error("Game not found. Redirecting to lobby.");
        router.push("/lobby");
      }
      return;
    }

    if (syncedGame.status === "FINISHED") {
      useTempResultStore.getState().setTempResultGame(syncedGame);
    }

    const currentUserId = user?.id || useAuthStore.getState().user?.id;
    if (typeof window !== "undefined" && syncedGame?.id) {
      const me =
        (currentUserId ? syncedGame.players?.find((p) => p.id === currentUserId) : undefined) ||
        (syncedGame.status !== "FINISHED"
          ? syncedGame.players?.find((p) => p.state && p.state.secretAgent !== null)
          : undefined);

      if (me) {
        sessionStorage.setItem(`my_player_id_${syncedGame.id}`, me.id);
        if (me.state?.secretAgent) {
          sessionStorage.setItem(
            `secret_agent_${syncedGame.id}`,
            me.state.secretAgent,
          );
        }
      }
    }

    setGame(syncedGame);

    if (
      (syncedGame.status === "STARTING" || syncedGame.status === "PLAYING") &&
      pathname !== "/play"
    ) {
      router.push("/play");
    }
  };

  const handleError = (err: any) => {
    if (err?.message === "Player not found") {
      socket.disconnect();
      socket.connect();
    }
    if (
      err?.message === "Party not found" ||
      err?.message === "User not in party"
    ) {
      clearParty();
      toast.error(err.message);
    }
    if (err?.message === "Game not found") {
      clearGame();
      if (pathname === "/play") {
        toast.error(err.message);
      }
    }
    setError(err);
  };

  const handleFriendsSync = (data: any) => {
    hasSyncedFriendsRef.current = true;
    if (hasSyncedPartyRef.current) {
      setIsInitialSyncDone(true);
    }

    if (!data) return;

    let friendsArr: any[] = [];
    let requestsObj: any = null;

    if (Array.isArray(data)) {
      friendsArr = data;
    } else if (Array.isArray(data.friends)) {
      friendsArr = data.friends;
      requestsObj = data.requests;
    } else if (data.friends && typeof data.friends === "object") {
      friendsArr = Array.isArray(data.friends.friends)
        ? data.friends.friends
        : [];
      requestsObj = data.friends.requests;
    }

    if (friendsArr.length > 0) {
      setFriendsPresence(
        friendsArr.map((f: any) => ({
          userId: f.id,
          online: Boolean(f.online),
        })),
      );
    }

    const friends = friendsArr.map((f: any) => ({
      id: f.id,
      name: f.name || "Player",
      username: f.username
        ? f.username.startsWith("@")
          ? f.username
          : `@${f.username}`
        : undefined,
      avatar: f.image || DEFAULT_AVATARS.USER,
      status: f.online ? ("online" as const) : ("offline" as const),
      activity: f.online ? "In Lobby" : "Offline",
    }));

    const incoming = (requestsObj?.incoming || []).map((r: any) => ({
      id: r.id,
      name: r.name || "Player",
      username: r.username
        ? r.username.startsWith("@")
          ? r.username
          : `@${r.username}`
        : undefined,
      avatar: r.image || DEFAULT_AVATARS.OPPONENT,
      type: "incoming" as const,
    }));

    const outgoing = (requestsObj?.outgoing || []).map((r: any) => ({
      id: r.id,
      name: r.name || "Player",
      username: r.username
        ? r.username.startsWith("@")
          ? r.username
          : `@${r.username}`
        : undefined,
      avatar: r.image || DEFAULT_AVATARS.GUEST,
      type: "outgoing" as const,
    }));

    setInitialFriendsData({
      friends,
      requests: [...incoming, ...outgoing],
    });
  };

  const handleFriendPresence = (data: { userId: string; online: boolean }) => {
    if (data?.userId) {
      setSinglePresence(data.userId, data.online);
    }
  };

  const handleFriendRequest = (data: any) => {
    const userId = data?.id || data?.requesterId || data?.userId;
    if (userId) {
      const requester =
        data?.requester ||
        (data?.name
          ? {
              id: userId,
              name: data.name,
              username: data.username,
              avatar: data.image || data.avatar,
            }
          : undefined);

      triggerFriendSync({
        type: "request_received",
        userId,
        requester,
      });
    }
  };

  const handleFriendRequestAccepted = (data: {
    userId?: string;
    accepterId?: string;
  }) => {
    const targetUserId = data?.userId || data?.accepterId;
    if (targetUserId) {
      triggerFriendSync({
        type: "request_accepted",
        userId: targetUserId,
      });
      setSinglePresence(targetUserId, true);
    }
  };

  const handleFriendRequestDeclined = (data: {
    userId?: string;
    declinerId?: string;
  }) => {
    const targetUserId = data?.userId || data?.declinerId;
    if (targetUserId) {
      triggerFriendSync({
        type: "request_declined",
        userId: targetUserId,
      });
    }
  };

  useEffect(() => {
    if (!partyHydrated || !gameHydrated) return;

    socket.on(ServerEvents.PARTY_SYNC, handlePartySync);
    socket.on(ServerEvents.PARTY_CHAT_SYNC, handlePartyChatSync);
    socket.on(ServerEvents.PARTY_INVITE_SYNC, handlePartyInviteSync);
    socket.on(ServerEvents.GAME_SYNC, handleGameSync);
    socket.on(ServerEvents.GAME_END, handleGameSync);
    socket.on(ServerEvents.ERROR, handleError);

    socket.on(ServerEvents.FRIENDS_SYNC, handleFriendsSync);
    socket.on(ServerEvents.FRIEND_PRESENCE, handleFriendPresence);
    socket.on(ServerEvents.FRIEND_REQUEST, handleFriendRequest);
    socket.on(
      ServerEvents.FRIEND_REQUEST_ACCEPTED,
      handleFriendRequestAccepted,
    );
    socket.on(
      ServerEvents.FRIEND_REQUEST_DECLINED,
      handleFriendRequestDeclined,
    );

    if (!socket.connected) {
      socket.connect();
    }

    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit(ClientEvents.PLAYER_HEARTBEAT);
      }
    }, 30000);

    const handleBeforeUnload = () => {
      socket.disconnect();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off(ServerEvents.PARTY_SYNC, handlePartySync);
      socket.off(ServerEvents.PARTY_CHAT_SYNC, handlePartyChatSync);
      socket.off(ServerEvents.PARTY_INVITE_SYNC, handlePartyInviteSync);
      socket.off(ServerEvents.GAME_SYNC, handleGameSync);
      socket.off(ServerEvents.GAME_END, handleGameSync);
      socket.off(ServerEvents.ERROR, handleError);

      socket.off(ServerEvents.FRIENDS_SYNC, handleFriendsSync);
      socket.off(ServerEvents.FRIEND_PRESENCE, handleFriendPresence);
      socket.off(ServerEvents.FRIEND_REQUEST, handleFriendRequest);
      socket.off(
        ServerEvents.FRIEND_REQUEST_ACCEPTED,
        handleFriendRequestAccepted,
      );
      socket.off(
        ServerEvents.FRIEND_REQUEST_DECLINED,
        handleFriendRequestDeclined,
      );

      clearInterval(heartbeat);
      socket.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [partyHydrated, gameHydrated]);

  if (!isInitialSyncDone) {
    return (
      <main className="min-h-screen w-full bg-[#040609] flex flex-col items-center justify-center text-white select-none font-body">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 animate-pulse">
              <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
              <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
              <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
            </svg>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <span className="font-valorant text-xs sm:text-sm text-white tracking-[0.25em] uppercase">
              INITIALIZING PROTOCOL
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              SYNCHRONIZING TACTICAL NETWORK...
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {children}
    </>
  );
}

export default SocketProvider;
