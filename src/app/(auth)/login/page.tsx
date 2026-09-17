"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, Zap, Shield } from "lucide-react";
import { signIn, googleSignIn, useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/store/authStore";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/lobby";

  const { data: session } = useSession();
  const { setUser } = useAuthStore();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync user and redirect when session is active
  useEffect(() => {
    if (session?.user) {
      const defaultUsername =
        session.user.name ||
        session.user.email?.split("@")[0] ||
        localStorage.getItem("username") ||
        `Guest_${Math.floor(1000 + Math.random() * 9000)}`;

      localStorage.setItem("username", defaultUsername);
      sessionStorage.setItem("username", defaultUsername);
      localStorage.setItem("playerId", session.user.id);
      sessionStorage.setItem("playerId", session.user.id);

      setUser({
        id: session.user.id,
        name: session.user.name,
        username: defaultUsername,
        email: session.user.email,
        image: session.user.image,
        isAnonymous: (session.user as any).isAnonymous ?? false,
      });

      router.replace(redirectUrl);
    }
  }, [session, router, redirectUrl, setUser]);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage("");
    try {
      await googleSignIn(redirectUrl);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setErrorMessage(err?.message || "Failed to initialize Google authentication.");
      setIsLoadingGoogle(false);
    }
  };

  // Instant Guest Login Handler
  const handleGuestLogin = async () => {
    setIsLoadingGuest(true);
    setErrorMessage("");

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const guestUsername = `Guest_${randomSuffix}`;

    try {
      const res = await signIn.anonymous();
      const generatedId = (res as any)?.data?.user?.id || crypto.randomUUID();

      localStorage.setItem("username", guestUsername);
      sessionStorage.setItem("username", guestUsername);
      localStorage.setItem("playerId", generatedId);
      sessionStorage.setItem("playerId", generatedId);

      setUser({
        id: generatedId,
        username: guestUsername,
        name: guestUsername,
        isAnonymous: true,
      });

      router.replace(redirectUrl);
    } catch (err: any) {
      console.error("Anonymous login error:", err);
      const fallbackId = localStorage.getItem("playerId") || crypto.randomUUID();
      localStorage.setItem("username", guestUsername);
      sessionStorage.setItem("username", guestUsername);
      localStorage.setItem("playerId", fallbackId);
      sessionStorage.setItem("playerId", fallbackId);

      setUser({
        id: fallbackId,
        username: guestUsername,
        name: guestUsername,
        isAnonymous: true,
      });

      router.replace(redirectUrl);
    } finally {
      setIsLoadingGuest(false);
    }
  };

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-between bg-[#040609] text-white py-8 px-4 font-sans overflow-x-hidden">
      <AuthBackground />
      <AuthHeader mode="login" />

      <AuthCard
        badgeText="Tactical Access // Sign In"
        title="Sign In to ValoGuess"
        description="Connect your Google account to sync stats across devices, or jump straight into a duel as a guest."
        errorMessage={errorMessage}
        footer={
          <>
            {/* Tactical Highlights */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-mint shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white block">Instant Access</span>
                  <span className="text-[10px] text-zinc-400">Play matches immediately</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/10 bg-black/40 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-violet shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-white block">Cloud Sync</span>
                  <span className="text-[10px] text-zinc-400">Save match history</span>
                </div>
              </div>
            </div>

            {/* Link to Signup */}
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Don't have an account?</span>
              <Link
                href="/signup"
                className="text-[#FF4655] hover:text-[#ff6b77] font-semibold flex items-center gap-1 transition"
              >
                <span>Enlist Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        }
      >
        <GoogleAuthButton
          onClick={handleGoogleLogin}
          isLoading={isLoadingGoogle}
          disabled={isLoadingGuest}
          label="Continue with Google"
        />

        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#090d16] px-3 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            or play as guest
          </span>
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoadingGoogle || isLoadingGuest}
          className="w-full h-12 rounded-xl border border-[#FF4655]/40 bg-[#FF4655]/10 hover:bg-[#FF4655]/20 hover:border-[#FF4655] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_0_20px_rgba(255,70,85,0.15)] cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          {isLoadingGuest ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Creating Guest Profile...</span>
            </>
          ) : (
            <span>Play as Guest (Instant Play)</span>
          )}
        </button>
      </AuthCard>

      <div className="relative z-10 w-full text-center text-xs text-zinc-600 font-normal select-none shrink-0">
        © 2026 ValoGuess • 1v1 Tactical Deduction Arena
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#040609] flex flex-col items-center justify-center text-white select-none">
          <div className="flex flex-col items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-10 h-10 animate-pulse">
              <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
              <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
              <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
            </svg>
            <span className="text-xs text-zinc-400 tracking-wider">Loading Authentication...</span>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
