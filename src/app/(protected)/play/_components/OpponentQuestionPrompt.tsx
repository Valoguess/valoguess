"use client";

import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionItem } from "@/lib/data";

interface OpponentQuestionPromptProps {
  question: QuestionItem;
  isAnswering: boolean;
  onAnswer: (answer: "yes" | "no") => void;
}

export function OpponentQuestionPrompt({
  question,
  isAnswering,
  onAnswer,
}: OpponentQuestionPromptProps) {
  return (
    <div className="clip-notch-both flex flex-col border border-accent/20 bg-base-850 p-6 shadow-[0_0_24px_rgba(255,70,85,0.1)] relative min-h-[300px] justify-between mb-5">
      {/* Corner accent decorations */}
      <div className="absolute left-0 top-0 h-4 w-4">
        <div className="absolute left-0 top-0 h-px w-4 bg-accent/60" />
        <div className="absolute left-0 top-0 h-4 w-px bg-accent/60" />
      </div>
      <div className="absolute right-0 top-0 h-4 w-4">
        <div className="absolute right-0 top-0 h-px w-4 bg-accent/60" />
        <div className="absolute right-0 top-0 h-4 w-px bg-accent/60" />
      </div>

      {/* Header Badge */}
      <div className="flex justify-center items-center gap-2 mb-6">
        <span className="text-accent font-display text-xs tracking-[0.25em] font-semibold">{`{`}</span>
        <span className="text-accent font-display text-sm tracking-[0.25em] font-bold uppercase">
          OPPONENT ASKED
        </span>
        <span className="text-accent font-display text-xs tracking-[0.25em] font-semibold">{`}`}</span>
      </div>

      {/* Question text */}
      <div className="text-center my-auto flex flex-col gap-2">
        <h2 className="text-white font-display text-4xl md:text-5xl font-black uppercase tracking-[0.05em]">
          {question.label.toUpperCase()}?
        </h2>
        <p className="text-ink-400 text-sm max-w-md mx-auto leading-relaxed">
          {question.description ||
            `Does your secret agent match the characteristic: "${question.label}"?`}
        </p>
      </div>

      {/* Action Options */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mt-8">
        <button
          onClick={() => onAnswer("yes")}
          disabled={isAnswering}
          className={cn(
            "flex items-center justify-center gap-3 rounded-sm border-2 border-mint bg-mint/5 py-4 px-6 text-mint transition-all duration-200 hover:bg-mint/15 font-display text-xl font-bold uppercase tracking-widest cursor-pointer",
            isAnswering && "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnswering ? (
            <Loader2 className="h-5 w-5 animate-spin text-mint" />
          ) : (
            <Check className="h-5 w-5 stroke-[3.5]" />
          )}
          YES
        </button>

        <span className="text-ink-600 font-display text-xs tracking-widest uppercase select-none px-2">
          — OR —
        </span>

        <button
          onClick={() => onAnswer("no")}
          disabled={isAnswering}
          className={cn(
            "flex items-center justify-center gap-3 rounded-sm border-2 border-accent bg-accent/5 py-4 px-6 text-accent transition-all duration-200 hover:bg-accent/15 font-display text-xl font-bold uppercase tracking-widest cursor-pointer",
            isAnswering && "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnswering ? (
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          ) : (
            <X className="h-5 w-5 stroke-[3.5]" />
          )}
          NO
        </button>
      </div>
    </div>
  );
}
