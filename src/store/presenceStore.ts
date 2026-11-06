import { create } from "zustand";

export type PresenceStatus = "online" | "ingame" | "offline";

interface PresenceStore {
  presence: Record<string, PresenceStatus>;
  setFriendsPresence: (
    friends: { userId: string; status?: PresenceStatus | string; online?: boolean }[]
  ) => void;
  setSinglePresence: (
    userId: string,
    status: PresenceStatus | string | boolean
  ) => void;
  clearPresence: () => void;
}

export function normalizePresenceStatus(
  val: PresenceStatus | string | boolean | undefined
): PresenceStatus {
  if (val === true || val === "online") return "online";
  if (val === "ingame" || val === "in-game" || val === "playing") return "ingame";
  return "offline";
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  presence: {},

  setFriendsPresence: (friends) =>
    set((state) => {
      const next = { ...state.presence };
      for (const item of friends) {
        if (item?.userId) {
          next[item.userId] = normalizePresenceStatus(
            item.status !== undefined ? item.status : item.online
          );
        }
      }
      return { presence: next };
    }),

  setSinglePresence: (userId, status) =>
    set((state) => ({
      presence: {
        ...state.presence,
        [userId]: normalizePresenceStatus(status),
      },
    })),

  clearPresence: () => set({ presence: {} }),
}));
