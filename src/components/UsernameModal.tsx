"use client";

import React, { useState, useEffect } from "react";
import { Users, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type UsernameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (username: string) => void;
  pendingAction: "join" | "create" | "";
};

export function UsernameModal({
  isOpen,
  onClose,
  onConfirm,
  pendingAction,
}: UsernameModalProps) {
  const [usernameInput, setUsernameInput] = useState("");

  // Load saved username when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("username");
      if (saved) {
        setUsernameInput(saved);
      } else {
        setUsernameInput("");
      }
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!usernameInput.trim()) return;
    onConfirm(usernameInput.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-transparent border-none max-w-md p-0 shadow-none outline-none ring-0 focus-visible:ring-0" showCloseButton={false}>
        <div className="relative w-full clip-notch-both p-[1px] bg-gradient-to-b from-accent/40 to-accent/5 pointer-events-auto">
          <div className="clip-notch-both bg-base-900 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-accent" />
                <h3 className="font-valorant text-lg tracking-wider text-white">
                  SECURE CALLSIGN
                </h3>
              </div>
              
              <button 
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 text-left">
              <p className="text-[13px] text-ink-400 leading-relaxed font-semibold tracking-wide">
                IDENTIFICATION REQUIRED. Enter your tactical callsign to connect to the lobby.
              </p>

              {/* Input container */}
              <div className="flex items-center w-full bg-black/35 border border-white/5 rounded-sm focus-within:border-accent/40 transition-colors duration-300 relative overflow-hidden">
                <div className="flex shrink-0 items-center justify-center w-12 h-11 bg-white/[0.03] border-r border-white/5 text-white/35 font-display text-[10px] font-bold tracking-[0.15em]">
                  AGENT
                </div>
                
                <Input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODENAME"
                  className="w-full h-11 bg-transparent border-none rounded-none px-4 font-display text-white placeholder-white/20 tracking-[0.18em] uppercase outline-none text-xs sm:text-sm focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
                  maxLength={15}
                  autoFocus
                />
              </div>

              {/* Random Generator */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const randomNames = ["Viper", "Phoenix", "Sage", "Jett", "Cypher", "Reyna", "Omen", "Breach", "Sova", "Raze", "Killjoy", "Skye", "Yoru", "Astra", "KAYO", "Chamber", "Neon", "Fade", "Harbor", "Gekko", "Deadlock", "Iso", "Clove"];
                    const num = Math.floor(1000 + Math.random() * 9000);
                    setUsernameInput(`${randomNames[Math.floor(Math.random() * randomNames.length)].toUpperCase()}#${num}`);
                  }}
                  className="text-[9px] uppercase tracking-[0.15em] text-accent/80 hover:text-accent font-display font-semibold transition-colors duration-200"
                >
                  Generate Random Callsign
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 border border-white/10 text-white/70 hover:text-white font-valorant text-[10px] tracking-[0.15em] hover:bg-white/5 transition-all duration-300 rounded-sm"
                >
                  CANCEL
                </button>

                <button 
                  onClick={handleConfirm}
                  disabled={!usernameInput.trim()}
                  className="flex-1 py-3 bg-accent text-white font-valorant text-[10px] tracking-[0.15em] hover:bg-accent-glow hover:shadow-[0_0_15px_rgba(255,70,85,0.4)] transition-all duration-300 rounded-sm disabled:opacity-30 disabled:pointer-events-none"
                >
                  {pendingAction === "join" ? "CONFIRM & JOIN" : "CONFIRM & CREATE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
