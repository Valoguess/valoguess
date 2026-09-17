"use client";

import Image from "next/image";
import { Tag, Image as ImageIcon, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AgentBanner, PRESET_TAGLINES } from "../constants";

interface BannerTaglineTabProps {
  tagline: string;
  setTagline: (val: string) => void;
  bannerSearch: string;
  setBannerSearch: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  filteredBanners: AgentBanner[];
  selectedBannerId: string;
  setSelectedBannerId: (val: string) => void;
}

export function BannerTaglineTab({
  tagline,
  setTagline,
  bannerSearch,
  setBannerSearch,
  selectedRole,
  setSelectedRole,
  filteredBanners,
  selectedBannerId,
  setSelectedBannerId,
}: BannerTaglineTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* 1. TAGLINE INPUT & PRESETS */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 space-y-4">
        <div className="space-y-1">
          <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-400" /> PLAYER TAGLINE / TITLE
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            A custom title or battle motto shown under your name on your player card.
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value.toUpperCase().slice(0, 36))}
            placeholder="E.G. CLUTCH SPECIALIST"
            className="bg-black/60 border-white/15 text-amber-400 font-display text-sm tracking-wider uppercase h-11 focus:border-amber-400"
          />

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              RECOMMENDED PRESETS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGLINES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTagline(preset)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[10px] font-display font-bold tracking-wider uppercase transition border cursor-pointer",
                    tagline === preset
                      ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. AGENT BANNER SELECTOR GRID */}
      <div className="bg-[#080B10]/70 border border-white/10 rounded-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-valorant text-sm tracking-wider text-white flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-accent" /> SELECT BANNER IMAGE
            </span>
            <p className="text-xs text-zinc-400">
              Pick your signature agent art card for your tactical profile.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={bannerSearch}
              onChange={(e) => setBannerSearch(e.target.value)}
              placeholder="FILTER AGENT..."
              className="pl-8 bg-black/60 border-white/15 text-xs font-display uppercase tracking-wider h-8 text-white placeholder-white/30"
            />
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                "py-1 px-3 rounded-xs text-[10px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                selectedRole === role
                  ? "bg-accent border-accent text-white shadow-[0_0_10px_rgba(255,70,85,0.3)]"
                  : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredBanners.map((banner) => {
            const isSelected = selectedBannerId === banner.id;
            return (
              <div
                key={banner.id}
                onClick={() => setSelectedBannerId(banner.id)}
                className={cn(
                  "relative rounded-sm overflow-hidden border-2 transition-all cursor-pointer group flex flex-col bg-black/80 aspect-4/3",
                  isSelected
                    ? "border-accent shadow-[0_0_15px_rgba(255,70,85,0.4)] scale-102"
                    : "border-white/10 hover:border-white/30 hover:scale-101 opacity-75 hover:opacity-100"
                )}
              >
                <Image
                  src={banner.bannerPath}
                  alt={banner.name}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-accent text-white rounded-full flex items-center justify-center shadow">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}

                <div className="absolute bottom-1.5 left-2 right-2 flex flex-col">
                  <span className="font-valorant text-xs text-white tracking-wider leading-none">
                    {banner.name}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-400 tracking-wide mt-0.5">
                    {banner.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
