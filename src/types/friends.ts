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
];
