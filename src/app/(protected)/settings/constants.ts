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
  { id: "jett", name: "Jett", role: "Duelist", bannerPath: "/agents/banner/jett.avif", iconPath: "/agents/icon/jett.avif" },
  { id: "reyna", name: "Reyna", role: "Duelist", bannerPath: "/agents/banner/reyna.avif", iconPath: "/agents/icon/reyna.avif" },
  { id: "phoenix", name: "Phoenix", role: "Duelist", bannerPath: "/agents/banner/phoenix.avif", iconPath: "/agents/icon/phoenix.avif" },
  { id: "raze", name: "Raze", role: "Duelist", bannerPath: "/agents/banner/raze.avif", iconPath: "/agents/icon/raze.avif" },
  { id: "neon", name: "Neon", role: "Duelist", bannerPath: "/agents/banner/neon.avif", iconPath: "/agents/icon/neon.avif" },
  { id: "yoru", name: "Yoru", role: "Duelist", bannerPath: "/agents/banner/yoru.avif", iconPath: "/agents/icon/yoru.avif" },
  { id: "iso", name: "Iso", role: "Duelist", bannerPath: "/agents/banner/iso.avif", iconPath: "/agents/icon/iso.avif" },

  // Initiators
  { id: "sova", name: "Sova", role: "Initiator", bannerPath: "/agents/banner/sova.avif", iconPath: "/agents/icon/sova.avif" },
  { id: "fade", name: "Fade", role: "Initiator", bannerPath: "/agents/banner/fade.avif", iconPath: "/agents/icon/fade.avif" },
  { id: "breach", name: "Breach", role: "Initiator", bannerPath: "/agents/banner/breach.avif", iconPath: "/agents/icon/breach.avif" },
  { id: "skye", name: "Skye", role: "Initiator", bannerPath: "/agents/banner/skye.avif", iconPath: "/agents/icon/skye.avif" },
  { id: "kayo", name: "KAY/O", role: "Initiator", bannerPath: "/agents/banner/kayo.avif", iconPath: "/agents/icon/kayo.avif" },
  { id: "gekko", name: "Gekko", role: "Initiator", bannerPath: "/agents/banner/gekko.avif", iconPath: "/agents/icon/gekko.avif" },
  { id: "tejo", name: "Tejo", role: "Initiator", bannerPath: "/agents/banner/tejo.avif", iconPath: "/agents/icon/tejo.avif" },

  // Controllers
  { id: "omen", name: "Omen", role: "Controller", bannerPath: "/agents/banner/omen.avif", iconPath: "/agents/icon/omen.avif" },
  { id: "viper", name: "Viper", role: "Controller", bannerPath: "/agents/banner/viper.avif", iconPath: "/agents/icon/viper.avif" },
  { id: "brimstone", name: "Brimstone", role: "Controller", bannerPath: "/agents/banner/brimstone.avif", iconPath: "/agents/icon/brimstone.avif" },
  { id: "astra", name: "Astra", role: "Controller", bannerPath: "/agents/banner/astra.avif", iconPath: "/agents/icon/astra.avif" },
  { id: "harbor", name: "Harbor", role: "Controller", bannerPath: "/agents/banner/harbor.avif", iconPath: "/agents/icon/harbor.avif" },
  { id: "clove", name: "Clove", role: "Controller", bannerPath: "/agents/banner/clove.avif", iconPath: "/agents/icon/clove.avif" },

  // Sentinels
  { id: "killjoy", name: "Killjoy", role: "Sentinel", bannerPath: "/agents/banner/killjoy.avif", iconPath: "/agents/icon/killjoy.avif" },
  { id: "cypher", name: "Cypher", role: "Sentinel", bannerPath: "/agents/banner/cypher.avif", iconPath: "/agents/icon/cypher.avif" },
  { id: "sage", name: "Sage", role: "Sentinel", bannerPath: "/agents/banner/sage.avif", iconPath: "/agents/icon/sage.avif" },
  { id: "chamber", name: "Chamber", role: "Sentinel", bannerPath: "/agents/banner/chamber.avif", iconPath: "/agents/icon/chamber.avif" },
  { id: "deadlock", name: "Deadlock", role: "Sentinel", bannerPath: "/agents/banner/deadlock.avif", iconPath: "/agents/icon/deadlock.avif" },
  { id: "vyse", name: "Vyse", role: "Sentinel", bannerPath: "/agents/banner/vyse.avif", iconPath: "/agents/icon/vyse.avif" },
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
