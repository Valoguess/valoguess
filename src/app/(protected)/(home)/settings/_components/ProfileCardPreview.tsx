"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { AgentBanner } from "@/consts";

interface ProfileCardPreviewProps {
  currentBanner: AgentBanner;
  name: string;
  username: string;
  tagline: string;
  avatarUrl?: string | null;
}

export function ProfileCardPreview({
  currentBanner,
  name,
  username,
  tagline,
  avatarUrl,
}: ProfileCardPreviewProps) {
  const displayAvatar = avatarUrl || currentBanner.iconPath;

  return (
    <div className="w-full bg-[#080b10]/80 border border-white/10 rounded-sm p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col text-left space-y-2 max-w-md">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
            <Sparkles className="h-3 w-3" />
            <span>PLAYER CARD PREVIEW</span>
          </div>
          <h2 className="font-valorant text-xl sm:text-2xl tracking-wider text-white">
            TACTICAL IDENTITY
          </h2>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            This card represents your identity across 1v1 duels, party lobbies, and friend lists.
          </p>
        </div>

        <div className="w-full max-w-md sm:w-96 rounded-sm border border-white/15 overflow-hidden relative bg-black/90 group">
          <div className="relative h-28 w-full overflow-hidden">
            <Image
              src={currentBanner.bannerPath}
              alt={currentBanner.name}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080b10] via-[#080b10]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080b10]/80 via-transparent to-transparent" />

            <span className="absolute top-2.5 right-2.5 text-[9px] font-display font-bold uppercase tracking-widest text-white/80 bg-black/60 px-2 py-0.5 rounded-xs border border-white/10 backdrop-blur-xs">
              {currentBanner.name} • {currentBanner.role}
            </span>
          </div>

          <div className="p-4 pt-0 relative flex items-start gap-3.5">
            <div className="relative -mt-8 h-16 w-16 rounded-sm overflow-hidden border-2 border-[#FF4655] shrink-0 bg-black shadow-md">
              <Image
                src={displayAvatar}
                alt={name || "Agent"}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-mint rounded-tl-sm border-t border-l border-black" />
            </div>

            <div className="flex flex-col text-left min-w-0 flex-1 pt-1">
              <span className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white truncate max-w-[200px]">
                {name || "AGENT"}
              </span>

              <span className="font-mono text-xs text-[#FF4655] truncate">
                @{username || "agent"}
              </span>

              <span className="mt-1 text-[9px] font-display font-bold tracking-[0.2em] text-amber-400 uppercase truncate">
                {tagline || "CLUTCH SPECIALIST"}
              </span>
            </div>
          </div>

          <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[9px] font-mono text-white/40">
            <span>STATUS: READY</span>
            <span className="text-mint font-bold">1V1 DUELIST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
