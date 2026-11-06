import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { GuessAgentGameDTO } from "@/types/game";

interface TempResultStore {
  hydrated: boolean;
  tempResultGame: GuessAgentGameDTO | null;
  setTempResultGame: (game: GuessAgentGameDTO | null) => void;
  clearTempResultGame: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useTempResultStore = create<TempResultStore>()(
  persist(
    (set) => ({
      hydrated: false,
      tempResultGame: null,
      setTempResultGame: (game) => set({ tempResultGame: game }),
      clearTempResultGame: () => set({ tempResultGame: null }),
      setHydrated: (hydrated: boolean) => set({ hydrated }),
    }),
    {
      name: "valoguess-temp-result",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
