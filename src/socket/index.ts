"use client";

import { io } from "socket.io-client";
import { token } from "@/lib/auth-client"

const socketServerURL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

export const socket = io(socketServerURL, {
  autoConnect: false,
  transports: ["websocket"],

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
