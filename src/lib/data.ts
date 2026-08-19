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


export const DIFFICULTY_PERCENTAGES = {
  low: 0.5,
  medium: 0.3,
  high: 0.2,
} as const;

export type QuestionDifficulty =
  | "low"
  | "medium"
  | "high";

export type QuestionCategory =
  | "offense"
  | "defense"
  | "information"
  | "mobility"
  | "control"
  | "support"
  | "utility"
  | "unique";

export type QuestionId = string;

export type Question = {
  id?: string;
  label: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  description?: string;
};

export const QUESTIONS: Record<QuestionId, Question> = {
  // =========================================================
  // OFFENSE
  // =========================================================

  "can-deal-ability-damage": {
    label: "Can Deal Ability Damage",
    category: "offense",
    difficulty: "low",
    description:
      "Can the Agent use a non-ultimate ability that directly damages an enemy?",
  },

  "can-damage-multiple-enemies": {
    label: "Can Damage Multiple Enemies",
    category: "offense",
    difficulty: "low",
    description:
      "Can one of the Agent's abilities damage two or more enemies at the same time?",
  },

  "can-deal-damage-over-time": {
    label: "Can Deal Damage Over Time",
    category: "offense",
    difficulty: "medium",
    description:
      "Can the Agent create an effect that continues damaging enemies after it is used?",
  },

  "can-destroy-enemy-utility": {
    label: "Can Destroy Enemy Utility",
    category: "offense",
    difficulty: "medium",
    description:
      "Can one of the Agent's abilities destroy an enemy's placed ability or deployable?",
  },

  "can-damage-through-area": {
    label: "Can Damage Through an Area",
    category: "offense",
    difficulty: "medium",
    description:
      "Can the Agent damage enemies without needing to directly attack them with a normal weapon?",
  },

  "ultimate-deals-damage": {
    label: "Does the Ultimate Deal Damage",
    category: "offense",
    difficulty: "low",
    description:
      "Does the Agent's ultimate have a direct damaging effect on enemies?",
  },

  "ultimate-can-kill": {
    label: "Can the Ultimate Kill",
    category: "offense",
    difficulty: "high",
    description:
      "Can the Agent's ultimate directly eliminate an enemy without needing a normal weapon attack?",
  },

  // =========================================================
  // DEFENSE
  // =========================================================

  "can-create-a-wall": {
    label: "Can Create a Wall",
    category: "defense",
    difficulty: "low",
    description:
      "Can the Agent create a wall or solid barrier that blocks movement or sight?",
  },

  "can-block-bullets": {
    label: "Can Block Bullets",
    category: "defense",
    difficulty: "medium",
    description:
      "Can the Agent create something that prevents bullets from passing through?",
  },

  "can-create-cover": {
    label: "Can Create Cover",
    category: "defense",
    difficulty: "low",
    description:
      "Can the Agent create temporary cover that helps a player avoid being seen or attacked?",
  },

  "can-protect-an-ally": {
    label: "Can Protect an Ally",
    category: "defense",
    difficulty: "medium",
    description:
      "Can the Agent directly protect a teammate from enemy damage or danger?",
  },

  "can-deny-an-area": {
    label: "Can Make an Area Unsafe",
    category: "defense",
    difficulty: "low",
    description:
      "Can the Agent make an area dangerous or difficult for enemies to enter or stay in?",
  },

  "can-hold-an-area": {
    label: "Can Hold an Area",
    category: "defense",
    difficulty: "medium",
    description:
      "Can the Agent use an ability to make it harder for enemies to enter or take control of an area?",
  },

  // =========================================================
  // INFORMATION
  // =========================================================

  "can-find-enemies": {
    label: "Can Find Enemy Locations",
    category: "information",
    difficulty: "low",
    description:
      "Can the Agent use an ability to get information about where enemies are?",
  },

  "can-reveal-enemies": {
    label: "Can Reveal Enemy Locations",
    category: "information",
    difficulty: "medium",
    description:
      "Can the Agent use an ability that shows enemy locations to the Agent or their team?",
  },

  "can-get-information-safely": {
    label: "Can Get Information From Safety",
    category: "information",
    difficulty: "medium",
    description:
      "Can the Agent use an ability to check an area or gather information without fully entering it?",
  },

  "can-track-an-enemy": {
    label: "Can Track an Enemy",
    category: "information",
    difficulty: "high",
    description:
      "Can one of the Agent's abilities continue following or tracking an enemy after finding them?",
  },

  "can-see-enemies-through-walls": {
    label: "Can Find Enemies Through Walls",
    category: "information",
    difficulty: "medium",
    description:
      "Can the Agent get information about an enemy's location even when the enemy is behind a wall?",
  },

  "can-detect-nearby-enemies": {
    label: "Can Detect Nearby Enemies",
    category: "information",
    difficulty: "low",
    description:
      "Can the Agent use an ability that detects enemies when they are within a certain area or range?",
  },

  // =========================================================
  // MOBILITY
  // =========================================================

  "has-a-movement-ability": {
    label: "Has a Movement Ability",
    category: "mobility",
    difficulty: "low",
    description:
      "Does the Agent have an ability that directly helps them move around the map?",
  },

  "can-move-faster": {
    label: "Can Move Faster",
    category: "mobility",
    difficulty: "low",
    description:
      "Can the Agent temporarily increase their movement speed?",
  },

  "can-dash": {
    label: "Can Dash",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the Agent quickly move a short distance using a dash-like ability?",
  },

  "can-teleport": {
    label: "Can Teleport",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the Agent instantly move from one location to another using an ability?",
  },

  "can-move-through-space": {
    label: "Can Move in an Unusual Way",
    category: "mobility",
    difficulty: "medium",
    description:
      "Can the Agent move in a way that is very different from normal walking, running, or jumping?",
  },

  "has-vertical-movement": {
    label: "Can Move High or Stay in the Air",
    category: "mobility",
    difficulty: "medium",
    description:
      "Can the Agent use an ability to gain significant vertical movement or stay airborne?",
  },

  "can-return-to-a-location": {
    label: "Can Return to a Location",
    category: "mobility",
    difficulty: "high",
    description:
      "Can the Agent mark or use a location and later return to it with an ability?",
  },

  // =========================================================
  // CONTROL
  // =========================================================

  "can-slow-enemies": {
    label: "Can Slow Enemies",
    category: "control",
    difficulty: "low",
    description:
      "Can the Agent use an ability that reduces an enemy's movement speed?",
  },

  "can-restrict-movement": {
    label: "Can Restrict Enemy Movement",
    category: "control",
    difficulty: "medium",
    description:
      "Can the Agent use an ability that prevents or strongly limits an enemy from moving?",
  },

  "can-push-or-pull-enemies": {
    label: "Can Push or Pull Enemies",
    category: "control",
    difficulty: "high",
    description:
      "Can the Agent directly move an enemy by pushing, pulling, lifting, or displacing them?",
  },

  "can-concuss-enemies": {
    label: "Can Concuss Enemies",
    category: "control",
    difficulty: "medium",
    description:
      "Can the Agent use an ability that applies the Concussed effect to an enemy?",
  },

  "can-suppress-enemies": {
    label: "Can Disable Enemy Abilities",
    category: "control",
    difficulty: "high",
    description:
      "Can the Agent temporarily stop enemies from using their abilities?",
  },

  "can-detain-enemies": {
    label: "Can Detain an Enemy",
    category: "control",
    difficulty: "high",
    description:
      "Can the Agent use an ability that detains an enemy and prevents them from acting normally?",
  },

  "can-deafen-enemies": {
    label: "Can Affect Enemy Audio",
    category: "control",
    difficulty: "high",
    description:
      "Can the Agent use an ability that makes it harder for enemies to hear?",
  },

  "can-impair-enemy-actions": {
    label: "Can Make Enemies Less Effective",
    category: "control",
    difficulty: "medium",
    description:
      "Can the Agent use an ability that gives enemies an effect that makes fighting or moving harder?",
  },

  // =========================================================
  // SUPPORT
  // =========================================================

  "can-heal": {
    label: "Can Restore Health",
    category: "support",
    difficulty: "medium",
    description:
      "Can the Agent use an ability to restore a player's health?",
  },

  "can-heal-an-ally": {
    label: "Can Heal an Ally",
    category: "support",
    difficulty: "high",
    description:
      "Can the Agent directly restore the health of a teammate?",
  },

  "can-heal-self": {
    label: "Can Heal Self",
    category: "support",
    difficulty: "high",
    description:
      "Can the Agent use an ability to restore their own health?",
  },

  "can-revive-an-ally": {
    label: "Can Revive an Ally",
    category: "support",
    difficulty: "high",
    description:
      "Can the Agent bring a dead teammate back into the round?",
  },

  "can-help-an-ally-directly": {
    label: "Can Directly Help an Ally",
    category: "support",
    difficulty: "low",
    description:
      "Does the Agent have an ability that directly gives a teammate a useful effect?",
  },

  // =========================================================
  // UTILITY
  // =========================================================

  "can-block-line-of-sight": {
    label: "Can Block Line of Sight",
    category: "utility",
    difficulty: "low",
    description:
      "Can the Agent create something that stops enemies from seeing through an area?",
  },

  "can-impair-vision": {
    label: "Can Impair Enemy Vision",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the Agent use an ability that makes it harder for enemies to see clearly?",
  },

  "can-place-utility": {
    label: "Can Place Utility",
    category: "utility",
    difficulty: "low",
    description:
      "Can the Agent place an ability somewhere on the map instead of using it immediately?",
  },

  "has-utility-that-stays": {
    label: "Has Utility That Stays",
    category: "utility",
    difficulty: "low",
    description:
      "Can the Agent leave an ability active in a location after placing it?",
  },

  "can-control-placed-utility": {
    label: "Can Control Placed Utility",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the Agent control, move, or interact with their own placed utility after deploying it?",
  },

  "can-recover-utility": {
    label: "Can Recover Their Utility",
    category: "utility",
    difficulty: "high",
    description:
      "Can the Agent pick up, recall, or recover their own placed utility?",
  },

  "can-reuse-an-ability": {
    label: "Can Reuse an Ability",
    category: "utility",
    difficulty: "medium",
    description:
      "Can one of the Agent's abilities become available again during the same round?",
  },

  "can-create-a-decoy": {
    label: "Can Create a Decoy",
    category: "utility",
    difficulty: "high",
    description:
      "Can the Agent create something that is meant to trick or distract enemies?",
  },

  "uses-thrown-or-launched-abilities": {
    label: "Uses Thrown or Launched Abilities",
    category: "utility",
    difficulty: "low",
    description:
      "Does the Agent have an ability that is thrown, launched, or sent toward a location?",
  },

  "can-use-abilities-through-walls": {
    label: "Can Use Abilities Through Walls",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the Agent affect an enemy or area with an ability without needing a direct line of sight?",
  },

  "can-place-utility-at-range": {
    label: "Can Place Utility From Far Away",
    category: "utility",
    difficulty: "medium",
    description:
      "Can the Agent place or activate useful abilities at a location far away from themselves?",
  },

  // =========================================================
  // UNIQUE
  // =========================================================

  "has-a-companion": {
    label: "Can Use a Companion",
    category: "unique",
    difficulty: "high",
    description:
      "Can the Agent use an ability that creates or controls a creature or companion?",
  },

  "can-create-a-copy": {
    label: "Can Create a Copy",
    category: "unique",
    difficulty: "high",
    description:
      "Can the Agent create a copy, clone, or fake version of themselves?",
  },

  "can-become-invulnerable": {
    label: "Can Become Invulnerable",
    category: "unique",
    difficulty: "high",
    description:
      "Can the Agent become immune to damage for a short period of time?",
  },

  "can-act-after-death": {
    label: "Can Act After Death",
    category: "unique",
    difficulty: "high",
    description:
      "Can the Agent still use or control something after their body has been eliminated?",
  },

  "can-return-after-death": {
    label: "Can Return After Death",
    category: "unique",
    difficulty: "high",
    description:
      "Can the Agent come back into the round after being eliminated?",
  },

  "can-affect-the-spike": {
    label: "Can Directly Affect the Spike",
    category: "unique",
    difficulty: "high",
    description:
      "Can one of the Agent's abilities directly interact with the Spike?",
  },

  "has-different-ability-modes": {
    label: "Has Different Ability Modes",
    category: "unique",
    difficulty: "high",
    description:
      "Can one of the Agent's abilities be used in different modes or have clearly different effects?",
  },

  "uses-map-targeting": {
    label: "Can Target Using a Map",
    category: "unique",
    difficulty: "medium",
    description:
      "Can the Agent choose where to use an ability through a map-style targeting view?",
  },

  "has-rechargeable-abilities": {
    label: "Has Rechargeable Abilities",
    category: "unique",
    difficulty: "medium",
    description:
      "Can one of the Agent's abilities recharge and become available again during a round?",
  },

  "has-a-special-ultimate-effect": {
    label: "Has a Unique Ultimate Effect",
    category: "unique",
    difficulty: "high",
    description:
      "Does the Agent's ultimate do something very different from simply dealing damage or helping with normal combat?",
  },
};

