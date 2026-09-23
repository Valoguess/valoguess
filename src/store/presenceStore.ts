import { create } from "zustand";

interface PresenceStore {
  // Map of userId -> online boolean
  presence: Record<string, boolean>;
  setFriendsPresence: (friends: { userId: string; online: boolean }[]) => void;
  setSinglePresence: (userId: string, online: boolean) => void;
  clearPresence: () => void;
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  presence: {},

  setFriendsPresence: (friends) =>
    set((state) => {
      const next = { ...state.presence };
      for (const item of friends) {
        if (item?.userId) {
          next[item.userId] = Boolean(item.online);
        }
      }
      return { presence: next };
    }),

  setSinglePresence: (userId, online) =>
    set((state) => ({
      presence: {
        ...state.presence,
        [userId]: Boolean(online),
      },
    })),

  clearPresence: () => set({ presence: {} }),
}));
