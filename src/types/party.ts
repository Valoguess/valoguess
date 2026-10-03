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
