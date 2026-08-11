export type Role = "Duelist" | "Initiator" | "Controller" | "Sentinel";

export type Agent = {
  id: string;
  name: string;
  role: Role;
  // colorFrom: string;
  // colorTo: string;
};

// Generic placeholder roster inspired by a 5v5 tactical shooter's role
// archetypes. Names/art are original, not sourced from any existing game.
export const AGENTS: Agent[] = [
  { id: "astra", name: "astra", role: "Controller" },
  { id: "breach", name: "breach", role: "Initiator" },
  { id: "brimstone", name: "brimstone", role: "Controller" },
  { id: "chamber", name: "chamber", role: "Sentinel" },
  { id: "clove", name: "clove", role: "Controller" },
  { id: "cypher", name: "cypher", role: "Sentinel" },
  { id: "deadlock", name: "deadlock", role: "Sentinel" },
  { id: "fade", name: "fade", role: "Initiator" },
  { id: "gekko", name: "gekko", role: "Initiator" },
  { id: "harbor", name: "harbor", role: "Controller" },
  { id: "iso", name: "iso", role: "Duelist" },
  { id: "jett", name: "jett", role: "Duelist" },
  { id: "kayo", name: "kayo", role: "Initiator" },
  { id: "killjoy", name: "killjoy", role: "Sentinel" },
  { id: "miks", name: "miks", role: "Sentinel" },
  { id: "neon", name: "neon", role: "Duelist" },
  { id: "omen", name: "omen", role: "Controller" },
  { id: "phoenix", name: "phoenix", role: "Duelist" },
  { id: "raze", name: "raze", role: "Duelist" },
  { id: "reyna", name: "reyna", role: "Duelist" },
  { id: "sage", name: "sage", role: "Sentinel" },
  { id: "skye", name: "skye", role: "Initiator" },
  { id: "sova", name: "sova", role: "Initiator" },
  { id: "tejo", name: "tejo", role: "Initiator" },
  { id: "veto", name: "veto", role: "Controller" },
  { id: "viper", name: "viper", role: "Controller" },
  { id: "vyse", name: "vyse", role: "Sentinel" },
  { id: "waylay", name: "waylay", role: "Duelist" },
  { id: "yoru", name: "yoru", role: "Duelist" },
];



export type QuestionCategory =
  | "ability"
  | "utility"
  | "movement"
  | "vision"
  | "combat"
  | "theme"
  | "custom";

export type Question = {
  id: string;
  label: string;
  category: QuestionCategory;
  description?: string;
};

export const QUESTIONS: Question[] = [
  // ===== Utility =====

  { id: "can-heal", label: "Can Heal", category: "utility", description: "Does your agent have the ability to heal allies?" },
  { id: "can-flash", label: "Can Flash", category: "utility", description: "Does your agent have abilities that flash or blind enemies?" },
  { id: "has-smoke", label: "Has Smoke", category: "utility", description: "Does your agent have smoke abilities to block vision?" },
  { id: "can-stun", label: "Can Stun", category: "utility", description: "Can your agent concuss or stun opponents?" },
  { id: "can-blind", label: "Can Blind", category: "utility", description: "Does your agent have abilities that near-sight or blind targets?" },
  { id: "has-molly", label: "Has Molly", category: "utility", description: "Can your agent deploy damaging area-of-effect zones (mollies)?" },
  { id: "has-wall", label: "Has Wall", category: "utility", description: "Can your agent deploy a physical or visual barrier wall?" },
  { id: "has-trap", label: "Has Trap", category: "utility", description: "Can your agent set traps or sensors to detect enemies?" },
  { id: "can-scan", label: "Can Scan", category: "utility", description: "Does your agent have abilities that scan and reveal enemy positions?" },
  { id: "can-revive", label: "Can Revive", category: "utility", description: "Does your agent have the ability to resurrect fallen teammates?" },
  { id: "has-decoy", label: "Has Decoy", category: "utility", description: "Can your agent create clones or decoys to distract enemies?" },
  { id: "can-suppress", label: "Can Suppress", category: "utility", description: "Can your agent disable or suppress enemy abilities?" },

  // ===== Movement =====

  { id: "can-dash", label: "Can Dash", category: "movement", description: "Does your agent have a dash or quick relocation ability?" },
  { id: "can-teleport", label: "Can Teleport", category: "movement", description: "Can your agent teleport to different locations?" },
  { id: "can-fly", label: "Can Fly", category: "movement", description: "Can your agent lift off the ground or glide in the air?" },
  { id: "has-speed", label: "Has Speed", category: "movement", description: "Does your agent have abilities that boost movement speed?" },

  // ===== Vision =====

  { id: "creates-smoke", label: "Creates Vision Block", category: "vision", description: "Can your agent create large smoke clouds to block sightlines?" },
  { id: "reveals-enemies", label: "Reveals Enemies", category: "vision", description: "Does your agent have abilities that outline or reveal enemies?" },
  { id: "hides-vision", label: "Blocks Vision", category: "vision", description: "Does your agent have abilities that block or reduce enemy vision?" },

  // ===== Combat =====

  { id: "util-damage", label: "Utility Deals Damage", category: "combat", description: "Does your agent have non-ultimate abilities that deal direct damage?" },
  { id: "can-detain", label: "Can Detain", category: "combat", description: "Can your agent detain or lock enemies in place?" },
  { id: "can-concuss", label: "Can Concuss", category: "combat", description: "Can your agent concuss enemies to slow and disorient them?" },
  { id: "can-root", label: "Can Root", category: "combat", description: "Can your agent root enemies to prevent movement?" },
  { id: "can-displace", label: "Can Displace", category: "combat", description: "Can your agent push, pull, or lift enemies from their positions?" },

  // ===== Themes =====

  { id: "uses-fire", label: "Uses Fire", category: "theme", description: "Is your agent's theme or ability design centered around fire?" },
  { id: "uses-water", label: "Uses Water", category: "theme", description: "Is your agent's theme or ability design centered around water or tides?" },
  { id: "uses-electricity", label: "Uses Electricity", category: "theme", description: "Is your agent's theme or ability design centered around lightning or electricity?" },
  { id: "uses-poison", label: "Uses Poison", category: "theme", description: "Is your agent's theme or ability design centered around toxins or poison?" },
  { id: "uses-tech", label: "Uses Technology", category: "theme", description: "Is your agent's theme or ability design centered around high-tech gear?" },
  { id: "uses-shadows", label: "Uses Shadows", category: "theme", description: "Is your agent's theme or ability design centered around shadows or darkness?" },
  { id: "uses-plants", label: "Uses Nature", category: "theme", description: "Is your agent's theme or ability design centered around plants or nature?" },
];

export type ActivityEntry = {
  id: string;
  kind: "asked" | "answered-yes" | "answered-no" | "prompt";
  actor: "you" | "opponent" | "system";
  text: string;
  time: string;
};

export const INITIAL_ACTIVITY: ActivityEntry[] = [
  { id: "a1", kind: "asked", actor: "opponent", text: "Can Heal?", time: "01:12" },
  { id: "a2", kind: "answered-no", actor: "you", text: "No", time: "01:14" },
  { id: "a3", kind: "asked", actor: "opponent", text: "Has Smoke?", time: "01:16" },
  { id: "a4", kind: "answered-yes", actor: "you", text: "Yes", time: "01:18" },
  { id: "a5", kind: "asked", actor: "opponent", text: "Can Stun?", time: "01:20" },
  { id: "a6", kind: "answered-no", actor: "you", text: "No", time: "01:22" },
];
