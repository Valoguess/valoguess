"use client";

import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signIn, googleSignIn, useSession } from "@/lib/auth-client";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/lobby";

  const { data: session } = useSession();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (session?.user && !session.user.isAnonymous) {
      router.replace(redirectUrl);
    }
  }, [session, router, redirectUrl]);

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    setErrorMessage("");
    try {
      await googleSignIn(redirectUrl);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to initialize Google authentication.",
      );
      setIsLoadingGoogle(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoadingGuest(true);
    setErrorMessage("");

    try {
      await signIn.anonymous();
      router.replace(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to initialize guest session.");
    } finally {
      setIsLoadingGuest(false);
    }
  };

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-between bg-[#040609] text-white py-8 px-4 font-sans overflow-x-hidden">
      <AuthBackground />
      <AuthHeader mode="login" />

      <AuthCard
        badgeText="Valoguess Sign In"
        title="Sign In to ValoGuess"
        description=""
        errorMessage={errorMessage}
        footer={
          <>
            <div className="pt-4 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Don't have an account?</span>
              <Link
                href="/signup"
                className="text-[#FF4655] hover:text-[#ff6b77] font-semibold flex items-center gap-1 transition"
              >
                <span>Sign Up</span>
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

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-white/10" />

          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            or sign in with email
          </span>

          <span className="h-px flex-1 bg-white/10" />
        </div>

        <MagicLinkForm
          callbackURL={redirectUrl}
          disabled={isLoadingGoogle || isLoadingGuest}
        />

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-white/10" />

          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            or play as guest
          </span>

          <span className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoadingGoogle || isLoadingGuest}
          className="w-full h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          {isLoadingGuest ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Creating Guest Profile...</span>
            </>
          ) : (
            <span>Play as Guest</span>
          )}
        </button>
      </AuthCard>

      <div className="relative z-10 w-full text-center text-xs text-zinc-600 font-normal select-none shrink-0">
        © 2026 ValoGuess • Made with ❤️ by{" "}
        <a
          href="https://github.com/heyneerav"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0091ff] hover:text-[#0091ff]/80 transition"
        >
          Neerav
        </a>
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
            <span className="text-xs text-zinc-400 tracking-wider">
              Loading Authentication...
            </span>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
