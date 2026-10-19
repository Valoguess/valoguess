"use client";

import { TopNavbar } from "@/components/navigation/TopNavbar";

interface LobbyHeaderProps {
  savedUsername: string;
  onOpenHowToPlay: () => void;
  onOpenSettings?: () => void;
}

export function LobbyHeader({
  savedUsername,
  onOpenHowToPlay,
}: LobbyHeaderProps) {
  return (
    <TopNavbar
      savedUsername={savedUsername}
      onOpenHowToPlay={onOpenHowToPlay}
    />
  );
}

