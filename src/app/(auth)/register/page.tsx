"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#040609] flex flex-col items-center justify-center text-white select-none">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-10 h-10 animate-pulse">
          <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
          <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
          <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
        </svg>
        <span className="text-xs text-zinc-400 tracking-wider">Redirecting to Registration...</span>
      </div>
    </main>
  );
}
