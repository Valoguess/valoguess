"use client";

import { Input } from "@/components/ui/input";

interface AddFriendFormProps {
  friendInput: string;
  setFriendInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAddingFriend?: boolean;
  currentUsername?: string;
}

export function AddFriendForm({
  friendInput,
  setFriendInput,
  onSubmit,
  isAddingFriend = false,
  currentUsername,
}: AddFriendFormProps) {
  const cleanUsername = currentUsername ? currentUsername.replace(/^@/, "") : "";

  return (
    <div className="p-3 border-t border-white/10 bg-black/40 shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] uppercase tracking-widest text-white/50 font-display font-bold block text-left">
          ADD FRIEND
        </span>
        {cleanUsername && (
          <span className="text-[9px] font-mono text-white/40 cursor-text select-text">
            @{cleanUsername}
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-1.5">
        <Input
          type="text"
          value={friendInput}
          onChange={(e) => setFriendInput(e.target.value)}
          placeholder="Username (e.g. NHero)"
          className="h-8 bg-black/70 border-white/15 text-[10px] font-display tracking-wider text-white placeholder-white/30 px-2.5 focus:border-accent rounded-xs"
        />
        <button
          type="submit"
          disabled={!friendInput.trim() || isAddingFriend}
          className="h-8 px-3 bg-accent hover:bg-accent-dim text-white font-display text-[9px] font-bold uppercase tracking-wider rounded-xs disabled:opacity-30 transition shrink-0 cursor-pointer flex items-center justify-center min-w-[48px]"
        >
          {isAddingFriend ? (
            <span className="inline-block animate-pulse">...</span>
          ) : (
            "ADD"
          )}
        </button>
      </form>
    </div>
  );
}
