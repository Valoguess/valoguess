"use client";

import React, { useState } from "react";
import { Users, X, Check, Copy } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type InviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
};

export function InviteModal({ isOpen, onClose, inviteCode }: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/play?room=${inviteCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-transparent border-none max-w-md p-0 shadow-none outline-none ring-0 focus-visible:ring-0" showCloseButton={false}>
        <div className="relative w-full clip-notch-both p-[1px] bg-gradient-to-b from-violet/40 to-violet/5 pointer-events-auto">
          <div className="clip-notch-both bg-base-900 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-violet" />
                <h3 className="font-valorant text-lg tracking-wider text-white">
                  CREATE PRIVATE ROOM
                </h3>
              </div>
              
              <button 
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center">
              <p className="text-[13px] text-ink-400 mb-6 leading-relaxed">
                Share the room code below with a friend to invite them to a 1v1 agent-guessing duel.
              </p>

              {/* Code Box */}
              <div className="flex flex-col items-center justify-center bg-black/45 border border-white/5 rounded-sm py-4 px-6 mb-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/35 font-bold mb-1">
                  Your Room Code
                </span>
                <span className="font-valorant text-3xl text-violet tracking-widest drop-shadow-[0_0_8px_rgba(140,123,255,0.4)] selection:bg-violet/30 selection:text-white">
                  {inviteCode}
                </span>
              </div>

              {/* Copy Link Button */}
              <button 
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display text-xs font-bold uppercase tracking-widest transition-all duration-200 rounded-sm mb-3 group"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-mint" />
                    <span className="text-mint">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                    <span>Copy Invite Link</span>
                  </>
                )}
              </button>

              {/* Launch Game Button */}
              <Link 
                href={`/lobby?code=${inviteCode}&host=true`}
                onClick={onClose}
                className="w-full flex items-center justify-center py-3 bg-violet text-white font-valorant text-xs tracking-widest hover:bg-violet/90 hover:shadow-[0_0_15px_rgba(140,123,255,0.4)] transition-all duration-300 rounded-sm"
              >
                LAUNCH LOBBY
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
