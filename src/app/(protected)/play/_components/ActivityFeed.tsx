"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, HelpCircle, ArrowRight, Wifi, Send } from "lucide-react";
import { ActivityEntry } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function EntryIcon({ kind }: { kind: ActivityEntry["kind"] }) {
  if (kind === "answered-yes")
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-mint/10 border border-mint/30">
        <Check className="h-3.5 w-3.5 text-mint" strokeWidth={3} />
      </span>
    );
  if (kind === "answered-no")
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent/10 border border-accent/30">
        <X className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
      </span>
    );
  if (kind === "prompt")
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-accent/10 border border-accent/30">
        <ArrowRight className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-violet/10 border border-violet/30">
      <HelpCircle className="h-3.5 w-3.5 text-violet" strokeWidth={2.5} />
    </span>
  );
}

function actorLabel(entry: ActivityEntry, userName: string, opponentName: string) {
  const who =
    entry.actor === "you"
      ? userName
      : entry.actor === "opponent"
        ? opponentName
        : "System";
  switch (entry.kind) {
    case "asked":
      return `${who} asked`;
    case "answered-yes":
      return `${who} answered`;
    case "answered-no":
      return `${who} answered`;
    case "prompt":
      return who;
  }
}

export function ActivityFeed({
  entries,
  onSendCustomQuestion,
  yourTurn = true,
  userName = "You",
  opponentName = "Opponent",
}: {
  entries: ActivityEntry[];
  onSendCustomQuestion?: (text: string) => void;
  yourTurn?: boolean;
  userName?: string;
  opponentName?: string;
}) {
  const [message, setMessage] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries.length]);

  const handleSend = () => {
    if (!message.trim() || !yourTurn) return;
    onSendCustomQuestion?.(message);
    setMessage("");
  };

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-sm border border-white/10 bg-[#07090e] shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-valorant text-xs uppercase tracking-widest text-[#FF4655]">
          MATCH LOG
        </span>
        <span className="font-mono text-[10px] text-white/40 uppercase">
          LIVE LOG
        </span>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin">
        {entries.map((e) => (
          <div
            key={e.id}
            className={cn(
              "flex items-start gap-2.5 rounded-sm p-2.5 transition-colors",
              e.kind === "prompt"
                ? "border border-accent/40 bg-accent/5"
                : "border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
            )}
          >
            <EntryIcon kind={e.kind} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-white/50 truncate">
                  {actorLabel(e, userName, opponentName)}
                </span>
                <span className="text-[10px] font-mono tabular-nums text-white/40 shrink-0">
                  {e.time}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium leading-relaxed block mt-0.5",
                  e.kind === "answered-yes" && "text-mint",
                  e.kind === "answered-no" && "text-accent",
                  e.kind !== "answered-yes" && e.kind !== "answered-no" && "text-white/90"
                )}
              >
                {e.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2 rounded-sm border border-white/10 bg-black/40 px-3 py-1.5 focus-within:border-white/30 transition-colors">
          <Input
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!yourTurn}
            placeholder={yourTurn ? "Ask a question..." : `Waiting for ${opponentName}...`}
            className="flex-1 bg-transparent border-none rounded-none text-xs text-white placeholder-white/30 outline-none p-0 h-7 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
          />
          <button
            onClick={handleSend}
            disabled={!yourTurn || !message.trim()}
            className={cn(
              "p-1 rounded transition cursor-pointer",
              yourTurn && message.trim()
                ? "text-accent hover:text-white"
                : "text-white/20 cursor-not-allowed"
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
          <Wifi className="h-3 w-3 text-mint" />
          <span>CONNECTED</span>
          <span className="ml-auto tabular-nums">24ms</span>
        </div>
      </div>
    </div>
  );
}
