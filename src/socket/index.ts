"use client";

import { io } from "socket.io-client";
import { token } from "@/lib/auth-client"

const getSocketServerURL = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
  }
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isLocalhost) {
      return "https://socket.nhero.xyz";
    }
  }
  return "http://localhost:5000";
};

const socketServerURL = getSocketServerURL();

export const socket = io(socketServerURL, {
  autoConnect: false,
  transports: ["websocket", "polling"],

  auth: async (cb) => {
    const { data, error } = await token()

    if (error || !data) {
      cb({});
      return;
    }

    cb({
      token: data.token,
    });
  }
});
