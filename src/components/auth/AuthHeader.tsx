"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  mode: "login" | "signup";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  const isLogin = mode === "login";

  return (
    <header className="w-full max-w-5xl relative z-10 flex items-center justify-between shrink-0 mb-6 md:mb-0">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-9 h-9 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ValoGuess Logo"
            fill
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="font-bold text-base tracking-wider text-white">VALOGUESS</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#FF4655]">
            {isLogin ? "TACTICAL AUTHENTICATION" : "AGENT ENROLLMENT"}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
          {isLogin ? "New agent?" : "Already registered?"}
        </span>
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="text-xs font-semibold text-zinc-300 hover:text-white transition px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8"
        >
          {isLogin ? "Create Account" : "Sign In"}
        </Link>
      </div>
    </header>
  );
}
