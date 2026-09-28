"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { signIn } from "@/lib/auth-client";

interface MagicLinkFormProps {
  callbackURL?: string;
  newUserCallbackURL?: string;
  disabled?: boolean;
}

export function MagicLinkForm({
  callbackURL = "/lobby",
  newUserCallbackURL = "/welcome",
  disabled = false,
}: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn.magicLink({
        email: cleanEmail,
        callbackURL,
        newUserCallbackURL,
      });

      if (res?.error) {
        setErrorMessage(res.error.message || "Failed to dispatch magic link.");
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      setCooldown(60);
    } catch (err: any) {
      console.error("Magic link error:", err);
      setErrorMessage(err?.message || "An unexpected error occurred while sending magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setErrorMessage("");
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.form
            key="input-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSendMagicLink}
            className="space-y-3"
          >
            <div className="relative">
              <label
                htmlFor="magic-email"
                className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
              >
                Agent Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  id="magic-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  disabled={isLoading || disabled}
                  placeholder="agent@domain.com"
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-white/10 bg-black/40 hover:border-white/20 focus:border-[#FF4655] focus:ring-1 focus:ring-[#FF4655] text-sm text-white placeholder:text-zinc-600 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-xs text-[#FF4655] font-medium px-1 animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || disabled || !email.trim()}
              className="w-full h-11 rounded-xl bg-[#FF4655] hover:bg-[#ff5866] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_20px_rgba(255,70,85,0.3)] hover:shadow-[0_0_25px_rgba(255,70,85,0.45)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Dispatching Link...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Send Magic Link</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="sent-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl border border-mint/30 bg-mint/5 flex flex-col items-center text-center space-y-3"
          >
            <div className="relative flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-mint/20 border border-mint/40 flex items-center justify-center text-mint">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="absolute -inset-1 rounded-full border border-mint/30 animate-ping opacity-40 pointer-events-none" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Magic Link Dispatched
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                We sent a tactical access link to{" "}
                <span className="text-mint font-semibold underline decoration-mint/40">
                  {email}
                </span>
                . Click it in your inbox to sign in instantly.
              </p>
              <span className="text-[10px] text-zinc-500 block mt-1.5">
                Link expires in 5 minutes • Check spam if not found
              </span>
            </div>

            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() => handleSendMagicLink()}
                disabled={cooldown > 0 || isLoading}
                className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <RotateCcw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>{cooldown > 0 ? `Resend (${cooldown}s)` : "Resend Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 h-9 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white font-medium text-xs transition cursor-pointer"
              >
                Change Email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
