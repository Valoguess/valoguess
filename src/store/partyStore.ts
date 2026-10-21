import { create } from "zustand";
import { Party } from "@/types/party";
import { Message } from "@/types/chat";

// Purge any legacy stale partyStore from localStorage
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("partyStore");
  } catch {
    // Ignore storage errors
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
