"use client";

import { socket } from '@/socket';
import { ClientEvents, ServerEvents } from '@/socket/events';
import { useRoomStore } from '@/store/roomStore';
import { Room } from '@/types/game';
import React, { useEffect, useState } from 'react'

function SocketProvider({
  children,
}: {
  children: React.ReactNode;
  }) {
  const [error, setError] = useState(null);
  const { room, setRoom, clearRoom, hydrated } = useRoomStore();

  const handleRoomSync = (room: Room) => {
    console.log("Hello 1234")
    setRoom(room);
    console.log("Room synced:", room);
  };

  const handleAuthSync = (reconnectToken: string) => { 
    console.log("Auth Sync", reconnectToken)

    localStorage.setItem("reconnectToken", reconnectToken);
  }
 
  const handleError = (error: any) => {
    if (error.message === "Room not found") { 
      clearRoom();
    }

    setError(error);
  }
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
    socket.on("connect", reconnect);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off(ServerEvents.ROOM_SYNC, handleRoomSync);
      socket.off(ServerEvents.AUTH, handleAuthSync);
      socket.off(ServerEvents.ERROR, handleError);
      socket.off("connect", reconnect);
      socket.disconnect();
    };
  }, [hydrated]);

  if (!hydrated) {
    return "Loading..."; // or a loading spinner, etc.
  }
  
  return children;
}

export default SocketProvider