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
      <DialogContent className="bg-transparent border-none max-w-lg p-0 shadow-none outline-none ring-0 focus-visible:ring-0" showCloseButton={false}>
        <div className="relative w-full clip-notch-both p-[1px] bg-gradient-to-b from-white/20 to-white/5 pointer-events-auto">
          <div className="clip-notch-both bg-base-900 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-5 w-5 text-accent" />
                <h3 className="font-valorant text-lg tracking-wider text-white">
                  HOW TO PLAY
                </h3>
              </div>
              
              <button 
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Steps Content */}
            <div className="space-y-5 text-left text-[13px] md:text-sm leading-relaxed text-ink-300">
              <div className="flex items-start gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20 font-display text-xs font-black text-accent shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-valorant text-[14px] tracking-wide text-white mb-1">
                    SELECT SECRET AGENT
                  </h4>
                  <p>At the start, you and your opponent are each assigned a secret Agent from the active roster.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20 font-display text-xs font-black text-accent shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-valorant text-[14px] tracking-wide text-white mb-1">
                    ASK YES/NO QUESTIONS
                  </h4>
                  <p>On your turn, choose a question about their Agent's abilities, roles, or aesthetic themes (e.g. "Can Heal?", "Uses Fire?").</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20 font-display text-xs font-black text-accent shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-valorant text-[14px] tracking-wide text-white mb-1">
                    ELIMINATE CANDIDATES
                  </h4>
                  <p>Based on their answer, eliminate agents on your grid by clicking them to narrow down the possibilities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 border border-accent/20 font-display text-xs font-black text-accent shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="font-valorant text-[14px] tracking-wide text-white mb-1">
                    GUESS AND WIN
                  </h4>
                  <p>When you are confident, select their agent and lock in your guess. Guess correctly to win the match!</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="w-full mt-8 py-3 bg-accent text-white font-valorant text-xs tracking-widest hover:bg-accent-glow hover:shadow-[0_0_15px_rgba(255,70,85,0.4)] transition-all duration-300 rounded-sm"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
