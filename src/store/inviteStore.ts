import { create } from "zustand";
import { IncomingPartyInvite } from "@/app/(protected)/lobby/_components/types";

interface InviteStore {
  incomingInvites: IncomingPartyInvite[];
  lastDeclinedInvite: {
    otherPlayerId: string;
    partyId?: string;
    roomId?: string;
    timestamp: number;
  } | null;
  addIncomingInvite: (invite: IncomingPartyInvite) => void;
  removeIncomingInvite: (inviteId: string, partyOrRoomId?: string) => void;
  clearIncomingInvites: () => void;
  setLastDeclinedInvite: (
    declined: {
      otherPlayerId: string;
      partyId?: string;
      roomId?: string;
      timestamp: number;
    } | null,
  ) => void;
}

export const useInviteStore = create<InviteStore>((set) => ({
  incomingInvites: [],
  lastDeclinedInvite: null,

  addIncomingInvite: (invite) =>
    set((state) => ({
      incomingInvites: [
        invite,
        ...state.incomingInvites.filter(
          (i) =>
            i.id !== invite.id &&
            (i.partyId || i.roomId) !== (invite.partyId || invite.roomId) &&
            i.sender.id !== invite.sender.id,
        ),
      ],
    })),

  removeIncomingInvite: (inviteId, partyOrRoomId) =>
    set((state) => ({
      incomingInvites: state.incomingInvites.filter(
        (i) =>
          i.id !== inviteId &&
          (!partyOrRoomId ||
            (i.partyId !== partyOrRoomId && i.roomId !== partyOrRoomId)),
      ),
    })),

  clearIncomingInvites: () => set({ incomingInvites: [] }),

  setLastDeclinedInvite: (declined) => set({ lastDeclinedInvite: declined }),
}));
