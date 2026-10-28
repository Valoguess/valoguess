export type AgentRole = "Duelist" | "Initiator" | "Controller" | "Sentinel";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  bannerPath: string;
  iconPath: string;
}

export type AgentBanner = Agent;

export const AGENTS: Agent[] = [
  // Duelists
  {
    id: "jett",
    name: "Jett",
    role: "Duelist",
    bannerPath: "/agents/banner/jett.webp",
    iconPath: "/agents/icon/jett.webp",
  },
  {
    id: "reyna",
    name: "Reyna",
    role: "Duelist",
    bannerPath: "/agents/banner/reyna.webp",
    iconPath: "/agents/icon/reyna.webp",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    role: "Duelist",
    bannerPath: "/agents/banner/phoenix.webp",
    iconPath: "/agents/icon/phoenix.webp",
  },
  {
    id: "raze",
    name: "Raze",
    role: "Duelist",
    bannerPath: "/agents/banner/raze.webp",
    iconPath: "/agents/icon/raze.webp",
  },
  {
    id: "neon",
    name: "Neon",
    role: "Duelist",
    bannerPath: "/agents/banner/neon.webp",
    iconPath: "/agents/icon/neon.webp",
  },
  {
    id: "yoru",
    name: "Yoru",
    role: "Duelist",
    bannerPath: "/agents/banner/yoru.webp",
    iconPath: "/agents/icon/yoru.webp",
  },
  {
    id: "iso",
    name: "Iso",
    role: "Duelist",
    bannerPath: "/agents/banner/iso.webp",
    iconPath: "/agents/icon/iso.webp",
  },
  {
    id: "waylay",
    name: "Waylay",
    role: "Duelist",
    bannerPath: "/agents/banner/waylay.webp",
    iconPath: "/agents/icon/waylay.webp",
  },

  // Initiators
  {
    id: "sova",
    name: "Sova",
    role: "Initiator",
    bannerPath: "/agents/banner/sova.webp",
    iconPath: "/agents/icon/sova.webp",
  },
  {
    id: "fade",
    name: "Fade",
    role: "Initiator",
    bannerPath: "/agents/banner/fade.webp",
    iconPath: "/agents/icon/fade.webp",
  },
  {
    id: "breach",
    name: "Breach",
    role: "Initiator",
    bannerPath: "/agents/banner/breach.webp",
    iconPath: "/agents/icon/breach.webp",
  },
  {
    id: "skye",
    name: "Skye",
    role: "Initiator",
    bannerPath: "/agents/banner/skye.webp",
    iconPath: "/agents/icon/skye.webp",
  },
  {
    id: "kayo",
    name: "KAY/O",
    role: "Initiator",
    bannerPath: "/agents/banner/kayo.webp",
    iconPath: "/agents/icon/kayo.webp",
  },
  {
    id: "gekko",
    name: "Gekko",
    role: "Initiator",
    bannerPath: "/agents/banner/gekko.webp",
    iconPath: "/agents/icon/gekko.webp",
  },
  {
    id: "tejo",
    name: "Tejo",
    role: "Initiator",
    bannerPath: "/agents/banner/tejo.webp",
    iconPath: "/agents/icon/tejo.webp",
  },

  // Controllers
  {
    id: "omen",
    name: "Omen",
    role: "Controller",
    bannerPath: "/agents/banner/omen.webp",
    iconPath: "/agents/icon/omen.webp",
  },
  {
    id: "viper",
    name: "Viper",
    role: "Controller",
    bannerPath: "/agents/banner/viper.webp",
    iconPath: "/agents/icon/viper.webp",
  },
  {
    id: "brimstone",
    name: "Brimstone",
    role: "Controller",
    bannerPath: "/agents/banner/brimstone.webp",
    iconPath: "/agents/icon/brimstone.webp",
  },
  {
    id: "astra",
    name: "Astra",
    role: "Controller",
    bannerPath: "/agents/banner/astra.webp",
    iconPath: "/agents/icon/astra.webp",
  },
  {
    id: "harbor",
    name: "Harbor",
    role: "Controller",
    bannerPath: "/agents/banner/harbor.webp",
    iconPath: "/agents/icon/harbor.webp",
  },
  {
    id: "clove",
    name: "Clove",
    role: "Controller",
    bannerPath: "/agents/banner/clove.webp",
    iconPath: "/agents/icon/clove.webp",
  },
  {
    id: "veto",
    name: "Veto",
    role: "Controller",
    bannerPath: "/agents/banner/veto.webp",
    iconPath: "/agents/icon/veto.webp",
  },

  // Sentinels
  {
    id: "killjoy",
    name: "Killjoy",
    role: "Sentinel",
    bannerPath: "/agents/banner/killjoy.webp",
    iconPath: "/agents/icon/killjoy.webp",
  },
  {
    id: "cypher",
    name: "Cypher",
    role: "Sentinel",
    bannerPath: "/agents/banner/cypher.webp",
    iconPath: "/agents/icon/cypher.webp",
  },
  {
    id: "sage",
    name: "Sage",
    role: "Sentinel",
    bannerPath: "/agents/banner/sage.webp",
    iconPath: "/agents/icon/sage.webp",
  },
  {
    id: "chamber",
    name: "Chamber",
    role: "Sentinel",
    bannerPath: "/agents/banner/chamber.webp",
    iconPath: "/agents/icon/chamber.webp",
  },
  {
    id: "deadlock",
    name: "Deadlock",
    role: "Sentinel",
    bannerPath: "/agents/banner/deadlock.webp",
    iconPath: "/agents/icon/deadlock.webp",
  },
  {
    id: "vyse",
    name: "Vyse",
    role: "Sentinel",
    bannerPath: "/agents/banner/vyse.webp",
    iconPath: "/agents/icon/vyse.webp",
  },
  {
    id: "miks",
    name: "Miks",
    role: "Sentinel",
    bannerPath: "/agents/banner/miks.webp",
    iconPath: "/agents/icon/miks.webp",
  },
];

// Setting banner alias
export const AGENT_BANNERS: AgentBanner[] = AGENTS;

export const PRESET_TAGLINES: readonly string[] = [
  "ONE TAP DEMON",
  "RADIANT MIND",
  "CLUTCH SPECIALIST",
  "FORCE BUY WARRIOR",
  "LINEUP ARCHITECT",
  "SMOKE & MIRRORS",
  "SNEAKY DEFUSER",
  "TACTICAL DUELIST",
  "AGENT ON DUTY",
] as const;

export function getAgentById(id?: string | null): Agent {
  if (!id) return AGENTS[0]!;
  const normalized = id.toLowerCase();
  const found = AGENTS.find((a) => a.id.toLowerCase() === normalized);
  if (found) return found;

  return {
    id: normalized,
    name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
    role: "Sentinel",
    bannerPath: `/agents/banner/${normalized}.webp`,
    iconPath: `/agents/icon/${normalized}.webp`,
  };
}

export function getAgentBannerPath(id?: string | null): string {
  return getAgentById(id).bannerPath;
}

export function getAgentIconPath(id?: string | null): string {
  return getAgentById(id).iconPath;
}
