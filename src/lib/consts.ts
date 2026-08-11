import { Agent, Question, ActivityEntry } from "./data";


export const RANKS = {
  IRON: { name: "Iron III", color: "#A8A8A8" },
  BRONZE: { name: "Bronze III", color: "#CD7F32" },
  SILVER: { name: "Silver III", color: "#C0C0C0" },
  GOLD: { name: "Gold III", color: "#FFD700" },
  PLATINUM: { name: "Platinum III", color: "#E5E4E2" },
  DIAMOND: { name: "Diamond 1", color: "#8C7BFF" },
  ASCENDANT: { name: "Ascendant 2", color: "#3CF2C4" },
  IMMORTAL: { name: "Immortal 3", color: "#FF4655" },
  VALORANT: { name: "Radiant", color: "#FFFDD0" },
} as const;

export const GAME_CONFIG = {
  MAX_NOS: 5,
  MAX_ROUNDS: 10,
  DEFAULT_TIMER: 60, // in seconds
  MOCK_USER_NAME: "msvosch",
  MOCK_OPPONENT_NAME: "PhoenixOG",
} as const;


