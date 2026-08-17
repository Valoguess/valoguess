"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Shield, Check, RefreshCw, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CallsignPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) {
      setUsernameInput(saved);
    }
  }, []);

  const handleGenerateRandom = () => {
    const randomNames = ["Viper", "Phoenix", "Sage", "Jett", "Cypher", "Reyna", "Omen", "Breach", "Sova", "Raze", "Killjoy", "Skye", "Yoru", "Astra", "KAYO", "Chamber", "Neon", "Fade", "Harbor", "Gekko", "Deadlock", "Iso", "Clove"];
    const num = Math.floor(1000 + Math.random() * 9000);
    const generated = `${randomNames[Math.floor(Math.random() * randomNames.length)].toUpperCase()}#${num}`;
    setUsernameInput(generated);
  };

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!usernameInput.trim()) return;

    const trimmed = usernameInput.trim().toUpperCase();
    localStorage.setItem("username", trimmed);
    sessionStorage.setItem("username", trimmed);
    
    let playerId = localStorage.getItem("playerId") || sessionStorage.getItem("playerId");
    if (!playerId) {
      playerId = crypto.randomUUID();
      localStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerId", playerId);
    }

    setIsSaved(true);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <main className="relative h-screen max-h-screen w-screen flex flex-col items-center justify-between bg-[#040609] text-white select-none py-6 px-4 md:px-8 overflow-hidden font-body">
      {/* Background artwork */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.png"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-35 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#040609]/70 to-[#040609]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#040609_85%)]" />
      </div>

      {/* Header Bar */}
      <header className="w-full max-w-6xl relative z-10 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image src="/logo.svg" alt="Valoguess Logo" fill className="object-contain transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col font-valorant leading-none text-left">
            <span className="text-sm tracking-wider text-white">VALOGUESS</span>
            <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-accent mt-1">CALLSIGN SETUP</span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 transition px-4 py-2 text-[10px] font-display font-bold uppercase tracking-widest text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>RETURN TO LOBBY</span>
        </Link>
      </header>

      {/* Main Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md my-auto"
      >
        <div className="clip-notch-both p-[1px] bg-gradient-to-b from-accent/50 via-accent/20 to-transparent shadow-[0_0_30px_rgba(255,70,85,0.15)]">
          <div className="clip-notch-both bg-[#090d14]/90 backdrop-blur-xl p-8 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />

            {/* Emblem Icon */}
            <div className="relative h-16 w-16 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-accent/20 blur-md rounded-full" />
              <div className="relative h-full w-full rounded-full border-2 border-accent/60 bg-black/60 flex items-center justify-center">
                <Shield className="h-7 w-7 text-accent" />
              </div>
            </div>

            {/* Header Text */}
            <h1 className="font-valorant text-2xl tracking-wider text-white mb-1">
              SECURE CALLSIGN
            </h1>
            <p className="text-xs text-white/50 tracking-wide font-medium max-w-xs mx-auto mb-6">
              IDENTIFICATION REQUIRED. Enter your tactical codename to represent you in matches.
            </p>

            {/* Form Input */}
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="flex items-center w-full bg-black/50 border border-white/10 rounded-sm focus-within:border-accent transition-colors overflow-hidden">
                <div className="flex shrink-0 items-center justify-center w-12 h-11 bg-white/[0.04] border-r border-white/10 text-white/40 font-display text-[10px] font-bold tracking-widest">
                  AGENT
                </div>

                <Input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CALLSIGN (E.G. JETT#3912)"
                  className="w-full h-11 bg-transparent border-none rounded-none px-4 font-display text-white placeholder-white/20 tracking-wider uppercase text-sm focus-visible:ring-0 outline-none"
                  maxLength={18}
                  autoFocus
                />
              </div>

              {/* Random Generator Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateRandom}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent/80 hover:text-accent font-display font-bold transition"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Generate Random Callsign</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!usernameInput.trim() || isSaved}
                className="w-full h-12 mt-2 bg-accent hover:bg-accent-dim text-white font-valorant text-sm tracking-[0.2em] uppercase rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.4)] transition disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>CALLSIGN SAVED</span>
                  </>
                ) : (
                  <span>CONFIRM & SAVE CALLSIGN</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 w-full text-center text-[9px] font-display font-medium tracking-[0.2em] text-white/20 select-none shrink-0">
        © 2026 VALOGUESS. ALL RIGHTS RESERVED.
      </div>
    </main>
  );
}
