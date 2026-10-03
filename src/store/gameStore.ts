import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GuessAgentGameDTO } from "@/types/game";

interface GameStore {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;

  game: GuessAgentGameDTO | null;
  setGame: (game: GuessAgentGameDTO | null) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      hydrated: false,
      game: null,
      setGame: (game) => set({ game }),
      clearGame: () => set({ game: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "gameStore",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
