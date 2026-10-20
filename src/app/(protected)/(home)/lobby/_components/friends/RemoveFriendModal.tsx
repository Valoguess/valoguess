"use client";

import Image from "next/image";
import { UserMinus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Friend } from "../types";

interface RemoveFriendModalProps {
  friendToRemove: Friend | null;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving: boolean;
}

export function RemoveFriendModal({
  friendToRemove,
  onClose,
  onConfirm,
  isRemoving,
}: RemoveFriendModalProps) {
  return (
    <Dialog
      open={Boolean(friendToRemove)}
      onOpenChange={(open) => {
        if (!open && !isRemoving) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="bg-[#0b0e14]/95 border border-white/10 max-w-sm p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl rounded-none relative overflow-hidden"
      >
        {/* Top Valorant-style red accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

        <div className="flex flex-col items-center text-center space-y-4 pt-1">
          {/* Warning Icon Badge */}
          <div className="h-12 w-12 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/30 flex items-center justify-center text-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.2)]">
            <UserMinus className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
              CONFIRM ACTION
            </div>
            <h3 className="font-valorant text-lg tracking-wider text-white">
              REMOVE FRIEND
            </h3>
          </div>

          {/* Friend Card Preview */}
          {friendToRemove && (
            <div className="w-full flex items-center gap-3 p-3 bg-white/3 border border-white/10 rounded-sm">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                <Image
                  src={friendToRemove.avatar}
                  alt={friendToRemove.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-display font-bold text-sm text-white truncate">
                  {friendToRemove.name}
                </span>
                {friendToRemove.username && (
                  <span className="text-[10px] font-mono text-[#FF4655] truncate">
                    {friendToRemove.username}
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-400 leading-relaxed max-w-70">
            Are you sure you want to remove <span className="text-white font-semibold">{friendToRemove?.name}</span>? They will be removed from your friends list.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full pt-2">
            <button
              type="button"
              disabled={isRemoving}
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>

            <button
              type="button"
              disabled={isRemoving}
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs shadow-[0_0_15px_rgba(255,70,85,0.4)] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isRemoving ? (
                <span className="animate-pulse">REMOVING...</span>
              ) : (
                <>
                  <UserMinus className="h-3.5 w-3.5" />
                  <span>REMOVE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
