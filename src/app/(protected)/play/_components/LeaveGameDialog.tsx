"use client";

import { LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LeaveGameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLeave: () => void;
}

export function LeaveGameDialog({
  isOpen,
  onOpenChange,
  onConfirmLeave,
}: LeaveGameDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#090d14]/95 border border-[#FF4655]/40 w-[calc(100vw-2rem)] max-w-sm p-6 text-center text-white backdrop-blur-xl shadow-[0_0_35px_rgba(255,70,85,0.25)] rounded-sm">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border border-[#FF4655]/60 bg-[#FF4655]/15 flex items-center justify-center mb-4 text-[#FF4655] shadow-[0_0_15px_rgba(255,70,85,0.3)]">
            <LogOut className="h-6 w-6" />
          </div>
          <h3 className="font-valorant text-xl tracking-wider text-white mb-2">
            LEAVE MATCH?
          </h3>
          <p className="text-xs text-white/60 mb-6 font-medium">
            Are you sure you want to exit the match? Leaving will forfeit your current duel and return you to the lobby.
          </p>
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmLeave}
              className="flex-1 py-2.5 rounded-sm border border-[#FF4655] bg-[#FF4655] hover:bg-[#e03847] text-white font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.4)]"
            >
              Leave Match
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
