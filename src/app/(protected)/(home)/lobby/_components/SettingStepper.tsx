"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SettingStepperProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: number;
  options: number[];
  presets: number[];
  disabled?: boolean;
  formatValue?: (val: number) => string;
  formatPreset?: (val: number) => string;
  unitLabel?: string;
  accent?: "red" | "violet" | "mint";
  onChange: (val: number) => void;
}

export function SettingStepper({
  icon,
  label,
  description,
  value,
  options,
  presets,
  disabled = false,
  formatValue = (v) => (v === -1 ? "∞" : `${v}`),
  formatPreset = (v) => (v === -1 ? "∞" : `${v}`),
  unitLabel,
  accent = "red",
  onChange,
}: SettingStepperProps) {
  const currentIndex = options.indexOf(value);
  const canDecrement = !disabled && currentIndex > 0;
  const canIncrement = !disabled && (currentIndex === -1 || currentIndex < options.length - 1);

  const handleDecrement = () => {
    if (!canDecrement) return;
    if (currentIndex > 0) {
      onChange(options[currentIndex - 1]);
    } else if (currentIndex === -1) {
      onChange(options[options.length - 2] ?? options[0]);
    }
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    if (currentIndex >= 0 && currentIndex < options.length - 1) {
      onChange(options[currentIndex + 1]);
    } else if (currentIndex === -1) {
      onChange(options[options.length - 1]);
    }
  };

  const accentBadgeStyles = {
    red: "text-[#FF4655] border-[#FF4655]/40 bg-[#FF4655]/10",
    violet: "text-violet border-violet/40 bg-violet/10",
    mint: "text-mint border-mint/40 bg-mint/10",
  }[accent];

  const presetActiveStyles = {
    red: "bg-[#FF4655] text-white border-[#FF4655]",
    violet: "bg-violet text-white border-violet",
    mint: "bg-mint text-black border-mint font-bold",
  }[accent];

  return (
    <div className="flex flex-col bg-[#0b0e14]/70 border border-white/10 rounded-sm p-3.5 gap-2.5">
      <div className="flex items-start gap-2.5">
        <div className={cn("p-1.5 rounded-sm border shrink-0 mt-0.5", accentBadgeStyles)}>
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-valorant text-xs tracking-wider text-white">
            {label}
          </span>
          <span className="text-[10px] text-white/50 font-mono">
            {description}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-1 bg-black/40 border border-white/5 rounded-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className="h-8 w-8 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          -
        </button>

        <div className="flex flex-col items-center">
          <span className="font-valorant text-2xl text-white leading-none">
            {formatValue(value)}
          </span>
          {unitLabel && (
            <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase mt-0.5">
              {value === -1 ? "INFINITE" : unitLabel}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className="h-8 w-8 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition disabled:opacity-20 flex items-center justify-center font-bold text-base cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {presets.map((preset) => {
          const isActive = value === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => !disabled && onChange(preset)}
              disabled={disabled}
              className={cn(
                "py-1 rounded-sm text-[10px] font-mono tracking-wider transition border cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? presetActiveStyles
                  : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {formatPreset(preset)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
