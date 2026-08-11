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


export type Question = {
  id: string;
  label: string;
  category: QuestionCategory;
  description?: string;
};

export type QuestionCategory =
  | "offense"
  | "defense"
  | "information"
  | "mobility"
  | "control"
  | "support"
  | "utility"
  | "unique";

export const QUESTIONS: Question[] = [
  // =========================
  // Offense
  // =========================

  {
    id: "can-deal-damage",
    label: "Can Deal Damage",
    category: "offense",
    description: "Can the agent deal damage with an ability?"
  },
  {
    id: "has-damage-zone",
    label: "Has Damage Zone",
    category: "offense",
    description: "Can the agent create an area that damages enemies?"
  },
  {
    id: "can-destroy-utility",
    label: "Can Destroy Utility",
    category: "offense",
    description: "Can the agent destroy enemy abilities?"
  },
  {
    id: "can-disarm",
    label: "Can Disarm",
    category: "offense",
    description: "Can the agent temporarily remove an enemy's weapon?"
  },

  // =========================
  // Defense
  // =========================

  {
    id: "can-create-wall",
    label: "Can Create Wall",
    category: "defense",
    description: "Can the agent create a wall-like barrier?"
  },
  {
    id: "can-block-bullets",
    label: "Can Block Bullets",
    category: "defense",
    description: "Can the agent create something that blocks bullets?"
  },
  {
    id: "can-create-shield",
    label: "Can Create Shield",
    category: "defense",
    description: "Can the agent create a temporary shield?"
  },
  {
    id: "can-create-cover",
    label: "Can Create Cover",
    category: "defense",
    description: "Can the agent create temporary cover?"
  },

  // =========================
  // Information
  // =========================

  {
    id: "can-reveal",
    label: "Can Reveal",
    category: "information",
    description: "Can the agent reveal enemy locations?"
  },
  {
    id: "can-detect-enemies",
    label: "Can Detect",
    category: "information",
    description: "Can the agent detect nearby enemies?"
  },
  {
    id: "can-track-enemy",
    label: "Can Track",
    category: "information",
    description: "Can the agent track an enemy's location?"
  },
  {
    id: "can-nearsight",
    label: "Can Nearsight",
    category: "information",
    description: "Can the agent reduce an enemy's vision range?"
  },

  // =========================
  // Mobility
  // =========================

  {
    id: "can-dash",
    label: "Can Dash",
    category: "mobility",
    description: "Can the agent quickly dash to another position?"
  },
  {
    id: "can-teleport",
    label: "Can Teleport",
    category: "mobility",
    description: "Can the agent teleport to another location?"
  },
  {
    id: "can-fly",
    label: "Can Fly",
    category: "mobility",
    description: "Can the agent move through the air?"
  },
  {
    id: "can-move-faster",
    label: "Can Move Faster",
    category: "mobility",
    description: "Can the agent temporarily increase movement speed?"
  },
  {
    id: "can-move-through-walls",
    label: "Can Pass Through Walls",
    category: "mobility",
    description: "Can the agent move through walls or another dimension?"
  },

  // =========================
  // Control
  // =========================

  {
    id: "can-concuss",
    label: "Can Concuss",
    category: "control",
    description: "Can the agent apply the Concussed effect?"
  },
  {
    id: "can-slow",
    label: "Can Slow",
    category: "control",
    description: "Can the agent slow enemies?"
  },
  {
    id: "can-detain",
    label: "Can Detain",
    category: "control",
    description: "Can the agent detain an enemy?"
  },
  {
    id: "can-suppress",
    label: "Can Suppress",
    category: "control",
    description: "Can the agent suppress enemy abilities?"
  },
  {
    id: "can-displace",
    label: "Can Displace",
    category: "control",
    description: "Can the agent push, pull, or lift enemies?"
  },
  {
    id: "can-trap",
    label: "Can Trap",
    category: "control",
    description: "Can the agent trap or restrict enemy movement?"
  },

  // =========================
  // Support
  // =========================

  {
    id: "can-heal-ally",
    label: "Can Heal Ally",
    category: "support",
    description: "Can the agent directly heal a teammate?"
  },
  {
    id: "can-heal-self",
    label: "Can Heal Self",
    category: "support",
    description: "Can the agent restore their own health?"
  },
  {
    id: "can-revive-ally",
    label: "Can Revive Ally",
    category: "support",
    description: "Can the agent bring a dead teammate back to life?"
  },

  // =========================
  // Utility
  // =========================

  {
    id: "can-smoke",
    label: "Can Smoke",
    category: "utility",
    description: "Can the agent create an area that blocks vision?"
  },
  {
    id: "can-flash",
    label: "Can Flash",
    category: "utility",
    description: "Can the agent blind enemies?"
  },
  {
    id: "has-decoy",
    label: "Has Decoy",
    category: "utility",
    description: "Can the agent create a fake or decoy?"
  },
  {
    id: "has-deployable",
    label: "Has Deployable",
    category: "utility",
    description: "Can the agent place persistent utility on the map?"
  },
  {
    id: "has-controllable-utility",
    label: "Has Controllable Utility",
    category: "utility",
    description: "Can the agent directly control or view through deployed utility?"
  },
  {
    id: "can-block-vision",
    label: "Can Block Vision",
    category: "utility",
    description: "Can the agent block an enemy's line of sight?"
  },

  // =========================
  // Unique
  // =========================

  {
    id: "can-act-after-death",
    label: "Can Act After Death",
    category: "unique",
    description: "Can the agent continue using abilities after dying?"
  },
  {
    id: "can-reuse-ability",
    label: "Can Reuse Ability",
    category: "unique",
    description: "Can one of the agent's abilities be recovered and used again?"
  },
  {
    id: "has-creature",
    label: "Has Creature",
    category: "unique",
    description: "Can the agent deploy a creature or companion?"
  },
  {
    id: "can-interact-with-spike",
    label: "Can Affect Spike",
    category: "unique",
    description: "Can an ability directly interact with the Spike?"
  },
  {
    id: "has-alternate-form",
    label: "Has Alternate Form",
    category: "unique",
    description: "Can the agent enter a substantially different form?"
  },
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
