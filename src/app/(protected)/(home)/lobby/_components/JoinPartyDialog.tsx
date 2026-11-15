"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Hash, Loader2, ArrowRight } from "lucide-react";

interface JoinPartyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinParty: (code: string) => void;
  isJoining?: boolean;
}

export function JoinPartyDialog({
  isOpen,
  onOpenChange,
  onJoinParty,
  isJoining = false,
}: JoinPartyDialogProps) {
  const [codeInput, setCodeInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeInput.trim().replace(/^#/, "");
    if (!clean || isJoining) return;
    onJoinParty(clean);
    setCodeInput("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#07090e]/98 border border-white/10 text-white backdrop-blur-2xl sm:max-w-sm w-full p-6 select-none rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <DialogTitle className="sr-only">Join Party</DialogTitle>

        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-[#FF4655] mb-3.5">
            <Hash className="h-6 w-6" />
          </div>

          <h3 className="font-valorant text-lg tracking-wider text-white mb-1.5 uppercase">
            JOIN WITH PARTY CODE
          </h3>
          <p className="text-xs text-white/50 font-sans mb-5 leading-relaxed">
            Enter the party code shared by your friend to join their duel.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter party code..."
                className="w-full h-11 bg-white/[0.04] border border-white/15 focus:border-[#FF4655] px-3.5 rounded-sm font-mono text-xs text-white placeholder-white/30 outline-none transition uppercase tracking-wider text-center"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-10 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={!codeInput.trim() || isJoining}
                className="flex-1 h-10 rounded-sm bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40 active:scale-98 shadow-[0_0_15px_rgba(255,70,85,0.25)]"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>JOINING...</span>
                  </>
                ) : (
                  <>
                    <span>JOIN PARTY</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
