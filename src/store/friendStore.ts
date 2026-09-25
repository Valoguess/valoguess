import { create } from "zustand";

export interface FriendEvent {
  type: "request_received" | "request_accepted" | "request_declined";
  userId: string;
  timestamp: number;
}

interface FriendStore {
  friendSyncVersion: number;
  lastFriendEvent: FriendEvent | null;
  triggerFriendSync: (event?: {
    type: "request_received" | "request_accepted" | "request_declined";
    userId: string;
  }) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friendSyncVersion: 0,
  lastFriendEvent: null,

  triggerFriendSync: (event) =>
    set((state) => ({
      friendSyncVersion: state.friendSyncVersion + 1,
      lastFriendEvent: event ? { ...event, timestamp: Date.now() } : null,
    })),
}));