export type QuestionItem = Question & { id: QuestionId };

export const ALL_QUESTIONS: QuestionItem[] = Object.entries(QUESTIONS).map(
  ([id, q]) => ({
    id,
    ...q,
  })
);

export function getQuestionById(id: string): QuestionItem | undefined {
  const q = QUESTIONS[id];
  if (!q) return undefined;
  return { id, ...q };
}

export function getQuestionLabel(id: string): string {
  return QUESTIONS[id]?.label || id;
}

// Pseudo-random number generator for deterministic seed
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

/**
 * Returns a randomized set of questions sampled across easy (low), med (medium),
 * and hard (high) difficulty tiers based on DIFFICULTY_PERCENTAGES.
 */
export function getRandomQuestions(
  totalCount = 24,
  seed?: string | number
): QuestionItem[] {
  const prng =
    seed !== undefined
      ? typeof seed === "number"
        ? createPrng(seed)
        : createPrng(stringToSeed(seed))
      : Math.random;

  const lowPool: QuestionItem[] = [];
  const mediumPool: QuestionItem[] = [];
  const highPool: QuestionItem[] = [];

  for (const [id, q] of Object.entries(QUESTIONS)) {
    const item: QuestionItem = { id, ...q };
    if (q.difficulty === "low") lowPool.push(item);
    else if (q.difficulty === "medium") mediumPool.push(item);
    else if (q.difficulty === "high") highPool.push(item);
  }

  const shuffle = <T>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const lowShuffled = shuffle(lowPool);
  const medShuffled = shuffle(mediumPool);
  const highShuffled = shuffle(highPool);

  const lowTarget = Math.round(totalCount * DIFFICULTY_PERCENTAGES.low);
  const medTarget = Math.round(totalCount * DIFFICULTY_PERCENTAGES.medium);
  const highTarget = Math.max(1, totalCount - lowTarget - medTarget);

  const selected: QuestionItem[] = [
    ...lowShuffled.slice(0, lowTarget),
    ...medShuffled.slice(0, medTarget),
    ...highShuffled.slice(0, highTarget),
  ];

  // If not enough questions in a specific pool, fill from remaining
  if (selected.length < totalCount) {
    const selectedIds = new Set(selected.map((s) => s.id));
    const remaining = [...lowShuffled, ...medShuffled, ...highShuffled].filter(
      (q) => !selectedIds.has(q.id)
    );
    selected.push(...remaining.slice(0, totalCount - selected.length));
  }

  return shuffle(selected);
}