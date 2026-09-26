import { create } from "zustand";
import { Friend, FriendRequest } from "@/types/friends";

export interface FriendEvent {
  type: "request_received" | "request_accepted" | "request_declined";
  userId: string;
  requester?: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  timestamp: number;
}

export interface SyncedFriendData {
  friends: Friend[];
  requests: FriendRequest[];
}

interface FriendStore {
  initialFriendsData: SyncedFriendData | null;
  setInitialFriendsData: (data: SyncedFriendData) => void;
  friendSyncVersion: number;
  lastFriendEvent: FriendEvent | null;
  triggerFriendSync: (event?: {
    type: "request_received" | "request_accepted" | "request_declined";
    userId: string;
    requester?: {
      id: string;
      name: string;
      username?: string;
      avatar?: string;
    };
  }) => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  initialFriendsData: null,
  setInitialFriendsData: (data) => set({ initialFriendsData: data }),
  friendSyncVersion: 0,
  lastFriendEvent: null,

  triggerFriendSync: (event) =>
    set((state) => ({
      friendSyncVersion: state.friendSyncVersion + 1,
      lastFriendEvent: event ? { ...event, timestamp: Date.now() } : null,
    })),
}));
