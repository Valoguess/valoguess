import { create } from "zustand";
import { logger } from "@/lib/logger";
import { GuessAgentGameDTO } from "@/types/game";

if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("gameStore");
  } catch (error) {
    logger.error(
      { error },
      "Failed to purge legacy gameStore from localStorage",
    );
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
