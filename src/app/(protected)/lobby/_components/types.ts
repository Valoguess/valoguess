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

export const INITIAL_FRIENDS_LIST: Friend[] = [
  {
    id: "1",
    name: "OMEN",
    username: "@omen_shadow",
    avatar: "/agents/icon/omen.png",
    status: "online",
    activity: "In Lobby",
  },
  {
    id: "2",
    name: "JETT",
    username: "@wind_striker",
    avatar: "/agents/icon/jett.png",
    status: "ingame",
    activity: "In 1v1 Duel",
  },
  {
    id: "3",
    name: "KILLJOY",
    username: "@kj_turret",
    avatar: "/agents/icon/killjoy.png",
    status: "online",
    activity: "In Lobby",
  },
  {
    id: "4",
    name: "CYPHER",
    username: "@spycam_king",
    avatar: "/agents/icon/cypher.png",
    status: "offline",
    activity: "Offline",
  },
  {
    id: "5",
    name: "SAGE",
    username: "@healer_prime",
    avatar: "/agents/icon/sage.png",
    status: "offline",
    activity: "Offline",
  },
];

export const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: "req-1",
    name: "REYNA",
    username: "@reyna_leech",
    avatar: "/agents/icon/reyna.png",
    type: "incoming",
  },
  {
    id: "req-2",
    name: "PHOENIX",
    username: "@fire_walker",
    avatar: "/agents/icon/phoenix.png",
    type: "outgoing",
  },
];
