export const TAKEN_USERNAMES = new Set([
  "admin",
  "administrator",
  "valoguess",
  "riot",
  "riotgames",
  "jett",
  "reyna",
  "omen",
  "viper",
  "phoenix",
  "sova",
  "cypher",
  "guest",
  "player",
  "moderator",
  "root",
  "system",
  "tenz",
  "boaster",
  "aspas",
  "test",
  "user",
]);

export const RANDOM_ADJECTIVES = [
  "Viper",
  "Phantom",
  "Shadow",
  "Silent",
  "Neon",
  "Radiant",
  "Tactical",
  "Cyber",
  "Swift",
  "Apex",
];

export const RANDOM_NOUNS = [
  "Duelist",
  "Striker",
  "Ghost",
  "Spectre",
  "Operator",
  "Sniper",
  "Reaper",
  "Blade",
  "Hunter",
  "Ace",
];

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export const DEFAULT_AVATARS = {
  USER: "/agents/icon/omen.webp",
  GUEST: "/agents/icon/chamber.webp",
  OPPONENT: "/agents/icon/reyna.webp",
} as const;

export function getOrGenerateGuestPrefix(existingName?: string | null): string {
  const match = existingName?.match(/^Guest\.([a-zA-Z0-9]{5,6})/);
  if (match) {
    return match[0];
  }

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Guest.${code}`;
}
