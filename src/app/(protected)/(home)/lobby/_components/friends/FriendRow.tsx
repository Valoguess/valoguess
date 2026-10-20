"use client";

import { useState } from "react";
import Image from "next/image";
import { X, UserPlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "../types";

interface FriendRowProps {
  friend: Friend;
  onSelectToRemove: (friend: Friend) => void;
  onInvite?: (friend: Friend) => void;
  isInvited?: boolean;
  onCancelInvite?: (friend: Friend) => void;
  hasIncomingInvite?: boolean;
  onAcceptIncomingInvite?: () => void;
  onDeclineIncomingInvite?: () => void;
}

export function FriendRow({
  friend,
  onSelectToRemove,
  onInvite,
  hasIncomingInvite = false,
  onAcceptIncomingInvite,
  onDeclineIncomingInvite,
}: FriendRowProps) {
  const isOffline = friend.status === "offline" && !hasIncomingInvite;
  const [justInvited, setJustInvited] = useState(false);

  const handleInviteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onInvite) return;
    onInvite(friend);
    setJustInvited(true);
    setTimeout(() => {
      setJustInvited(false);
    }, 1200);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded transition group",
        hasIncomingInvite
          ? "bg-mint/[0.08] border border-mint/40 shadow-[0_0_12px_rgba(60,242,196,0.15)] animate-pulse"
          : isOffline
          ? "bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 opacity-60 hover:opacity-80"
          : "bg-white/[0.02] hover:bg-white/[0.06] border border-white/5"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Avatar with status dot and hover-to-remove cross */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectToRemove(friend);
          }}
          className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0 group/avatar cursor-pointer"
          title={`Remove ${friend.name}`}
        >
          <Image
            src={friend.avatar}
            alt={friend.name}
            fill
            className={cn(
              "object-cover object-top transition-all duration-200 group-hover/avatar:scale-110",
              isOffline && "grayscale opacity-50 group-hover/avatar:opacity-80"
            )}
          />

          <div
            className={cn(
              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black transition-opacity duration-150 group-hover/avatar:opacity-0",
              friend.status === "online"
                ? "bg-mint shadow-[0_0_6px_#3cf2c4]"
                : friend.status === "ingame"
                ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                : "bg-zinc-600"
            )}
          />

          {/* Hover Cross */}
          <div className="absolute inset-0 bg-[#FF4655]/85 opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 flex items-center justify-center text-white z-10 rounded-full shadow-[0_0_8px_rgba(255,70,85,0.7)]">
            <X className="h-3.5 w-3.5 stroke-[3] text-white" />
          </div>
        </div>

        {/* Friend info */}
        <div className="flex flex-col text-left min-w-0">
          <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[110px]">
            {friend.name}
          </span>
          <span
            className={cn(
              "text-[8px] uppercase font-semibold tracking-wider font-display",
              hasIncomingInvite
                ? "text-mint font-bold flex items-center gap-1"
                : isOffline
                ? "text-zinc-500"
                : "text-mint"
            )}
          >
            {hasIncomingInvite ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-mint animate-ping" />
                INVITED YOU
              </>
            ) : isOffline ? (
              "Offline"
            ) : friend.status === "online" ? (
              `• ${friend.activity || "Online"}`
            ) : (
              `• ${friend.activity || "In Match"}`
            )}
          </span>
        </div>
      </div>

      {/* Action buttons alongside friend: Tick (✓) & Cross (✕) for incoming invite, or repeat invite button */}
      {hasIncomingInvite ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAcceptIncomingInvite?.();
            }}
            className="h-6.5 w-6.5 rounded bg-mint/25 hover:bg-mint/40 border border-mint/60 text-mint flex items-center justify-center transition cursor-pointer hover:scale-110 shadow-[0_0_8px_rgba(60,242,196,0.35)]"
            title="Accept Invite (✓)"
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeclineIncomingInvite?.();
            }}
            className="h-6.5 w-6.5 rounded bg-[#FF4655]/25 hover:bg-[#FF4655]/40 border border-[#FF4655]/50 text-[#FF4655] flex items-center justify-center transition cursor-pointer hover:scale-110 shadow-[0_0_8px_rgba(255,70,85,0.35)]"
            title="Decline Invite (✕)"
          >
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </button>
        </div>
      ) : !isOffline && onInvite ? (
        <button
          onClick={handleInviteClick}
          className={cn(
            "p-1 rounded transition cursor-pointer hover:scale-110 shrink-0",
            justInvited
              ? "text-mint bg-mint/15 shadow-[0_0_8px_rgba(60,242,196,0.3)]"
              : "text-white/40 hover:text-accent hover:bg-white/5"
          )}
          title="Invite to Party"
        >
          {justInvited ? (
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          ) : (
            <UserPlus className="h-3.5 w-3.5" />
          )}
        </button>
      ) : null}
    </div>
  );
}
