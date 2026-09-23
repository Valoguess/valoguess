export type Message = {
  id: string;
  sender: string;
  time: string;
  text: string;
  colorClass: string;
  avatar: string;
};

export type Friend = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  status: "online" | "ingame" | "offline";
  activity?: string;
};

export type FriendRequest = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  type: "incoming" | "outgoing";
  createdAt?: string;
};

export type SentPartyInvite = {
  friendId: string;
  friendName: string;
  friendAvatar: string;
  roomId: string;
  sentAt: number;
};

export type IncomingPartyInvite = {
  id: string;
  inviteId?: string;
  roomId: string;
  sender: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  sentAt?: number;
};
