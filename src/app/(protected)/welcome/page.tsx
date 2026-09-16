"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Flame } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import {
  TAKEN_USERNAMES,
  RANDOM_ADJECTIVES,
  RANDOM_NOUNS,
  UsernameStatus,
  getOrGenerateGuestPrefix,
} from "./constants";
import { WelcomeHeader } from "./_components/WelcomeHeader";
import { DisplayNameField } from "./_components/DisplayNameField";
import { TacticalUsernameField } from "./_components/TacticalUsernameField";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setUser } = useAuthStore();

  // Determine if user is anonymous from authStore or session
  const isAnonymous = useMemo(() => {
    if (typeof user?.isAnonymous === "boolean") {
      return user.isAnonymous;
    }
    if (typeof (session?.user as any)?.isAnonymous === "boolean") {
      return Boolean((session?.user as any).isAnonymous);
    }
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("username");
      if (stored && stored.startsWith("Guest")) return true;
    }
    return false;
  }, [user, session]);

  // For anonymous users: fixed prefix Guest.[5-6letters]
  const [guestPrefix, setGuestPrefix] = useState<string>("Guest.agent");
  const [displayNameSuffix, setDisplayNameSuffix] = useState<string>("");

  // For non-anonymous users: standard display name
  const [displayName, setDisplayName] = useState("");

  // Username handle
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize values based on user / anonymous status
  useEffect(() => {
    const existingUsername = localStorage.getItem("username");

    if (isAnonymous) {
      const prefix = getOrGenerateGuestPrefix(user?.name || existingUsername);
      setGuestPrefix(prefix);

      const currentName = user?.name || existingUsername || "";
      if (currentName.startsWith(prefix)) {
        setDisplayNameSuffix(currentName.slice(prefix.length));
      }

      const assignedUsername =
        user?.username ||
        localStorage.getItem("handle") ||
        prefix.toLowerCase().replace(".", "_");
      setUsername(assignedUsername);
      setUsernameStatus("available");
    } else {
      const initialDisplayName =
        session?.user?.name ||
        user?.name ||
        (existingUsername && !existingUsername.startsWith("Guest") ? existingUsername : "");
      const initialHandle =
        session?.user?.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() ||
        (existingUsername && !existingUsername.startsWith("Guest")
          ? existingUsername.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "")
          : "");

      if (initialDisplayName) {
        setDisplayName(initialDisplayName);
      }
      if (initialHandle) {
        setUsername(initialHandle);
      }
    }
  }, [isAnonymous, session, user]);

  // Real-time debounced uniqueness checking (only for non-anonymous users)
  useEffect(() => {
    if (isAnonymous) {
      setUsernameStatus("available");
      setStatusMessage("");
      setSuggestions([]);
      return;
    }

    const cleaned = username.trim().toLowerCase();

    if (!cleaned) {
      setUsernameStatus("idle");
      setStatusMessage("");
      setSuggestions([]);
      return;
    }

    if (cleaned.length < 3) {
      setUsernameStatus("invalid");
      setStatusMessage("Username must be at least 3 characters long");
      setSuggestions([]);
      return;
    }

    if (!/^[a-z0-9_.-]+$/.test(cleaned)) {
      setUsernameStatus("invalid");
      setStatusMessage("Only letters, numbers, underscores, and hyphens allowed");
      setSuggestions([]);
      return;
    }

    if (cleaned.length > 20) {
      setUsernameStatus("invalid");
      setStatusMessage("Username cannot exceed 20 characters");
      setSuggestions([]);
      return;
    }

    setUsernameStatus("checking");
    setStatusMessage("Checking availability...");

    const timeout = setTimeout(() => {
      const isTaken = TAKEN_USERNAMES.has(cleaned) || cleaned.endsWith("_taken") || cleaned === "guest123";

      if (isTaken) {
        setUsernameStatus("taken");
        setStatusMessage("This username is already taken");
        setSuggestions([
          `${cleaned}_val`,
          `${cleaned}${Math.floor(10 + Math.random() * 89)}`,
          `real_${cleaned}`,
        ]);
      } else {
        setUsernameStatus("available");
        setStatusMessage("Username is available!");
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [username, isAnonymous]);

  // Randomize a unique handle suggestion
  const handleRandomizeUsername = () => {
    if (isAnonymous) return;
    const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)].toLowerCase();
    const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)].toLowerCase();
    const num = Math.floor(10 + Math.random() * 90);
    const newHandle = `${adj}_${noun}${num}`;
    setUsername(newHandle);

    if (!displayName) {
      setDisplayName(`${adj.charAt(0).toUpperCase() + adj.slice(1)} ${noun.charAt(0).toUpperCase() + noun.slice(1)}`);
    }
  };

  const handleApplySuggestion = (sug: string) => {
    if (isAnonymous) return;
    setUsername(sug);
  };

  // Complete Onboarding
  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();

    let finalDisplayName = "";
    let finalUsername = "";

    if (isAnonymous) {
      finalDisplayName = displayNameSuffix.trim()
        ? `${guestPrefix}${displayNameSuffix}`
        : guestPrefix;
      finalUsername = username.trim().toLowerCase() || guestPrefix.toLowerCase().replace(".", "_");
    } else {
      finalDisplayName = displayName.trim() || username.trim() || "Agent";
      finalUsername = username.trim().toLowerCase();

      if (usernameStatus === "invalid" || usernameStatus === "taken" || usernameStatus === "checking") {
        return;
      }
    }

    setIsSubmitting(true);

    const playerId = session?.user?.id || user?.id || localStorage.getItem("playerId") || crypto.randomUUID();

    localStorage.setItem("username", finalDisplayName);
    sessionStorage.setItem("username", finalDisplayName);
    localStorage.setItem("handle", finalUsername);
    localStorage.setItem("playerId", playerId);
    sessionStorage.setItem("playerId", playerId);

    setUser({
      id: playerId,
      name: finalDisplayName,
      username: finalUsername,
      email: session?.user?.email || user?.email || undefined,
      image: session?.user?.image || user?.image || null,
      isAnonymous,
    });

    setTimeout(() => {
      router.push("/lobby");
    }, 400);
  };

  const isFormValid = isAnonymous
    ? true
    : displayName.trim().length >= 2 &&
      username.trim().length >= 3 &&
      usernameStatus === "available";

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-between bg-[#040609] text-white py-8 px-4 font-sans overflow-x-hidden">
      {/* Background artwork */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/bg/bg2.png"
          alt="ValoGuess Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-20 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#040609] via-[#040609]/85 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#040609_90%)]" />
      </div>

      {/* Header */}
      <WelcomeHeader />

      {/* Focused Onboarding Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-lg my-auto py-4"
      >
        <div className="rounded-2xl border border-white/10 bg-[#090d16]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          {/* Top Neon Highlight */}
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-[#FF4655] to-transparent opacity-90" />

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FF4655]/15 border border-[#FF4655]/30 text-[#FF4655] mb-3">
              <Flame className="h-3 w-3" /> Identity Initialization
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
              Set Up Your Identity
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              {isAnonymous
                ? "As an anonymous guest, your username is fixed. You can customize your display name after the Guest prefix."
                : "Enter your in-game display name and choose a unique tactical handle."}
            </p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-5 text-left">
            {/* FIELD 1: DISPLAY NAME */}
            <DisplayNameField
              isAnonymous={isAnonymous}
              guestPrefix={guestPrefix}
              displayNameSuffix={displayNameSuffix}
              setDisplayNameSuffix={setDisplayNameSuffix}
              displayName={displayName}
              setDisplayName={setDisplayName}
            />

            {/* FIELD 2: USERNAME */}
            <TacticalUsernameField
              isAnonymous={isAnonymous}
              username={username}
              setUsername={setUsername}
              usernameStatus={usernameStatus}
              statusMessage={statusMessage}
              suggestions={suggestions}
              onApplySuggestion={handleApplySuggestion}
              onRandomize={handleRandomizeUsername}
            />

            {/* SUBMIT BUTTON */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full h-12 rounded-xl bg-[#FF4655] hover:bg-[#e03847] text-white font-semibold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(255,70,85,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>INITIALIZING PROFILE...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM IDENTITY & ENTER LOBBY</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Page Footer */}
      <div className="relative z-10 w-full text-center text-xs text-zinc-600 font-normal select-none shrink-0">
        © 2026 ValoGuess • Tactical Identity Initialization
      </div>
    </main>
  );
}
