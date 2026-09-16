"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { AgentBanner } from "../constants";

interface ProfileCardPreviewProps {
  currentBanner: AgentBanner;
  name: string;
  username: string;
  tagline: string;
  hideName: boolean;
}

export function ProfileCardPreview({
  currentBanner,
  name,
  username,
  tagline,
  hideName,
}: ProfileCardPreviewProps) {
  return (
    <div className="w-full bg-[#080B10]/80 border border-white/10 rounded-sm p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Subtle Top Red Edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-accent to-transparent" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex flex-col text-left space-y-2 max-w-md">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
            <Sparkles className="h-3 w-3" />
            <span>LIVE PROFILE CARD PREVIEW</span>
          </div>
          <h2 className="font-valorant text-2xl tracking-wider text-white">
            TACTICAL IDENTITY
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This is how other players see your identity in lobby slots, friends hub, and party match screens.
          </p>
        </div>

        {/* Right: The Valorant Player Card */}
        <div className="w-full max-w-md sm:w-96 rounded-sm border border-white/15 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative bg-black/90 group">
          {/* Full Banner Header Art */}
          <div className="relative h-28 w-full overflow-hidden">
            <Image
              src={currentBanner.bannerPath}
              alt={currentBanner.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#080B10] via-[#080B10]/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-[#080B10]/80 via-transparent to-transparent" />

            {/* Agent Tag Badge in Banner */}
            <span className="absolute top-2.5 right-2.5 text-[8.5px] font-display font-bold uppercase tracking-widest text-white/80 bg-black/60 px-2 py-0.5 rounded-xs border border-white/10 backdrop-blur-xs">
              {currentBanner.name} • {currentBanner.role}
            </span>
          </div>

          {/* Card Body with Avatar, Name, Handle, Tagline */}
          <div className="p-4 pt-0 relative flex items-start gap-3.5">
            {/* Floating Avatar */}
            <div className="relative -mt-8 h-16 w-16 rounded-sm overflow-hidden border-2 border-accent shrink-0 shadow-[0_0_15px_rgba(255,70,85,0.4)] bg-black">
              <Image
                src={currentBanner.iconPath}
                alt={name || "Agent"}
                fill
                className="object-cover object-top"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-mint rounded-tl-sm border-t border-l border-black shadow-[0_0_8px_#3cf2c4]" />
            </div>

            {/* Names and Tagline */}
            <div className="flex flex-col text-left min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-valorant text-lg tracking-wider text-white truncate max-w-[180px]">
                  {name || "AGENT"}
                </span>
                {hideName && (
                  <span
                    className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#FF4655]/20 text-[#FF4655] border border-[#FF4655]/40"
                    title="Hidden from strangers"
                  >
                    HIDDEN
                  </span>
                )}
              </div>

              <span className="font-mono text-xs text-accent truncate">
                @{username || "agent"}
              </span>

              <span className="mt-1 text-[9px] font-display font-black tracking-[0.2em] text-amber-400 uppercase truncate">
                {tagline || "CLUTCH SPECIALIST"}
              </span>
            </div>
          </div>

          {/* Bottom Card Strip */}
          <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>STATUS: ONLINE</span>
            <span className="text-mint">VALOGUESS OPERATOR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
