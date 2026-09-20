import { create } from "zustand";
import { IncomingPartyInvite } from "@/app/(protected)/lobby/_components/types";

interface InviteStore {
  incomingInvites: IncomingPartyInvite[];
  lastDeclinedInvite: { otherPlayerId: string; roomId: string; timestamp: number } | null;
  addIncomingInvite: (invite: IncomingPartyInvite) => void;
  removeIncomingInvite: (inviteId: string, roomId?: string) => void;
  clearIncomingInvites: () => void;
  setLastDeclinedInvite: (
    declined: { otherPlayerId: string; roomId: string; timestamp: number } | null,
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
            i.roomId !== invite.roomId &&
            i.sender.id !== invite.sender.id,
        ),
      ],
    })),

  removeIncomingInvite: (inviteId, roomId) =>
    set((state) => ({
      incomingInvites: state.incomingInvites.filter(
        (i) => i.id !== inviteId && (!roomId || i.roomId !== roomId),
      ),
    })),

  clearIncomingInvites: () => set({ incomingInvites: [] }),

  setLastDeclinedInvite: (declined) => set({ lastDeclinedInvite: declined }),
}));
