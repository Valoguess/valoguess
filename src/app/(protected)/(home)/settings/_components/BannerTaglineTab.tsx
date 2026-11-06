"use client";

import Image from "next/image";
import { Tag, Image as ImageIcon, Search, Check, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AgentBanner, PRESET_TAGLINES } from "@/consts";

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
  onSave?: () => void;
  isSaving?: boolean;
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
  onSave,
  isSaving = false,
}: BannerTaglineTabProps) {
  return (
    <div className="space-y-6 text-left">
      <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-400" /> PLAYER TAGLINE / TITLE
          </span>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            A tactical motto or specialization displayed under your name on your player card.
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

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
              RECOMMENDED PRESETS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGLINES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTagline(preset)}
                  className={cn(
                    "px-2.5 py-1 rounded-xs text-[10px] font-display font-bold tracking-wider uppercase transition border cursor-pointer",
                    tagline === preset
                      ? "bg-amber-400/20 border-amber-400 text-amber-300"
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

      <div className="bg-[#080b10]/75 border border-white/10 rounded-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-valorant text-xs sm:text-sm tracking-wider text-white flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#FF4655]" /> SELECT SIGNATURE BANNER
            </span>
            <p className="text-xs text-white/50 font-sans">
              Choose your agent banner art to frame your player podium card.
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="h-3.5 w-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={bannerSearch}
              onChange={(e) => setBannerSearch(e.target.value)}
              placeholder="SEARCH AGENT..."
              className="pl-8 bg-black/60 border-white/15 text-xs font-display uppercase tracking-wider h-9 text-white placeholder-white/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                "py-1 px-3 rounded-xs text-[10px] font-display font-bold uppercase tracking-wider transition border cursor-pointer",
                selectedRole === role
                  ? "bg-[#FF4655] border-[#FF4655] text-white"
                  : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredBanners.map((banner) => {
            const isSelected = selectedBannerId === banner.id;
            return (
              <div
                key={banner.id}
                onClick={() => setSelectedBannerId(banner.id)}
                className={cn(
                  "relative rounded-sm overflow-hidden border transition-all cursor-pointer group flex flex-col bg-black/80 aspect-4/3",
                  isSelected
                    ? "border-[#FF4655] ring-1 ring-[#FF4655]"
                    : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={banner.bannerPath}
                  alt={banner.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#FF4655] text-white rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}

                <div className="absolute bottom-1.5 left-2 right-2 flex flex-col">
                  <span className="font-valorant text-xs text-white tracking-wider leading-none">
                    {banner.name}
                  </span>
                  <span className="text-[8px] font-mono text-white/50 tracking-wide mt-0.5 uppercase">
                    {banner.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {onSave && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080b10]/60 border border-white/10 rounded-sm p-4">
          <span className="text-xs text-white/40 font-mono">
            Save banner and tagline customizations.
          </span>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full sm:w-auto py-2.5 px-6 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>SAVE BANNER &amp; TAGLINE</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
