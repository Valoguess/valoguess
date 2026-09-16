"use client";

import { motion } from "framer-motion";
import { Flame, AlertCircle } from "lucide-react";

interface AuthCardProps {
  badgeText: string;
  title: string;
  description: string;
  errorMessage?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({
  badgeText,
  title,
  description,
  errorMessage,
  children,
  footer,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-10 w-full max-w-md my-auto py-4"
    >
      <div className="rounded-2xl border border-white/10 bg-[#090d16]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Top Neon Highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-[#FF4655] to-transparent opacity-90" />

        {/* Header text */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#FF4655]/15 border border-[#FF4655]/30 text-[#FF4655] mb-3">
            <Flame className="h-3 w-3" /> {badgeText}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-sans">
            {title}
          </h1>
          <p className="text-sm text-zinc-400 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mb-5 flex items-center gap-2.5 bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] text-xs font-medium p-3 rounded-xl text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Children buttons / form */}
        <div className="space-y-3.5">{children}</div>

        {/* Optional footer content */}
        {footer && <div className="mt-6 pt-5 border-t border-white/10">{footer}</div>}
      </div>
    </motion.div>
  );
}
