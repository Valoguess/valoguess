export type AgentRole = "Duelist" | "Initiator" | "Controller" | "Sentinel";

export interface AgentBanner {
  id: string;
  name: string;
  role: AgentRole;
  bannerPath: string;
  iconPath: string;
}

export const AGENT_BANNERS: AgentBanner[] = [
  // Duelists
  { id: "jett", name: "Jett", role: "Duelist", bannerPath: "/agents/banner/jett.png", iconPath: "/agents/icon/jett.png" },
  { id: "reyna", name: "Reyna", role: "Duelist", bannerPath: "/agents/banner/reyna.png", iconPath: "/agents/icon/reyna.png" },
  { id: "phoenix", name: "Phoenix", role: "Duelist", bannerPath: "/agents/banner/phoenix.png", iconPath: "/agents/icon/phoenix.png" },
  { id: "raze", name: "Raze", role: "Duelist", bannerPath: "/agents/banner/raze.png", iconPath: "/agents/icon/raze.png" },
  { id: "neon", name: "Neon", role: "Duelist", bannerPath: "/agents/banner/neon.png", iconPath: "/agents/icon/neon.png" },
  { id: "yoru", name: "Yoru", role: "Duelist", bannerPath: "/agents/banner/yoru.png", iconPath: "/agents/icon/yoru.png" },
  { id: "iso", name: "Iso", role: "Duelist", bannerPath: "/agents/banner/iso.png", iconPath: "/agents/icon/iso.png" },

  // Initiators
  { id: "sova", name: "Sova", role: "Initiator", bannerPath: "/agents/banner/sova.png", iconPath: "/agents/icon/sova.png" },
  { id: "fade", name: "Fade", role: "Initiator", bannerPath: "/agents/banner/fade.png", iconPath: "/agents/icon/fade.png" },
  { id: "breach", name: "Breach", role: "Initiator", bannerPath: "/agents/banner/breach.png", iconPath: "/agents/icon/breach.png" },
  { id: "skye", name: "Skye", role: "Initiator", bannerPath: "/agents/banner/skye.png", iconPath: "/agents/icon/skye.png" },
  { id: "kayo", name: "KAY/O", role: "Initiator", bannerPath: "/agents/banner/kayo.png", iconPath: "/agents/icon/kayo.png" },
  { id: "gekko", name: "Gekko", role: "Initiator", bannerPath: "/agents/banner/gekko.png", iconPath: "/agents/icon/gekko.png" },
  { id: "tejo", name: "Tejo", role: "Initiator", bannerPath: "/agents/banner/tejo.png", iconPath: "/agents/icon/tejo.png" },

  // Controllers
  { id: "omen", name: "Omen", role: "Controller", bannerPath: "/agents/banner/omen.png", iconPath: "/agents/icon/omen.png" },
  { id: "viper", name: "Viper", role: "Controller", bannerPath: "/agents/banner/viper.png", iconPath: "/agents/icon/viper.png" },
  { id: "brimstone", name: "Brimstone", role: "Controller", bannerPath: "/agents/banner/brimstone.png", iconPath: "/agents/icon/brimstone.png" },
  { id: "astra", name: "Astra", role: "Controller", bannerPath: "/agents/banner/astra.png", iconPath: "/agents/icon/astra.png" },
  { id: "harbor", name: "Harbor", role: "Controller", bannerPath: "/agents/banner/harbor.png", iconPath: "/agents/icon/harbor.png" },
  { id: "clove", name: "Clove", role: "Controller", bannerPath: "/agents/banner/clove.png", iconPath: "/agents/icon/clove.png" },

  // Sentinels
  { id: "killjoy", name: "Killjoy", role: "Sentinel", bannerPath: "/agents/banner/killjoy.png", iconPath: "/agents/icon/killjoy.png" },
  { id: "cypher", name: "Cypher", role: "Sentinel", bannerPath: "/agents/banner/cypher.png", iconPath: "/agents/icon/cypher.png" },
  { id: "sage", name: "Sage", role: "Sentinel", bannerPath: "/agents/banner/sage.png", iconPath: "/agents/icon/sage.png" },
  { id: "chamber", name: "Chamber", role: "Sentinel", bannerPath: "/agents/banner/chamber.png", iconPath: "/agents/icon/chamber.png" },
  { id: "deadlock", name: "Deadlock", role: "Sentinel", bannerPath: "/agents/banner/deadlock.png", iconPath: "/agents/icon/deadlock.png" },
  { id: "vyse", name: "Vyse", role: "Sentinel", bannerPath: "/agents/banner/vyse.png", iconPath: "/agents/icon/vyse.png" },
];

export const PRESET_TAGLINES = [
  "ONE TAP DEMON",
  "RADIANT MIND",
  "CLUTCH SPECIALIST",
  "FORCE BUY WARRIOR",
  "LINEUP ARCHITECT",
  "SMOKE & MIRRORS",
  "SNEAKY DEFUSER",
  "TACTICAL DUELIST",
  "AGENT ON DUTY",
];
