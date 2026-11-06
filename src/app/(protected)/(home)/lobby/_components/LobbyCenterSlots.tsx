"use client";

import React from "react";
import { Swords } from "lucide-react";
import { Party, PartyMember } from "@/types/party";
import { useAuthStore } from "@/store/authStore";
import { getAgentBannerPath } from "@/consts";
import { PlayerPodiumCard } from "./PlayerPodiumCard";

interface LobbyCenterSlotsProps {
  party: Party | null;
  me: { id: string; name: string } | null;
  opponent?: PartyMember | null;
  isHost: boolean;
  savedUsername: string;
  isCreatingOrJoining?: boolean;
  handleCreateParty?: () => void;
  handleKickGuest: () => void;
  onOpenInviteDialog: () => void;
  onCopyCode?: () => void;
  copied?: boolean;
}

export function LobbyCenterSlots({
  party,
  me,
  opponent,
  isHost,
  savedUsername,
  handleKickGuest,
  onOpenInviteDialog,
  onCopyCode,
  copied = false,
}: LobbyCenterSlotsProps) {
  const { user } = useAuthStore();
  const myBanner = getAgentBannerPath(user?.banner || "chamber");
  const oppBanner = getAgentBannerPath((opponent as any)?.banner || "jett");

  const myName = me?.name || savedUsername || user?.name || "AGENT";
  const myRole = isHost ? "LEADER" : "MEMBER";
  const mySubtitle = isHost ? "HOST • 1V1 DUELIST" : "CHALLENGER • 1V1 DUELIST";

  const oppName = opponent?.name || "CHALLENGER";
  const oppRole = !isHost ? "LEADER" : "CHALLENGER";
  const oppSubtitle = !isHost ? "HOST • 1V1 DUELIST" : "READY FOR MATCH";

  return (
    <div className="flex-1 w-full flex items-center justify-center gap-3 sm:gap-6 h-[340px] sm:h-full max-h-[500px] max-w-3xl px-2">
      <PlayerPodiumCard
        name={myName}
        role={myRole}
        subtitle={mySubtitle}
        bannerPath={myBanner}
      />

      <div className="flex flex-col items-center justify-center shrink-0 gap-2">
        <div className="h-8 sm:h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-white/5" />
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-white/15 bg-[#0b0e14] flex items-center justify-center text-white/60 shadow-sm">
          <Swords className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FF4655]" />
        </div>
        <span className="font-valorant text-[10px] sm:text-xs text-white/40 tracking-widest">
          VS
        </span>
        <div className="h-8 sm:h-16 w-px bg-gradient-to-t from-transparent via-white/20 to-white/5" />
      </div>

      {opponent ? (
        <PlayerPodiumCard
          name={oppName}
          role={oppRole}
          subtitle={oppSubtitle}
          bannerPath={oppBanner}
          canKick={isHost}
          onKick={handleKickGuest}
        />
      ) : (
        <PlayerPodiumCard
          isVacant
          onOpenInvite={onOpenInviteDialog}
          onCopyCode={onCopyCode}
          copied={copied}
        />
      )}
    </div>
  );
}
