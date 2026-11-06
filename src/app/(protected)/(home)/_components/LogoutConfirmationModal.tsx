"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAnonymous: boolean;
  isLoggingOut: boolean;
  onConfirmLogout: () => void;
}

export function LogoutConfirmationModal({
  isOpen,
  onOpenChange,
  isAnonymous,
  isLoggingOut,
  onConfirmLogout,
}: LogoutConfirmationModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoggingOut) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="bg-[#0b0e14]/95 border border-white/10 w-[calc(100vw-2rem)] max-w-sm p-6 shadow-2xl backdrop-blur-xl rounded-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF4655]" />

        {isLoggingOut ? (
          <div className="flex flex-col items-center text-center space-y-4 py-3">
            <div className="h-12 w-12 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/30 flex items-center justify-center text-[#FF4655]">
              <Loader2 className="h-6 w-6 animate-spin text-[#FF4655]" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
                SIGNING OUT
              </div>
              <h3 className="font-valorant text-base tracking-wider text-white">
                SIGNING OUT...
              </h3>
            </div>

            <p className="text-xs text-white/50 leading-relaxed max-w-[280px]">
              Signing out and returning to sign in screen...
            </p>

            <div className="w-full bg-white/5 h-1 overflow-hidden rounded-full mt-2">
              <div className="h-full bg-[#FF4655] animate-pulse w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 pt-1">
            <div className="h-12 w-12 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/30 flex items-center justify-center text-[#FF4655]">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF4655] font-bold">
                SESSION TERMINATION
              </div>
              <h3 className="font-valorant text-lg tracking-wider text-white">
                LOG OUT OF VALOGUESS?
              </h3>
            </div>

            <p className="text-xs text-white/50 leading-relaxed max-w-[280px]">
              {isAnonymous
                ? "You are using a guest session. Logging out will clear your local guest session and return you to the sign-in screen."
                : "Are you sure you want to end your session? You will need to sign in again to access party duels and saved stats."}
            </p>

            <div className="flex items-center gap-2.5 w-full pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={onConfirmLogout}
                className="flex-1 py-2.5 px-4 bg-[#FF4655] hover:bg-[#ff5a67] text-white font-display text-xs font-bold uppercase tracking-wider rounded-sm transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>LOG OUT</span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
