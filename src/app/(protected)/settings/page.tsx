"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AGENT_BANNERS } from "./constants";
import { ProfileCardPreview } from "./_components/ProfileCardPreview";
import { IdentitySettingsTab } from "./_components/IdentitySettingsTab";
import { BannerTaglineTab } from "./_components/BannerTaglineTab";
import { PrivacyAccountTab } from "./_components/PrivacyAccountTab";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, clearUser } = useAuthStore();

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

  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load initial settings from user/localStorage
  useEffect(() => {
    const initialName = user?.name || (typeof window !== "undefined" && localStorage.getItem("username")) || "AGENT";
    setName(initialName);

    const initialUsername =
      user?.username ||
      (typeof window !== "undefined" && localStorage.getItem("handle")) ||
      (initialName.toLowerCase().replace(/[^a-z0-9_]/g, "") || "agent_001");
    setUsername(initialUsername.replace(/^@/, ""));

    const savedTagline = typeof window !== "undefined" ? localStorage.getItem("valoguess_tagline") : null;
    setTagline(savedTagline || "CLUTCH SPECIALIST");

    const savedBanner = typeof window !== "undefined" ? localStorage.getItem("valoguess_banner") : null;
    if (savedBanner && AGENT_BANNERS.some((b) => b.id === savedBanner)) {
      setSelectedBannerId(savedBanner);
    }

    const savedHideName = typeof window !== "undefined" ? localStorage.getItem("valoguess_hide_name") : null;
    setHideName(savedHideName === "true");

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

      setSaveToast("Settings saved successfully!");
      setTimeout(() => setSaveToast(""), 4000);
    } catch {
      setSaveToast("Failed to save settings. Please try again.");
      setTimeout(() => setSaveToast(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      clearUser();
      if (typeof window !== "undefined") {
        localStorage.removeItem("username");
        localStorage.removeItem("handle");
        localStorage.removeItem("playerId");
        localStorage.removeItem("guestPrefix");
        sessionStorage.clear();
      }
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
      clearUser();
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
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

      {/* 1. STICKY TOP HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-30 w-full h-16 bg-[#080B10]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0 shadow-lg">
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

        {/* Header Actions: Feedback + Single Save Button + Logout Button */}
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

          <button
            onClick={() => setShowLogoutModal(true)}
            className="py-2 px-3.5 rounded-sm border border-white/10 bg-white/3 hover:bg-[#FF4655]/15 hover:border-[#FF4655]/40 text-white/60 hover:text-[#FF4655] font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            title="Log out of account"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">LOG OUT</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN SETTINGS CONTAINER */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8 pb-16">
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
            <span>3. PRIVACY & ACCOUNT</span>
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

        {/* TAB 3: PRIVACY & ACCOUNT */}
        {activeTab === "privacy" && (
          <PrivacyAccountTab
            hideName={hideName}
            setHideName={setHideName}
            currentBanner={currentBanner}
            name={name}
            username={username}
            isAnonymous={isAnonymous}
            userEmail={user?.email || session?.user?.email}
            onRequestLogout={() => setShowLogoutModal(true)}
          />
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent
          showCloseButton={false}
          className="bg-[#0b0e14]/95 border border-white/10 max-w-sm p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl rounded-none relative overflow-hidden"
        >
          {/* Top Valorant-style red accent bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

          <div className="flex flex-col items-center text-center space-y-4 pt-1">
            <div className="h-12 w-12 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/30 flex items-center justify-center text-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.2)]">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
                SESSION TERMINATION
              </div>
              <h3 className="font-valorant text-lg tracking-wider text-white">
                LOG OUT OF VALOGUESS?
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-[280px]">
              {isAnonymous
                ? "You are using a guest session. Logging out will clear your local guest session and return you to the sign-in screen."
                : "Are you sure you want to end your session? You will need to sign in again to access party duels and saved stats."}
            </p>

            <div className="flex items-center gap-2.5 w-full pt-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer disabled:opacity-50"
              >
                CANCEL
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs shadow-[0_0_15px_rgba(255,70,85,0.4)] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isLoggingOut ? (
                  <span className="animate-pulse">LOGGING OUT...</span>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span>LOG OUT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
