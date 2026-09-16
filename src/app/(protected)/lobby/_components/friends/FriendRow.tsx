"use client";

import Image from "next/image";
import { X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "../types";

interface FriendRowProps {
  friend: Friend;
  onSelectToRemove: (friend: Friend) => void;
  onInvite?: (friend: Friend) => void;
}

export function FriendRow({
  friend,
  onSelectToRemove,
  onInvite,
}: FriendRowProps) {
  const isOffline = friend.status === "offline";

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded transition group",
        isOffline
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
          <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[120px]">
            {friend.name}
          </span>
          <span
            className={cn(
              "text-[8px] uppercase font-semibold tracking-wider font-display",
              isOffline ? "text-zinc-500" : "text-mint"
            )}
          >
            {isOffline
              ? "Offline"
              : friend.status === "online"
              ? `• ${friend.activity || "Online"}`
              : `• ${friend.activity || "In Match"}`}
          </span>
        </div>
      </div>

      {/* Invite button (only if not offline and handler provided) */}
      {!isOffline && onInvite && (
        <button
          onClick={() => onInvite(friend)}
          className="text-white/40 hover:text-accent p-1 transition cursor-pointer hover:scale-110"
          title="Invite to Party"
        >
          <UserPlus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
