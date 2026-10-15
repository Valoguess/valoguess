"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function SocketProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const partyHydrated = usePartyStore((s) => s.hydrated);
  const gameHydrated = useGameStore((s) => s.hydrated);

  const { user } = useAuthStore();
  const { setGame, clearGame } = useGameStore();
  const { setFriendsPresence, setSinglePresence } = usePresenceStore();
  const { addIncomingInvite, setLastDeclinedInvite } = useInviteStore();
  const { setInitialFriendsData, triggerFriendSync } = useFriendStore();
  const { party, setParty, clearParty, addPartyMessage } = usePartyStore();

  const handlePartySync = (syncedParty: Party | null) => {
    if (!syncedParty) {
      clearParty();
      return;
    }
    setParty(syncedParty);
  };

  const handlePartyChatSync = (data: { userId: string; message: string }) => {
    if (!data || !data.message) return;
    const currentUserId = user?.id;
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
      router.push("/lobby");
      return;
    }

    const currentUserId = user?.id;
    if (currentUserId && typeof window !== "undefined") {
      const me = syncedGame.players.find((p) => p.id === currentUserId);
      if (me?.state?.secretAgent) {
        sessionStorage.setItem(
          `secret_agent_${syncedGame.id}`,
          me.state.secretAgent,
        );
      }
    }

    setGame(syncedGame);
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
      toast.error(err.message);
    }
    setError(err);
  };

  const handleFriendsSync = (data: {
    friends?: {
      friends?: Array<{
        id: string;
        name: string;
        username?: string | null;
        image?: string | null;
        online?: boolean;
      }>;
      requests?: {
        incoming?: Array<{
          id: string;
          name: string;
          username?: string | null;
          image?: string | null;
        }>;
        outgoing?: Array<{
          id: string;
          name: string;
          username?: string | null;
          image?: string | null;
        }>;
      };
    };
  }) => {
    const syncData = data?.friends;
    if (!syncData) return;

    if (syncData.friends) {
      setFriendsPresence(
        syncData.friends.map((f) => ({
          userId: f.id,
          online: Boolean(f.online),
        })),
      );
    }

    const friends = (syncData.friends || []).map((f) => ({
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

    const incoming = (syncData.requests?.incoming || []).map((r) => ({
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

    const outgoing = (syncData.requests?.outgoing || []).map((r) => ({
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
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [partyHydrated, gameHydrated]);

  if (!partyHydrated || !gameHydrated) {
    return null;
  }

  return children;
}

export default SocketProvider;
