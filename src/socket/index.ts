"use client";

import { io } from "socket.io-client";

const socketServerURL = "http://localhost:5000";

export const socket = io(socketServerURL, {
  autoConnect: false,
  transports: ["websocket"],
});
