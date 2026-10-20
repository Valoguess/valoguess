"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { FriendRequest } from "../types";

interface IncomingRequestRowProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export function IncomingRequestRow({
  request,
  onAccept,
  onDecline,
}: IncomingRequestRowProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition">
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/20 shrink-0">
          <Image
            src={request.avatar}
            alt={request.name}
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[100px]">
            {request.name}
          </span>
          {request.username && (
            <span className="text-[8.5px] text-[#FF4655] font-mono truncate">
              {request.username}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onAccept(request.id)}
          className="h-6 w-6 rounded bg-mint/20 hover:bg-mint/30 border border-mint/40 text-mint flex items-center justify-center transition cursor-pointer"
          title="Accept Friend Request"
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </button>
        <button
          onClick={() => onDecline(request.id)}
          className="h-6 w-6 rounded bg-[#FF4655]/20 hover:bg-[#FF4655]/30 border border-[#FF4655]/40 text-[#FF4655] flex items-center justify-center transition cursor-pointer"
          title="Decline Friend Request"
        >
          <X className="h-3.5 w-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

interface OutgoingRequestRowProps {
  request: FriendRequest;
  onCancel: (requestId: string) => void;
}

export function OutgoingRequestRow({
  request,
  onCancel,
}: OutgoingRequestRowProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/10 transition">
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/15 shrink-0 opacity-80">
          <Image
            src={request.avatar}
            alt={request.name}
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span className="font-display text-[11px] font-bold text-white/90 tracking-wide truncate max-w-[110px]">
            {request.name}
          </span>
          <span className="text-[8.5px] text-amber-400 font-display font-semibold">
            Pending confirmation...
          </span>
        </div>
      </div>

      <button
        onClick={() => onCancel(request.id)}
        className="text-white/40 hover:text-[#FF4655] p-1 rounded transition cursor-pointer"
        title="Cancel Request"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
