"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AddFriendFormProps {
  friendInput: string;
  setFriendInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAddingFriend?: boolean;
  friendAddedToast?: string;
}

export function AddFriendForm({
  friendInput,
  setFriendInput,
  onSubmit,
  isAddingFriend = false,
  friendAddedToast = "",
}: AddFriendFormProps) {
  const isErrorToast =
    friendAddedToast.toLowerCase().includes("not found") ||
    friendAddedToast.toLowerCase().includes("already") ||
    friendAddedToast.toLowerCase().includes("cannot") ||
    friendAddedToast.toLowerCase().includes("failed") ||
    friendAddedToast.toLowerCase().includes("error");

  return (
    <div className="p-3 border-t border-white/10 bg-black/40 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] uppercase tracking-widest text-white/50 font-display font-bold block text-left">
          ADD FRIEND
        </span>
        <span className="text-[9px] font-mono text-zinc-500">UNIQUE USERNAME</span>
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-1.5">
        <Input
          type="text"
          value={friendInput}
          onChange={(e) => setFriendInput(e.target.value)}
          placeholder="USERNAME (E.G. JETTWIND)"
          className="h-8.5 bg-black/70 border-white/15 text-[10px] font-display uppercase tracking-wider text-white placeholder-white/30 px-2.5 focus:border-accent"
        />
        <button
          type="submit"
          disabled={!friendInput.trim() || isAddingFriend}
          className="h-8.5 px-3 bg-accent hover:bg-accent-dim text-white font-display text-[9px] font-bold uppercase tracking-wider rounded-sm disabled:opacity-30 transition shrink-0 cursor-pointer shadow-[0_0_10px_rgba(255,70,85,0.2)] flex items-center justify-center min-w-[48px]"
        >
          {isAddingFriend ? (
            <span className="inline-block animate-pulse">...</span>
          ) : (
            "ADD"
          )}
        </button>
      </form>

      {friendAddedToast && (
        <span
          className={cn(
            "text-[9px] font-display font-bold mt-1.5 block text-left animate-fade-in truncate",
            isErrorToast ? "text-[#FF4655]" : "text-mint"
          )}
        >
          {friendAddedToast}
        </span>
      )}
    </div>
  );
}
