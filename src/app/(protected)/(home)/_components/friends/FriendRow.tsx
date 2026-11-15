"use client";

import { useState } from "react";
import Image from "next/image";
import { X, UserPlus, UserMinus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "@/types/friends";

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
        "flex items-center justify-between p-2 rounded-sm transition group",
        hasIncomingInvite
          ? "bg-mint/[0.08] border border-mint/40"
          : isOffline
          ? "bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 opacity-60 hover:opacity-80"
          : "bg-white/[0.02] hover:bg-white/[0.06] border border-white/5"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0"
          title={`${friend.name} (${friend.status})`}
        >
          <Image
            src={friend.avatar}
            alt={friend.name}
            fill
            className={cn(
              "object-cover object-top transition-all duration-200",
              isOffline && "grayscale opacity-50"
            )}
          />

          <div
            className={cn(
              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black",
              friend.status === "online"
                ? "bg-mint"
                : friend.status === "ingame"
                ? "bg-amber-400"
                : "bg-zinc-600"
            )}
          />
        </div>

        <div className="flex flex-col text-left min-w-0">
          <span className="font-display text-xs font-bold text-white tracking-wide truncate max-w-[110px] uppercase">
            {friend.name}
          </span>
          <span
            className={cn(
              "text-xs font-mono font-medium tracking-wide",
              hasIncomingInvite
                ? "text-mint flex items-center gap-1"
                : isOffline
                ? "text-white/40"
                : "text-mint"
            )}
          >
            {hasIncomingInvite ? (
              <>
                <span className="h-1.5 w-1.5 rounded-sm bg-mint animate-ping" />
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

      {hasIncomingInvite ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAcceptIncomingInvite?.();
            }}
            className="h-6.5 w-6.5 rounded-sm bg-mint/20 hover:bg-mint/30 border border-mint/50 text-mint flex items-center justify-center transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            title="Accept Invite (✓)"
            aria-label="Accept party invite"
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeclineIncomingInvite?.();
            }}
            className="h-6.5 w-6.5 rounded-sm bg-[#FF4655]/20 hover:bg-[#FF4655]/30 border border-[#FF4655]/50 text-[#FF4655] flex items-center justify-center transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            title="Decline Invite (✕)"
            aria-label="Decline party invite"
          >
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 shrink-0">
          {!isOffline && onInvite && (
            <button
              onClick={handleInviteClick}
              className={cn(
                "p-1 rounded-sm transition cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                justInvited
                  ? "text-mint bg-mint/15"
                  : "text-white/40 hover:text-accent hover:bg-white/5"
              )}
              title="Invite to Party"
              aria-label="Invite friend to party"
            >
              {justInvited ? (
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              ) : (
                <UserPlus className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectToRemove(friend);
            }}
            className="p-1 rounded-sm text-white/30 hover:text-[#FF4655] hover:bg-white/5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF4655]/50"
            title={`Remove ${friend.name}`}
            aria-label={`Remove ${friend.name} from friends list`}
          >
            <UserMinus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
