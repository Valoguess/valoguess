"use client";

import { io } from "socket.io-client";

const socketServerURL = process.env.SOCKET_SERVER_URL || "http://localhost:5000";
console.log(socketServerURL);

export const socket = io(socketServerURL, {
  autoConnect: false,
  transports: ["websocket"],
});
