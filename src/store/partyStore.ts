import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Party } from "@/types/party";
import { Message } from "@/app/(protected)/lobby/_components/types";

interface PartyStore {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;

  party: Party | null;
  setParty: (party: Party | null) => void;
  clearParty: () => void;

  partyMessages: Message[];
  addPartyMessage: (message: Message) => void;
  clearPartyMessages: () => void;
}

export const usePartyStore = create<PartyStore>()(
  persist(
    (set) => ({
      hydrated: false,
      party: null,
      partyMessages: [],
      setParty: (party) => set({ party }),
      clearParty: () => set({ party: null, partyMessages: [] }),
      addPartyMessage: (msg) =>
        set((state) => ({ partyMessages: [...state.partyMessages, msg] })),
      clearPartyMessages: () => set({ partyMessages: [] }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "partyStore",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
