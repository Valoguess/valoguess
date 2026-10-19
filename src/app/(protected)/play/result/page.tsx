"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/game");
  }, [router]);

  return (
    <div className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="h-10 w-10 text-accent animate-spin" />
      <span className="text-xs text-ink-500 uppercase tracking-widest mt-4 font-display">
        Redirecting to Match Result...
      </span>
    </div>
  );
}

