"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Shield,
  Image as ImageIcon,
  ArrowLeft,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { AGENT_BANNERS } from "./constants";
import { ProfileCardPreview } from "./_components/ProfileCardPreview";
import { IdentitySettingsTab } from "./_components/IdentitySettingsTab";
import { BannerTaglineTab } from "./_components/BannerTaglineTab";
import { PrivacyAccountTab } from "./_components/PrivacyAccountTab";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { user } = useAuthStore();

  const isAnonymous = useMemo(() => {
    if (typeof user?.isAnonymous === "boolean") return user.isAnonymous;
    if (typeof (session?.user as any)?.isAnonymous === "boolean") {
      return Boolean((session?.user as any).isAnonymous);
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("username");
      if (stored && stored.startsWith("Guest")) return true;
    }
    return false;
  }, [user, session]);

  // Form states
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [selectedBannerId, setSelectedBannerId] = useState<string>("omen");
  const [hideName, setHideName] = useState<boolean>(false);

  // 30-Day Cooldown states (in days remaining, 0 means eligible)
  const [nameCooldownDays, setNameCooldownDays] = useState<number>(0);
  const [usernameCooldownDays, setUsernameCooldownDays] = useState<number>(0);

  // Banner filter & search
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [bannerSearch, setBannerSearch] = useState<string>("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"identity" | "banner" | "privacy">("identity");

  // Save state & feedback toast
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string>("");

  // Load initial settings from user/localStorage
  useEffect(() => {
    // 1. Initial display name
    const initialName = user?.name || (typeof window !== "undefined" && localStorage.getItem("username")) || "AGENT";
    setName(initialName);

    // 2. Initial username
    const initialUsername =
      user?.username ||
      (typeof window !== "undefined" && localStorage.getItem("handle")) ||
      (initialName.toLowerCase().replace(/[^a-z0-9_]/g, "") || "agent_001");
    setUsername(initialUsername.replace(/^@/, ""));

    // 3. Initial tagline
    const savedTagline = typeof window !== "undefined" ? localStorage.getItem("valoguess_tagline") : null;
    setTagline(savedTagline || "CLUTCH SPECIALIST");

    // 4. Initial banner
    const savedBanner = typeof window !== "undefined" ? localStorage.getItem("valoguess_banner") : null;
    if (savedBanner && AGENT_BANNERS.some((b) => b.id === savedBanner)) {
      setSelectedBannerId(savedBanner);
    }

    // 5. Initial hideName privacy setting
    const savedHideName = typeof window !== "undefined" ? localStorage.getItem("valoguess_hide_name") : null;
    setHideName(savedHideName === "true");

    // 6. Calculate 30-day cooldowns based on timestamp in localStorage
    if (typeof window !== "undefined") {
      const lastUsernameChange = localStorage.getItem("valoguess_username_last_changed");
      if (lastUsernameChange) {
        const diffMs = Date.now() - parseInt(lastUsernameChange, 10);
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        setUsernameCooldownDays(Math.max(0, 30 - daysPassed));
      } else {
        setUsernameCooldownDays(0);
      }

      const lastNameChange = localStorage.getItem("valoguess_name_last_changed");
      if (lastNameChange) {
        const diffMs = Date.now() - parseInt(lastNameChange, 10);
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        setNameCooldownDays(Math.max(0, 30 - daysPassed));
      } else {
        setNameCooldownDays(0);
      }
    }
  }, [user]);

  // Selected banner object
  const currentBanner = useMemo(() => {
    return AGENT_BANNERS.find((b) => b.id === selectedBannerId) || AGENT_BANNERS[0];
  }, [selectedBannerId]);

  // Filtered banners
  const filteredBanners = useMemo(() => {
    return AGENT_BANNERS.filter((b) => {
      const matchesRole = selectedRole === "ALL" || b.role.toUpperCase() === selectedRole.toUpperCase();
      const matchesSearch =
        b.name.toLowerCase().includes(bannerSearch.toLowerCase()) ||
        b.role.toLowerCase().includes(bannerSearch.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, bannerSearch]);

  // Save handler
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (typeof window !== "undefined") {
        localStorage.setItem("valoguess_tagline", tagline.trim());
        localStorage.setItem("valoguess_banner", selectedBannerId);
        localStorage.setItem("valoguess_hide_name", hideName ? "true" : "false");

        if (usernameCooldownDays === 0 && username.trim()) {
          localStorage.setItem("handle", username.trim());
          localStorage.setItem("valoguess_username_last_changed", Date.now().toString());
          setUsernameCooldownDays(30);
        }

        if (nameCooldownDays === 0 && name.trim()) {
          localStorage.setItem("username", name.trim());
          localStorage.setItem("valoguess_name_last_changed", Date.now().toString());
          setNameCooldownDays(30);
        }
      }

      setSaveToast("Profile settings saved successfully!");
      setTimeout(() => setSaveToast(""), 4000);
    } catch {
      setSaveToast("Failed to save settings. Please try again.");
      setTimeout(() => setSaveToast(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Cooldown debug test toggles
  const toggleUsernameCooldownDemo = () => {
    if (usernameCooldownDays > 0) {
      setUsernameCooldownDays(0);
      localStorage.removeItem("valoguess_username_last_changed");
    } else {
      setUsernameCooldownDays(24);
      localStorage.setItem("valoguess_username_last_changed", (Date.now() - 6 * 24 * 60 * 60 * 1000).toString());
    }
  };

  const toggleNameCooldownDemo = () => {
    if (nameCooldownDays > 0) {
      setNameCooldownDays(0);
      localStorage.removeItem("valoguess_name_last_changed");
    } else {
      setNameCooldownDays(19);
      localStorage.setItem("valoguess_name_last_changed", (Date.now() - 11 * 24 * 60 * 60 * 1000).toString());
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#040609] text-white flex flex-col font-body selection:bg-accent selection:text-white overflow-x-hidden">
      {/* BACKGROUND GRAPHICS */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.png"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover opacity-20 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/90 via-[#040609]/80 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#040609_90%)]" />
      </div>

      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="relative z-30 w-full h-16 bg-[#080B10]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/lobby"
            className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white/60 hover:text-white transition py-1.5 px-3 rounded-sm border border-white/10 bg-white/3 hover:bg-white/8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-accent" />
            <span>BACK TO LOBBY</span>
          </Link>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2 font-valorant">
            <span className="text-sm tracking-widest text-white">SETTINGS</span>
            <span className="text-[10px] tracking-widest text-accent font-mono bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              PROFILE & PRIVACY
            </span>
          </div>
        </div>

        {/* Action Button: Save Changes */}
        <div className="flex items-center gap-3">
          {saveToast && (
            <span className="text-[11px] font-display font-bold text-mint animate-fade-in hidden md:inline truncate">
              {saveToast}
            </span>
          )}

          <button
            onClick={() => handleSaveSettings()}
            disabled={isSaving}
            className="py-2 px-5 bg-accent hover:bg-accent-dim text-white font-display text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>SAVE CHANGES</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN SETTINGS CONTAINER */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        {/* TOP HERO: LIVE PLAYER CARD PREVIEW */}
        <ProfileCardPreview
          currentBanner={currentBanner}
          name={name}
          username={username}
          tagline={tagline}
          hideName={hideName}
        />

        {/* NAVIGATION TABS */}
        <div className="flex items-center border-b border-white/10 gap-2 pb-1">
          <button
            onClick={() => setActiveTab("identity")}
            className={cn(
              "py-2.5 px-5 font-display text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2",
              activeTab === "identity"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2"
            )}
          >
            <User className="h-4 w-4 text-accent" />
            <span>1. USERNAME & NAME</span>
          </button>

          <button
            onClick={() => setActiveTab("banner")}
            className={cn(
              "py-2.5 px-5 font-display text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2",
              activeTab === "banner"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2"
            )}
          >
            <ImageIcon className="h-4 w-4 text-amber-400" />
            <span>2. BANNER & TAGLINE</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "py-2.5 px-5 font-display text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2",
              activeTab === "privacy"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2"
            )}
          >
            <Shield className="h-4 w-4 text-mint" />
            <span>3. PRIVACY & SOCIAL</span>
          </button>
        </div>

        {/* TAB 1: IDENTITY */}
        {activeTab === "identity" && (
          <IdentitySettingsTab
            isAnonymous={isAnonymous}
            username={username}
            setUsername={setUsername}
            usernameCooldownDays={usernameCooldownDays}
            toggleUsernameCooldownDemo={toggleUsernameCooldownDemo}
            name={name}
            setName={setName}
            nameCooldownDays={nameCooldownDays}
            toggleNameCooldownDemo={toggleNameCooldownDemo}
          />
        )}

        {/* TAB 2: BANNER & TAGLINE */}
        {activeTab === "banner" && (
          <BannerTaglineTab
            tagline={tagline}
            setTagline={setTagline}
            bannerSearch={bannerSearch}
            setBannerSearch={setBannerSearch}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            filteredBanners={filteredBanners}
            selectedBannerId={selectedBannerId}
            setSelectedBannerId={setSelectedBannerId}
          />
        )}

        {/* TAB 3: PRIVACY & SOCIAL */}
        {activeTab === "privacy" && (
          <PrivacyAccountTab
            hideName={hideName}
            setHideName={setHideName}
            currentBanner={currentBanner}
            name={name}
            username={username}
            isAnonymous={isAnonymous}
            userEmail={user?.email || session?.user?.email}
          />
        )}

        {/* BOTTOM SAVE BAR */}
        <div className="p-4 bg-[#080B10]/90 border border-white/10 rounded-sm backdrop-blur-md flex items-center justify-between shrink-0 shadow-lg">
          <Link
            href="/lobby"
            className="text-xs font-display font-bold uppercase tracking-wider text-white/50 hover:text-white transition py-2 px-3 rounded cursor-pointer"
          >
            DISCARD & RETURN
          </Link>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-xs font-display font-bold text-mint animate-fade-in truncate">
                {saveToast}
              </span>
            )}

            <button
              onClick={() => handleSaveSettings()}
              disabled={isSaving}
              className="py-2.5 px-6 bg-accent hover:bg-accent-dim text-white font-display text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.4)] transition cursor-pointer disabled:opacity-50 active:scale-98 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>SAVING PROFILE...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>SAVE SETTINGS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
