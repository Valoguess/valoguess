"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { socket, connectSocket, disconnectSocket } from "@/socket";
import { ServerEvents } from "@/socket/events";
import {
  handlePartySync,
  handlePartyChatSync,
  handlePartyInviteSync,
  handleGameSync,
  handleSocketError,
  handleFriendsSync,
  handleFriendPresence,
  handleFriendRequest,
  handleFriendRequestAccepted,
  handleFriendRequestDeclined,
  handleOpponentDisconnected,
  sendHeartbeat,
} from "@/socket/handlers";

function SocketProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialSyncDone, setIsInitialSyncDone] = useState(false);
  const routerRef = useRef(router);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    routerRef.current = router;
    pathnameRef.current = pathname;
  }, [router, pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsInitialSyncDone(true);
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const onPartySync = (data: any) => {
      handlePartySync(data);
      setIsInitialSyncDone(true);
    };

    const onFriendsSync = (data: any) => {
      handleFriendsSync(data);
      setIsInitialSyncDone(true);
    };

    const onGameSync = (data: any) => {
      handleGameSync(data, {
        pathname: pathnameRef.current,
        router: routerRef.current,
      });
    };

    const onError = (err: any) => {
      handleSocketError(err, { pathname: pathnameRef.current });
    };

    socket.on(ServerEvents.PARTY_SYNC, onPartySync);
    socket.on(ServerEvents.PARTY_CHAT_SYNC, handlePartyChatSync);
    socket.on(ServerEvents.PARTY_INVITE_SYNC, handlePartyInviteSync);
    socket.on(ServerEvents.GAME_SYNC, onGameSync);
    socket.on(ServerEvents.GAME_END, onGameSync);
    socket.on(ServerEvents.ERROR, onError);

    socket.on(ServerEvents.FRIENDS_SYNC, onFriendsSync);
    socket.on(ServerEvents.FRIEND_PRESENCE, handleFriendPresence);
    socket.on(ServerEvents.FRIEND_REQUEST, handleFriendRequest);
    socket.on(ServerEvents.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted);
    socket.on(ServerEvents.FRIEND_REQUEST_DECLINED, handleFriendRequestDeclined);
    socket.on(ServerEvents.OPPONENT_DISCONNECTED, handleOpponentDisconnected);

    const onConnect = () => {
      sendHeartbeat();
    };
    socket.on("connect", onConnect);

    connectSocket();
    if (socket.connected) {
      sendHeartbeat();
    }

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, 15000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        connectSocket();
        sendHeartbeat();
      }
    };

    const handleWindowFocus = () => {
      connectSocket();
      sendHeartbeat();
    };

    const handleOnline = () => {
      connectSocket();
      sendHeartbeat();
    };

    const handleBeforeUnload = () => {
      disconnectSocket(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("online", handleOnline);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off(ServerEvents.PARTY_SYNC, onPartySync);
      socket.off(ServerEvents.PARTY_CHAT_SYNC, handlePartyChatSync);
      socket.off(ServerEvents.PARTY_INVITE_SYNC, handlePartyInviteSync);
      socket.off(ServerEvents.GAME_SYNC, onGameSync);
      socket.off(ServerEvents.GAME_END, onGameSync);
      socket.off(ServerEvents.ERROR, onError);

      socket.off(ServerEvents.FRIENDS_SYNC, onFriendsSync);
      socket.off(ServerEvents.FRIEND_PRESENCE, handleFriendPresence);
      socket.off(ServerEvents.FRIEND_REQUEST, handleFriendRequest);
      socket.off(ServerEvents.FRIEND_REQUEST_ACCEPTED, handleFriendRequestAccepted);
      socket.off(ServerEvents.FRIEND_REQUEST_DECLINED, handleFriendRequestDeclined);
      socket.off(ServerEvents.OPPONENT_DISCONNECTED, handleOpponentDisconnected);
      socket.off("connect", onConnect);

      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      disconnectSocket(false);
    };
  }, []);

  if (!isInitialSyncDone) {
    return (
      <main className="min-h-screen w-full bg-[#040609] flex flex-col items-center justify-center text-white select-none font-body">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12">
            <Image
              src="/logo.svg"
              alt="ValoGuess"
              width={40}
              height={40}
              priority
              className="animate-pulse object-contain"
            />
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <span className="font-valorant text-xs sm:text-sm text-white tracking-[0.25em] uppercase">
              INITIALIZING VALOGUESS
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              CONNECTING TO SERVER...
            </span>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

export default SocketProvider;
