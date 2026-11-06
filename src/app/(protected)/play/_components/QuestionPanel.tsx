"use client";

import { useState } from "react";
import { Filter, Loader2, Check, X } from "lucide-react";
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
    <div className="flex flex-col border border-white/10 bg-[#080b10]/90 backdrop-blur-md p-3 sm:p-4 rounded-sm min-h-[280px] relative overflow-hidden">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5 shrink-0 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="h-2 w-2 rotate-45 bg-[#FF4655]" />
            <span className="font-valorant text-xs tracking-wider text-[#FF4655]">
              ASK A QUESTION
            </span>
          </div>

          <span className="text-[10px] text-white/40 font-mono">
            ({visible.length} available)
          </span>

          {disabled && (
            <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-xs border border-white/10">
              <Loader2 className="h-3 w-3 animate-spin text-[#FF4655]" />
              <span className="truncate max-w-[140px] sm:max-w-none text-[11px] font-mono">
                {disabledReason || "Waiting..."}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={category}
            onValueChange={(val) => {
              if (val) setCategory(val as QuestionCategory | "all");
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-full sm:w-40 bg-black/60 border-white/10 text-white hover:border-white/20 text-xs h-8 rounded-xs font-display font-medium">
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
                <SelectItem key={c} value={c} className="hover:bg-white/10 focus:bg-white/10 text-xs font-display">
                  {CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin max-h-[340px]">
        {visible.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-white/40 text-xs font-sans">
            <Filter className="h-5 w-5 mb-2 text-white/20" />
            <span>No questions found in this category.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
                    "flex flex-col justify-between rounded-xs border p-2.5 text-left transition-all relative group overflow-hidden min-h-[68px]",
                    disabled || isAsked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#FF4655]/60 hover:bg-white/[0.03]",
                    isYes && "border-mint/50 bg-mint/5 text-mint",
                    isNo && "border-[#FF4655]/50 bg-[#FF4655]/5 text-[#FF4655]",
                    !isAsked && "border-white/10 bg-black/40 text-white/90",
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1 text-[8.5px] uppercase tracking-wider font-mono text-white/40">
                    <span>{q.category}</span>
                  </div>

                  <div className="flex items-center gap-1.5 my-auto">
                    <span className="text-xs font-display font-bold leading-tight line-clamp-2">
                      {q.label}
                    </span>
                  </div>

                  {isAsked && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider">
                      {isYes ? (
                        <>
                          <Check className="h-3 w-3 text-mint" />
                          <span>YES</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-[#FF4655]" />
                          <span>NO</span>
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
