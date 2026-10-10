import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GuessAgentQuestionMode } from "@/types/game";

export interface GameSettingsState {
  questionMode: GuessAgentQuestionMode;
  timer: number;
  maxNos: number;
  maxGuesses: number;
  questionCount: number;
  showMoreOptions: boolean;

  setQuestionMode: (mode: GuessAgentQuestionMode) => void;
  setTimer: (timer: number | ((prev: number) => number)) => void;
  setMaxNos: (maxNos: number | ((prev: number) => number)) => void;
  setMaxGuesses: (maxGuesses: number | ((prev: number) => number)) => void;
  setQuestionCount: (count: number | ((prev: number) => number)) => void;
  setShowMoreOptions: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export const useGameSettingsStore = create<GameSettingsState>()(
  persist(
    (set, get) => ({
      questionMode: "PRESET",
      timer: -1,
      maxNos: 5,
      maxGuesses: 1,
      questionCount: 15,
      showMoreOptions: false,

      setQuestionMode: (questionMode) => set({ questionMode }),
      setTimer: (val) =>
        set({
          timer: typeof val === "function" ? val(get().timer) : val,
        }),
      setMaxNos: (val) =>
        set({
          maxNos: typeof val === "function" ? val(get().maxNos) : val,
        }),
      setMaxGuesses: (val) =>
        set({
          maxGuesses: typeof val === "function" ? val(get().maxGuesses) : val,
        }),
      setQuestionCount: (val) =>
        set({
          questionCount: typeof val === "function" ? val(get().questionCount) : val,
        }),
      setShowMoreOptions: (val) =>
        set({
          showMoreOptions: typeof val === "function" ? val(get().showMoreOptions) : val,
        }),
    }),
    {
      name: "valoguess_game_settings",
    }
  )
);
