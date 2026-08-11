"use client";

import { useState } from "react";
import {
  Heart,
  Zap,
  Cloud,
  Wand2,
  EyeOff,
  Flame,
  RectangleHorizontal,
  DoorOpen,
  Move,
  Wind,
  Triangle,
  ScanLine,
  ShieldHalf,
  Compass,
  Layers,
  Swords,
  Droplet,
  Snowflake,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUESTIONS, Question, QuestionCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

// const ICONS: Record<string, React.ElementType> = {
//   "can-heal": Heart,
//   "can-flash": Zap,
//   "has-smoke": Cloud,
//   "can-stun": Wand2,
//   "can-blind": EyeOff,
//   "has-molly": Flame,
//   "has-wall": RectangleHorizontal,
//   "can-teleport": DoorOpen,
//   "can-dash": Move,
//   "can-fly": Wind,
//   "has-trap": Triangle,
//   "can-scan": ScanLine,
//   sentinel: ShieldHalf,
//   initiator: Compass,
//   controller: Layers,
//   duelist: Swords,
//   "uses-fire": Flame,
//   "uses-water": Droplet,
//   "uses-ice": Snowflake,
//   "uses-energy": Zap,
// };

const CATEGORY_LABEL: Record<QuestionCategory | "all", string> = {
  all: "All",
  ability: "Abilities",
  utility: "Utility",
  movement: "Movement",
  vision: "Vision",
  combat: "Combat",
  theme: "Themes",
  custom: "Custom",
};

export function QuestionPanel({
  onAsk,
  askedQuestions = {},
  disabled = false,
  disabledReason,
  questions = QUESTIONS,
}: {
  onAsk: (question: Question) => void;
  askedQuestions?: Record<string, "yes" | "no">;
  disabled?: boolean;
  disabledReason?: string;
  questions?: Question[];
}) {
  const [category, setCategory] = useState<QuestionCategory | "all">("all");

  const visible =
    category === "all"
      ? questions
      : questions.filter((q) => q.category === category);

  return (
    <div className="clip-notch-both flex flex-col border border-white/5 bg-base-850 p-5 shadow-panel min-h-[320px]">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold uppercase tracking-widest text-accent">
            Ask a Question
          </span>
          {disabled && (
            <div className="flex items-center gap-1.5 text-xs text-ink-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
              <span>{disabledReason || "Thinking..."}</span>
            </div>
          )}
        </div>

        <Select 
          value={category} 
          onValueChange={(val) => { if (val) setCategory(val); }}
          disabled={disabled}
        >
          <SelectTrigger className="w-36 bg-base-800 border-white/10 text-ink-100 hover:border-white/20 text-xs">
            <SelectValue placeholder="Categories" />
          </SelectTrigger>
          <SelectContent className="bg-base-800 border-white/10 text-ink-300">
            {(["all", "ability", "utility", "movement", "vision", "combat", "theme", "custom"] as const).map((c) => (
              <SelectItem key={c} value={c} className="hover:bg-base-750 focus:bg-base-750 text-xs">
                {CATEGORY_LABEL[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1">
        {visible.length === 0 ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-ink-500 text-xs">
            No questions in this category.
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2.5">
            {visible.map((q) => {
              const answer = askedQuestions[q.id];
              const isYes = answer === "yes";
              const isNo = answer === "no";

              return (
                <button
                  key={q.id}
                  onClick={() => !disabled && onAsk(q)}
                  disabled={disabled}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-sm border px-2 py-4 text-center transition",
                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                    isYes && "border-mint bg-mint/10 text-mint shadow-[0_0_12px_rgba(60,242,196,0.15)]",
                    isNo && "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(255,70,85,0.15)]",
                    !answer && "border-white/5 bg-base-800 text-ink-300 hover:border-white/15 hover:bg-base-750"
                  )}
                >
                  <span className="text-xs font-medium leading-tight">
                    {q.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
