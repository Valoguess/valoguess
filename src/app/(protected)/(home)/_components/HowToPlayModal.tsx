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
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-valorant text-base tracking-wider text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-accent" />
            <span>HOW TO PLAY</span>
          </h3>

          <button
            onClick={onClose}
            className="p-1 rounded-sm text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            title="Close"
            aria-label="Close how to play dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 py-3 text-left">
          <div className="p-3 rounded-sm border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-sm border border-[#FF4655]/30 shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                ASSIGN SECRET AGENT
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                At match start, both players receive a hidden secret agent chosen from the active roster.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-sm border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-sm border border-[#FF4655]/30 shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                ASK YES/NO QUESTIONS
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Take turns asking questions about abilities, agent roles, or appearance (e.g. &quot;Can Heal?&quot;, &quot;Is Initiator?&quot;).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-sm border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-sm border border-[#FF4655]/30 shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                ELIMINATE CANDIDATES
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                Based on your opponent&apos;s answer, eliminate agents on your grid by clicking them to narrow candidates down.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-sm border border-white/10 bg-white/[0.02] flex items-start gap-3">
            <span className="font-mono text-[10px] font-bold text-[#FF4655] bg-[#FF4655]/10 px-1.5 py-0.5 rounded-sm border border-[#FF4655]/30 shrink-0 mt-0.5">
              4
            </span>
            <div className="space-y-0.5">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                GUESS &amp; WIN
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                When you have deducted the opponent&apos;s agent, select their card and lock in your guess to win the match.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          GOT IT
        </button>
      </DialogContent>
    </Dialog>
  );
}
