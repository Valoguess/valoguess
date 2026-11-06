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
    <div className="flex flex-col border border-[#FF4655]/30 bg-[#080b10]/95 backdrop-blur-md p-4 sm:p-6 rounded-sm relative min-h-[220px] sm:min-h-[260px] justify-between mb-4">
      <div className="flex justify-center items-center gap-2 mb-3">
        <span className="text-[#FF4655] font-mono text-xs font-bold uppercase tracking-widest">
          OPPONENT ASKED
        </span>
      </div>

      <div className="text-center my-auto flex flex-col gap-1.5 px-2">
        <h2 className="text-white font-valorant text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider leading-tight">
          {question.label.toUpperCase()}?
        </h2>
        <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
          {question.description ||
            `Does your secret agent match the characteristic: "${question.label}"?`}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 mt-4">
        <button
          onClick={() => onAnswer("yes")}
          disabled={isAnswering}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xs border-2 border-mint bg-mint/10 py-3 px-4 text-mint transition-all font-display text-sm sm:text-base font-bold uppercase tracking-wider cursor-pointer active:scale-98",
            isAnswering && "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnswering ? (
            <Loader2 className="h-4 w-4 animate-spin text-mint" />
          ) : (
            <Check className="h-4 w-4 stroke-[3]" />
          )}
          <span>YES</span>
        </button>

        <span className="text-white/30 font-mono text-[10px] tracking-widest uppercase select-none px-1">
          OR
        </span>

        <button
          onClick={() => onAnswer("no")}
          disabled={isAnswering}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xs border-2 border-[#FF4655] bg-[#FF4655]/10 py-3 px-4 text-[#FF4655] transition-all font-display text-sm sm:text-base font-bold uppercase tracking-wider cursor-pointer active:scale-98",
            isAnswering && "opacity-50 cursor-not-allowed"
          )}
        >
          {isAnswering ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#FF4655]" />
          ) : (
            <X className="h-4 w-4 stroke-[3]" />
          )}
          <span>NO</span>
        </button>
      </div>
    </div>
  );
}
