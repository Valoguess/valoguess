"use client";

interface PlayLoadingScreenProps {
  label?: string;
}

export function PlayLoadingScreen({ label = "Loading Game..." }: PlayLoadingScreenProps) {
  return (
    <main className="min-h-screen bg-base-950 flex flex-col items-center justify-center text-white select-none">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
          <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
          <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
          <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
        </svg>
        <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">
          {label}
        </span>
      </div>
    </main>
  );
}
