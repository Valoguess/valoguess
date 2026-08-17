"use client";

import { useState } from "react";
import {
  Filter,
  Loader2,
  Check,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionItem, QuestionCategory, ALL_QUESTIONS } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<QuestionCategory | "all", string> = {
  all: "All Categories",
  offense: "Offense",
  defense: "Defense",
  information: "Information",
  mobility: "Mobility",
  control: "Control",
  support: "Support",
  utility: "Utility",
  unique: "Unique",
};

export function QuestionPanel({
  onAsk,
  askedQuestions = {},
  disabled = false,
  disabledReason,
  questions = ALL_QUESTIONS,
}: {
  onAsk: (question: QuestionItem) => void;
  askedQuestions?: Record<string, "yes" | "no">;
  disabled?: boolean;
  disabledReason?: string;
  questions?: QuestionItem[];
}) {
  const [category, setCategory] = useState<QuestionCategory | "all">("all");

  const visible =
    category === "all"
      ? questions
      : questions.filter((q) => q.category === category);

  return (
    <div className="clip-notch-both flex flex-col border border-white/10 bg-[#07090e]/85 backdrop-blur-md p-5 shadow-panel min-h-[340px] relative overflow-hidden">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 shrink-0 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rotate-45 bg-[#FF4655]" />
            <span className="font-valorant text-xs tracking-widest text-[#FF4655] drop-shadow-[0_0_8px_rgba(255,70,85,0.3)]">
              ASK A QUESTION
            </span>
          </div>

          <span className="text-[10px] text-white/40 font-mono">
            ({visible.length} available)
          </span>

          {disabled && (
            <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-sm border border-white/5">
              <Loader2 className="h-3 w-3 animate-spin text-accent" />
              <span>{disabledReason || "Thinking..."}</span>
            </div>
          )}
        </div>

        {/* Category Select Dropdown */}
        <div className="flex items-center gap-2">
          <Select
            value={category}
            onValueChange={(val) => {
              if (val) setCategory(val as QuestionCategory | "all");
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-40 bg-black/60 border-white/10 text-white hover:border-white/20 text-xs h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#090d14] border-white/15 text-white">
              {(
                [
                  "all",
                  "offense",
                  "defense",
                  "information",
                  "mobility",
                  "control",
                  "support",
                  "utility",
                  "unique",
                ] as const
              ).map((c) => (
                <SelectItem key={c} value={c} className="hover:bg-white/10 focus:bg-white/10 text-xs">
                  {CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin max-h-[360px]">
        {visible.length === 0 ? (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-white/40 text-xs">
            <Filter className="h-6 w-6 mb-2 text-white/20" />
            <span>No questions found in this category.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {visible.map((q) => {
              const answer = askedQuestions[q.id];
              const isYes = answer === "yes";
              const isNo = answer === "no";
              const isAsked = isYes || isNo;

              return (
                <button
                  key={q.id}
                  onClick={() => !disabled && !isAsked && onAsk(q)}
                  disabled={disabled || isAsked}
                  title={q.description || q.label}
                  className={cn(
                    "flex flex-col justify-between rounded-sm border p-3 text-left transition-all relative group overflow-hidden min-h-[78px]",
                    disabled || isAsked ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.02]",
                    isYes && "border-mint bg-mint/10 text-mint shadow-[0_0_12px_rgba(60,242,196,0.15)] opacity-85",
                    isNo && "border-accent bg-accent/10 text-accent shadow-[0_0_12px_rgba(255,70,85,0.15)] opacity-85",
                    !isAsked && "border-white/10 bg-[#090d14]/90 text-white/90 hover:border-accent/60 hover:bg-[#101622]"
                  )}
                >
                  {/* Top Bar: Category tag */}
                  <div className="flex items-center justify-between w-full mb-1 text-[8.5px] uppercase tracking-wider font-display">
                    <span className="text-white/40 font-mono">
                      {q.category}
                    </span>
                  </div>

                  {/* Question Label */}
                  <div className="flex items-center gap-1.5 my-auto">
                    <span className="text-xs font-bold leading-tight line-clamp-2">
                      {q.label}
                    </span>
                  </div>

                  {/* Answered State Indicator */}
                  {isAsked && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider">
                      {isYes ? (
                        <>
                          <Check className="h-3 w-3 text-mint" />
                          <span>ANSWER: YES</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-accent" />
                          <span>ANSWER: NO</span>
                        </>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
