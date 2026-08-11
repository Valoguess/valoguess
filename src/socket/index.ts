"use client";

import { io } from "socket.io-client";

const socketServerURL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

export const socket = io(socketServerURL, {
  autoConnect: false,
  transports: ["websocket"],
});
