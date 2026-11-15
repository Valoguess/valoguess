"use client";

import React from "react";
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
  handleKickGuest: () => void;
  onOpenInviteDialog: () => void;
  onCopyCode?: () => void;
  copied?: boolean;
  onOpenJoinDialog?: () => void;
  showPartyCode?: boolean;
  onToggleRevealCode?: () => void;
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
  onOpenJoinDialog,
  showPartyCode = false,
  onToggleRevealCode,
}: LobbyCenterSlotsProps) {
  const { user } = useAuthStore();
  const myBanner = getAgentBannerPath(user?.banner || "chamber");
  const oppBanner = getAgentBannerPath((opponent as any)?.banner || "jett");

  const myName = me?.name || savedUsername || user?.name || "AGENT";
  const myRole = isHost ? "HOST" : "PLAYER";
  const mySubtitle = isHost ? "Party Leader" : "Member";

  const oppName = opponent?.name || "PLAYER 2";
  const oppRole = !isHost ? "HOST" : "PLAYER";
  const oppSubtitle = !isHost ? "Party Leader" : "Challenger";

  return (
    <div className="flex-1 w-full flex items-center justify-center gap-3 sm:gap-6 h-[400px] sm:h-full max-h-[540px] max-w-3xl px-2">
      <PlayerPodiumCard
        name={myName}
        role={myRole}
        subtitle={mySubtitle}
        bannerPath={myBanner}
      />

      <div className="flex flex-col items-center justify-center shrink-0 px-2 sm:px-4">
        <span className="font-valorant text-base sm:text-xl text-white/30 tracking-widest select-none">
          VS
        </span>
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
          partyCode={party?.id}
          showPartyCode={showPartyCode}
          onToggleRevealCode={onToggleRevealCode}
          onOpenInvite={onOpenInviteDialog}
          onCopyCode={onCopyCode}
          copied={copied}
          onOpenJoinDialog={onOpenJoinDialog}
        />
      )}
    </div>
  );
}