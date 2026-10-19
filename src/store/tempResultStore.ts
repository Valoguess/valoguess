import { create } from "zustand";
import { GuessAgentGameDTO } from "@/types/game";

interface TempResultStore {
  tempResultGame: GuessAgentGameDTO | null;
  setTempResultGame: (game: GuessAgentGameDTO | null) => void;
  clearTempResultGame: () => void;
}


export const useTempResultStore = create<TempResultStore>((set) => ({
  tempResultGame: null,
  setTempResultGame: (game) => set({ tempResultGame: game }),
  clearTempResultGame: () => set({ tempResultGame: null }),
}));
