"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, HelpCircle, ArrowRight, Wifi, Send } from "lucide-react";
import { ActivityEntry } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function EntryIcon({ kind }: { kind: ActivityEntry["kind"] }) {
  if (kind === "answered-yes")
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-mint/10">
        <Check className="h-4 w-4 text-mint" strokeWidth={3} />
      </span>
    );
  if (kind === "answered-no")
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent/10">
        <X className="h-4 w-4 text-accent" strokeWidth={3} />
      </span>
    );
  if (kind === "prompt")
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-accent/10">
        <ArrowRight className="h-4 w-4 text-accent" strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-violet/10">
      <HelpCircle className="h-4 w-4 text-violet" strokeWidth={2.5} />
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
    <div className="clip-notch-both flex h-full flex-col border border-white/5 bg-base-850 shadow-panel">
      <div className="border-b border-white/5 p-4">
        <span className="font-display text-sm font-bold uppercase tracking-widest text-accent">
          Game Activity
        </span>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {entries.map((e) => (
          <div
            key={e.id}
            className={cn(
              "flex items-start gap-3 rounded-sm p-2.5",
              e.kind === "prompt"
                ? "border border-accent/30 bg-accent/5"
                : "bg-base-800/60",
            )}
          >
            <EntryIcon kind={e.kind} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-ink-500">{actorLabel(e, userName, opponentName)}</span>
                <span className="text-[11px] tabular-nums text-ink-600">
                  {e.time}
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  e.kind === "answered-yes" && "text-mint",
                  e.kind === "answered-no" && "text-accent",
                  e.kind !== "answered-yes" && e.kind !== "answered-no" && "text-ink-100"
                )}
              >
                {e.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5 p-3">
        <div className="mb-2 flex items-center gap-2 rounded-sm border border-white/10 bg-base-800 px-3 py-2">
          <Input
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!yourTurn}
            placeholder={yourTurn ? "Type a custom question..." : `${opponentName} active. Wait...`}
            className="flex-1 bg-transparent border-none rounded-none text-sm text-ink-100 outline-none placeholder:text-ink-600 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
          />
          <Send
            onClick={handleSend}
            className={cn(
              "h-4 w-4 cursor-pointer transition",
              yourTurn
                ? "text-ink-500 hover:text-accent"
                : "text-ink-600 cursor-not-allowed opacity-30"
            )}
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-ink-500">
          <Wifi className="h-3.5 w-3.5 text-mint" />
          Good Connection
          <span className="ml-auto tabular-nums">24ms</span>
        </div>
      </div>
    </div>
  );
}
