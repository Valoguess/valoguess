import { create } from "zustand";
import { GuessAgentGameDTO } from "@/types/game";

// Purge any legacy stale gameStore from localStorage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("gameStore");
  } catch {
    // Ignore storage errors
  }
}

interface GameStore {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;

  game: GuessAgentGameDTO | null;
  setGame: (game: GuessAgentGameDTO | null) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  hydrated: true,
  game: null,
  setGame: (game) => set({ game }),
  clearGame: () => set({ game: null }),
  setHydrated: (hydrated) => set({ hydrated }),
}));
