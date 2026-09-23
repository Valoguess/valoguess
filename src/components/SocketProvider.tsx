"use client";

import { socket } from '@/socket';
import { ClientEvents, ServerEvents } from '@/socket/events';
import { useRoomStore } from '@/store/roomStore';
import { useInviteStore } from '@/store/inviteStore';
import { Room } from '@/types/game';
import React, { useEffect, useState } from 'react'

import { useAuthStore } from '@/store/authStore';
import { usePresenceStore } from '@/store/presenceStore';

function SocketProvider({
  children,
}: {
  children: React.ReactNode;
  }) {
  const [error, setError] = useState(null);
  const { room, setRoom, clearRoom, hydrated } = useRoomStore();

  const handleRoomSync = (syncedRoom: Room | null) => {
    if (!syncedRoom) {
      clearRoom();
      console.log("Room synced: null");
      return;
    }

    const currentUserId =
      useAuthStore.getState().user?.id ||
      (typeof window !== "undefined" ? sessionStorage.getItem("my_player_id") : null);

    if (currentUserId && syncedRoom.me?.player?.id) {
      if (syncedRoom.me.player.id === currentUserId && syncedRoom.me.state?.secretAgent) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`secret_agent_${syncedRoom.id}`, syncedRoom.me.state.secretAgent);
        }
      }

      if (
        syncedRoom.me.player.id !== currentUserId &&
        syncedRoom.opponent?.player.id === currentUserId
      ) {
        console.warn("Inverted room sync detected; normalizing perspective for local player.");
        const originalOpponent = syncedRoom.me;
        const originalMe = syncedRoom.opponent;

        let cachedSecretAgent: string | null = null;
        if (typeof window !== "undefined") {
          cachedSecretAgent = sessionStorage.getItem(`secret_agent_${syncedRoom.id}`);
        }

        const normalizedMe = {
          ...originalMe,
          state: {
            ...originalMe.state,
            secretAgent: originalMe.state?.secretAgent || cachedSecretAgent || null,
          },
        };

        const isGameFinished =
          syncedRoom.state === "finished" || !!syncedRoom.game?.endedAt;

        const normalizedOpponent = {
          ...originalOpponent,
          state: {
            ...originalOpponent.state,
            secretAgent: isGameFinished ? originalOpponent.state?.secretAgent : null,
          },
        };

        const normalizedRoom: Room = {
          ...syncedRoom,
          me: normalizedMe,
          opponent: normalizedOpponent,
        };

        setRoom(normalizedRoom);
        console.log("Room normalized & synced:", normalizedRoom);
        return;
      }
    } else if (syncedRoom.me?.player?.id && typeof window !== "undefined") {
      sessionStorage.setItem("my_player_id", syncedRoom.me.player.id);
      if (syncedRoom.me.state?.secretAgent) {
        sessionStorage.setItem(`secret_agent_${syncedRoom.id}`, syncedRoom.me.state.secretAgent);
      }
    }

    setRoom(syncedRoom);
    console.log("Room synced:", syncedRoom);
  };

  const handleAuthSync = (reconnectToken: string) => { 
    console.log("Auth Sync", reconnectToken);
    localStorage.setItem("reconnectToken", reconnectToken);
  };

  const handleInviteSync = (data: {
    roomId: string;
    otherPlayerId: string;
    status: "PENDING" | "DECLINED";
  }) => {
    console.log("Invite sync received in SocketProvider:", data);
    if (!data || !data.roomId) return;

    const { roomId, otherPlayerId, status } = data;

    if (status === "DECLINED") {
      useInviteStore.getState().setLastDeclinedInvite({
        otherPlayerId,
        roomId,
        timestamp: Date.now(),
      });
      return;
    }

    if (status === "PENDING") {
      const id = `inv-${otherPlayerId}-${roomId}`;
      useInviteStore.getState().addIncomingInvite({
        id,
        inviteId: id,
        roomId,
        sender: {
          id: otherPlayerId,
          name: "Player",
          avatar: "/agents/icon/omen.png",
        },
        sentAt: Date.now(),
      });
    }
  };
 
  const handleError = (error: any) => {
    if (error.message === "Room not found") { 
      clearRoom();
    }

    setError(error);
  };

  const handleFriendsSync = (data: { friends: { userId: string; online: boolean }[] }) => {
    console.log("Friends sync received in SocketProvider:", data);
    if (Array.isArray(data?.friends)) {
      usePresenceStore.getState().setFriendsPresence(data.friends);
    }
  };

  const handleFriendPresence = (data: { userId: string; online: boolean }) => {
    console.log("Friend presence received in SocketProvider:", data);
    if (data?.userId) {
      usePresenceStore.getState().setSinglePresence(data.userId, data.online);
    }
  };

  const reconnect = () => {
    const reconnectToken = localStorage.getItem("reconnectToken");
    const currentRoom = useRoomStore.getState().room;

    if (!currentRoom || !reconnectToken) return;

    socket.emit(ClientEvents.ROOM_RECONNECT, {
      roomId: currentRoom.id,
      reconnectToken,
    });
  };
  
  useEffect(() => {
    if (!hydrated) return;

    socket.on(ServerEvents.ROOM_SYNC, handleRoomSync);
    socket.on(ServerEvents.AUTH, handleAuthSync);
    socket.on(ServerEvents.ERROR, handleError);
    socket.on(ServerEvents.INVITE_SYNC, handleInviteSync);
    socket.on(ServerEvents.FRIENDS_SYNC, handleFriendsSync);
    socket.on(ServerEvents.FRIENDS_PRESENCE, handleFriendPresence);
    socket.on("connect", reconnect);

    if (!socket.connected) {
      socket.connect();
    }

    const heartbeat = setInterval(() => {
      socket.emit(ClientEvents.PLAYER_HEARTBEAT)
    }, 30000)

    return () => {
      socket.off(ServerEvents.ROOM_SYNC, handleRoomSync);
      socket.off(ServerEvents.AUTH, handleAuthSync);
      socket.off(ServerEvents.ERROR, handleError);
      socket.off(ServerEvents.INVITE_SYNC, handleInviteSync);
      socket.off(ServerEvents.FRIENDS_SYNC, handleFriendsSync);
      socket.off(ServerEvents.FRIENDS_PRESENCE, handleFriendPresence);
      socket.off("connect", reconnect);
      socket.disconnect();
      clearInterval(heartbeat);
    };
  }, [hydrated]);

  if (!hydrated) {
    return "Loading..."; // or a loading spinner, etc.
  }
  
  return children;
}

export default SocketProvider;