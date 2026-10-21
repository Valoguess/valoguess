"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Shield, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut, token } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { updateUser, updateUserProfile } from "@/actions/user";
import { AGENT_BANNERS } from "@/consts";
import { ProfileCardPreview } from "./_components/ProfileCardPreview";
import { IdentitySettingsTab } from "./_components/IdentitySettingsTab";
import { BannerTaglineTab } from "./_components/BannerTaglineTab";
import { PrivacyAccountTab } from "./_components/PrivacyAccountTab";
import { LogoutConfirmationModal } from "../_components/LogoutConfirmationModal";
import { socket } from "@/socket";
import { toast } from "sonner";
import { refreshAuth } from "@/socket/emitter";

function getDaysRemaining(updatedAt?: Date | string | null): number {
  if (!updatedAt) return 0;
  const lastChange = new Date(updatedAt).getTime();
  if (Number.isNaN(lastChange)) return 0;
  const elapsedMs = Date.now() - lastChange;
  const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - elapsedDays);
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setUser, clearUser } = useAuthStore();

  const isAnonymous = useMemo(() => {
    if (typeof user?.isAnonymous === "boolean") return user.isAnonymous;
    if (typeof (session?.user as any)?.isAnonymous === "boolean") {
      return Boolean((session?.user as any).isAnonymous);
    }
    return Boolean(
      user?.name?.startsWith("Guest") ||
      session?.user?.name?.startsWith("Guest"),
    );
  }, [user, session]);

  // Form states initialized directly from user schema
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [selectedBannerId, setSelectedBannerId] = useState<string>("omen");

  // Cooldown states calculated from database timestamps
  const [nameCooldownDays, setNameCooldownDays] = useState<number>(0);
  const [usernameCooldownDays, setUsernameCooldownDays] = useState<number>(0);

  // Banner filter & search
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [bannerSearch, setBannerSearch] = useState<string>("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"identity" | "banner" | "privacy">(
    "identity",
  );

  // Save state
  const [isSaving, setIsSaving] = useState(false);

  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load initial settings from user store and database fields
  useEffect(() => {
    const initialName = user?.name || "AGENT";
    setName(initialName);

    const initialUsername =
      user?.username ||
      initialName.toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      "agent_001";
    setUsername(initialUsername.replace(/^@/, ""));

    setTagline(user?.tagline || "CLUTCH SPECIALIST");

    if (user?.banner && AGENT_BANNERS.some((b) => b.id === user.banner)) {
      setSelectedBannerId(user.banner);
    }

    setNameCooldownDays(getDaysRemaining(user?.nameUpdatedAt));
    setUsernameCooldownDays(getDaysRemaining(user?.usernameUpdatedAt));
  }, [user]);

  // Selected banner object
  const currentBanner = useMemo(() => {
    return (
      AGENT_BANNERS.find((b) => b.id === selectedBannerId) || AGENT_BANNERS[0]!
    );
  }, [selectedBannerId]);

  // Filtered banners list
  const filteredBanners = useMemo(() => {
    return AGENT_BANNERS.filter((b) => {
      const matchesRole =
        selectedRole === "ALL" ||
        b.role.toUpperCase() === selectedRole.toUpperCase();
      const matchesSearch =
        b.name.toLowerCase().includes(bannerSearch.toLowerCase()) ||
        b.role.toLowerCase().includes(bannerSearch.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [selectedRole, bannerSearch]);

  // Save handler using database server actions
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const nextName = name.trim();
      const nextUsername = username.trim();
      const nextTagline = tagline.trim();
      const nextBanner = selectedBannerId;

      if (session?.user?.id) {
        // Save identity changes
        const { data, error } = await token()

        if (nextName !== user?.name || nextUsername !== user?.username) {
          const res = await updateUser({
            name: nextName,
            username: nextUsername,
          });

          if (res.success && socket.connected) {
            data?.token && refreshAuth(data.token);
          }
        }

        // Save profile customisations (banner, tagline)
        if (nextBanner !== user?.banner || nextTagline !== user?.tagline) {
          const res = await updateUserProfile({
            banner: nextBanner,
            tagline: nextTagline,
          });
          if (res.success && socket.connected) {
            data?.token && refreshAuth(data.token);
          }
        }
      }

      if (user) {
        setUser({
          ...user,
          name: nextName,
          username: nextUsername,
          tagline: nextTagline,
          banner: nextBanner,
          nameUpdatedAt:
            nextName !== user.name ? new Date() : user.nameUpdatedAt,
          usernameUpdatedAt:
            nextUsername !== user.username
              ? new Date()
              : user.usernameUpdatedAt,
        });
      }

      if (nextUsername !== user?.username && usernameCooldownDays === 0) {
        setUsernameCooldownDays(30);
      }
      if (nextName !== user?.name && nameCooldownDays === 0) {
        setNameCooldownDays(30);
      }

      toast.success("Profile settings saved successfully!");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Signing out...", { id: "logout-toast" });
    try {
      socket.disconnect();
      await signOut();
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      clearUser();
      toast.dismiss("logout-toast");
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative min-h-full w-full text-white flex flex-col font-body selection:bg-accent selection:text-white">
      {/* Background artwork */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover opacity-20 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/90 via-[#040609]/80 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_20%,#040609_90%)]" />
      </div>

      {/* Main Settings Content */}
      <div className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8 pb-16">
        {/* Live Player Card Preview */}
        <ProfileCardPreview
          currentBanner={currentBanner}
          name={name}
          username={username}
          tagline={tagline}
          avatarUrl={user?.image}
        />

        {/* Tab Selection */}
        <div className="flex items-center border-b border-white/10 gap-1.5 sm:gap-2 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("identity")}
            className={cn(
              "py-2 sm:py-2.5 px-3 sm:px-5 font-display text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap",
              activeTab === "identity"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2",
            )}
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
            <span>IDENTITY &amp; AVATAR</span>
          </button>

          <button
            onClick={() => setActiveTab("banner")}
            className={cn(
              "py-2 sm:py-2.5 px-3 sm:px-5 font-display text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap",
              activeTab === "banner"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2",
            )}
          >
            <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
            <span>BANNER &amp; TAGLINE</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "py-2 sm:py-2.5 px-3 sm:px-5 font-display text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all rounded-xs border-b-2 cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap",
              activeTab === "privacy"
                ? "border-accent text-white bg-white/4"
                : "border-transparent text-white/50 hover:text-white hover:bg-white/2",
            )}
          >
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-mint" />
            <span>PRIVACY &amp; ACCOUNT</span>
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === "identity" && (
          <IdentitySettingsTab
            isAnonymous={isAnonymous}
            username={username}
            setUsername={setUsername}
            usernameCooldownDays={usernameCooldownDays}
            toggleUsernameCooldownDemo={() =>
              setUsernameCooldownDays((prev) => (prev > 0 ? 0 : 24))
            }
            name={name}
            setName={setName}
            nameCooldownDays={nameCooldownDays}
            toggleNameCooldownDemo={() =>
              setNameCooldownDays((prev) => (prev > 0 ? 0 : 19))
            }
            defaultIconPath={currentBanner.iconPath}
            onSave={() => handleSaveSettings()}
            isSaving={isSaving}
          />
        )}

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
            onSave={() => handleSaveSettings()}
            isSaving={isSaving}
          />
        )}

        {activeTab === "privacy" && (
          <PrivacyAccountTab
            currentBanner={currentBanner}
            name={name}
            username={username}
            isAnonymous={isAnonymous}
            userEmail={user?.email || session?.user?.email}
            onRequestLogout={() => setShowLogoutModal(true)}
          />
        )}
      </div>

      {/* Logout confirmation dialog */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        isAnonymous={isAnonymous}
        isLoggingOut={isLoggingOut}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
}
