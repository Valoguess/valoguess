"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoomRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#040609] text-white select-none font-body">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
          <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
          <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
          <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
        </svg>
        <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">
          Redirecting to Party Lobby...
        </span>
      </div>
    </main>
  );
}
