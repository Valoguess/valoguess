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


