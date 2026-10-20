export interface PartyMember {
  id: string;
  name: string;
  socketId?: string;
}

export interface Party {
  id: string;
  leaderId: string;
  members: PartyMember[];
}

export type SentPartyInvite = {
  friendId: string;
  friendName: string;
  friendAvatar: string;
  partyId: string;
  roomId?: string;
  sentAt: number;
};

export type IncomingPartyInvite = {
  id: string;
  inviteId?: string;
  partyId: string;
  roomId?: string;
  sender: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  sentAt?: number;
};

