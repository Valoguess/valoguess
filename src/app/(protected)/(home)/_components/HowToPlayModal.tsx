"use client";

import React from "react";
import { HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type HowToPlayModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0b0e14]/95 border border-white/10 w-[calc(100vw-2rem)] max-w-md p-6 shadow-2xl backdrop-blur-xl rounded-sm relative overflow-hidden select-none"
        onMouseLeave={onClose}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
              GAME RULES
            </span>
            <h3 className="font-valorant text-base tracking-wider text-white flex items-center gap-2 mt-0.5">
              <HelpCircle className="h-4 w-4 text-accent" />
              <span>HOW TO PLAY</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 py-3 text-left">
          <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
              01
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                SELECT SECRET AGENT
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                At the start of the match, both players are assigned a hidden secret agent from the active roster.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
              02
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                ASK YES/NO QUESTIONS
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Take turns asking questions about abilities, roles, or visual appearance (e.g. &quot;Can Heal?&quot;, &quot;Is Initiator?&quot;).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
              03
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                ELIMINATE CANDIDATES
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Based on your opponent&apos;s answer, eliminate agents on your grid by clicking them to narrow down the candidates.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xs border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-xs border border-[#FF4655]/30 shrink-0 mt-0.5">
              04
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                GUESS &amp; WIN
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                When you have deducted the opponent&apos;s identity, select their agent and lock in your guess to claim victory!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xs transition cursor-pointer active:scale-98"
        >
          UNDERSTOOD
        </button>
      </DialogContent>
    </Dialog>
  );
}
