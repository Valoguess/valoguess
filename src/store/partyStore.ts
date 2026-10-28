import { create } from "zustand";
import { logger } from "@/lib/logger";
import { Party } from "@/types/party";
import { Message } from "@/types/chat";

if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("partyStore");
  } catch (error) {
    logger.error(
      { error },
      "Failed to purge legacy partyStore from localStorage",
    );
  }
}

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

export const usePartyStore = create<PartyStore>((set) => ({
  hydrated: true,
  party: null,
  partyMessages: [],
  setParty: (party) => set({ party }),
  clearParty: () => set({ party: null, partyMessages: [] }),
  addPartyMessage: (msg) =>
    set((state) => ({ partyMessages: [...state.partyMessages, msg] })),
  clearPartyMessages: () => set({ partyMessages: [] }),
  setHydrated: (hydrated) => set({ hydrated }),
}));
