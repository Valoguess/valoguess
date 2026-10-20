"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "../_hooks/useResultData";

interface ResultTimelineSidebarProps {
  timeline: TimelineEvent[];
  userName: string;
  oppName: string;
}

export function ResultTimelineSidebar({
  timeline,
  userName,
  oppName,
}: ResultTimelineSidebarProps) {
  return (
    <div className="clip-notch-both border border-white/5 bg-base-900 p-4 flex flex-col h-full overflow-hidden">
      <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-accent mb-3 shrink-0">
        MATCH TIMELINE
      </h4>

      <div className="flex-1 overflow-y-auto pr-1 relative pl-1.5 min-h-0">
        <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/10" />

        <div className="space-y-3 relative">
          {timeline.map((event) => {
            return (
              <div key={event.id} className="flex items-start gap-2.5 text-xs group">
                {/* Event Type Icon Indicator */}
                <div
                  className={cn(
                    "h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[9px] mt-0.5 border z-10 transition",
                    event.kind === "asked" && "bg-base-950 border-ink-500 text-ink-300",
                    event.kind === "answered-yes" && "bg-mint/20 border-mint text-mint",
                    event.kind === "answered-no" && "bg-accent/20 border-accent text-accent",
                    event.kind === "guessed" && "bg-amber-500/20 border-amber-500 text-amber-400",
                    event.kind === "system-win" && "bg-mint/30 border-mint text-mint",
                    event.kind === "system-lose" && "bg-accent/30 border-accent text-accent"
                  )}
                >
                  {event.kind === "asked" && "?"}
                  {event.kind === "answered-yes" && <Check className="h-3 w-3" />}
                  {event.kind === "answered-no" && <X className="h-3 w-3" />}
                  {event.kind === "guessed" && "🎯"}
                  {(event.kind === "system-win" || event.kind === "system-lose") && "🏆"}
                </div>

                {/* Content detail */}
                <div className="flex-1 min-w-0 bg-[#0d1119]/50 hover:bg-[#0d1119] border border-white/[0.02] p-2 rounded-sm transition">
                  <div className="flex items-center justify-between text-[8px] text-zinc-500 font-semibold mb-0.5">
                    <span className="uppercase tracking-wider">
                      {event.actor === "you"
                        ? userName
                        : event.actor === "opponent"
                          ? oppName
                          : "SYSTEM"}
                      {event.kind === "asked" && " ASKED"}
                      {event.kind === "answered-yes" && " ANSWERED"}
                      {event.kind === "answered-no" && " ANSWERED"}
                      {event.kind === "guessed" && " GUESSED"}
                    </span>
                    <span className="tabular-nums">{event.time}</span>
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium leading-normal",
                      event.kind === "answered-yes" && "text-mint",
                      event.kind === "answered-no" && "text-accent",
                      event.kind === "system-win" && "text-mint font-bold",
                      event.kind === "system-lose" && "text-accent font-bold",
                      event.kind !== "answered-yes" &&
                        event.kind !== "answered-no" &&
                        event.kind !== "system-win" &&
                        event.kind !== "system-lose" &&
                        "text-ink-100"
                    )}
                  >
                    {event.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
