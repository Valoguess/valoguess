"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Users,
  Gamepad2,
  Info,
  Loader2,
} from "lucide-react";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { InviteModal } from "@/components/InviteModal";
import { UsernameModal } from "@/components/UsernameModal";
import { Input } from "@/components/ui/input";
import { createRoom, joinRoom } from "@/socket/emitter";
import { useRoomStore } from "@/store/roomStore";
import { socket } from "@/socket";
import { ServerEvents } from "@/socket/events";

export default function LandingPage() {
  const router = useRouter();
  
  // Modals and form state
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinStep, setJoinStep] = useState("");
  
  // Username screen state
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"join" | "create" | "">("");

  // Generated mock room code
  const [inviteCode, setInviteCode] = useState("");

  // Live stats states
  const [onlinePlayers, setOnlinePlayers] = useState(124);
  const [activeRooms, setActiveRooms] = useState(38);

  // Initialize random room code when invite modal opens
  // const generateRoomCode = async () => {
    // const code = "VAL-" + Math.floor(1000 + Math.random() * 9000);
    // setInviteCode(code);
    // setShowInviteModal(true);
  // };

  // Live stats fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next > 100 ? next : 100;
      });
      if (Math.random() > 0.7) {
        setActiveRooms((prev) => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const next = prev + change;
          return next > 20 ? next : 20;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const { room } = useRoomStore();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (room && isJoining) {
      setIsJoining(false);
      router.push(`/room?code=${room.id}`);
    }
  }, [room, isJoining, router]);

  useEffect(() => {
    const onError = (err: any) => {
      setIsJoining(false);
      setErrorMsg(err?.message || "Failed to join/create room.");
    };
    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, []);

  // Trigger Username check before joining
  const handleJoinRoomClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setErrorMsg("");
    setPendingAction("join");
    setShowUsernameModal(true);
  };

  // Trigger Username check before creating
  const handleCreateRoomClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setErrorMsg("");
    setPendingAction("create");
    setShowUsernameModal(true);
  };

  // Execute after username is confirmed
  const handleConfirmUsername = (confirmedUsername: string) => {
    const playerId = sessionStorage.getItem("playerId") || crypto.randomUUID();
    sessionStorage.setItem("playerId", playerId);
    setShowUsernameModal(false);
    setErrorMsg("");

    if (pendingAction === "join") {
      setIsJoining(true);
      setJoinStep("CONNECTING TO ROOM...");
      joinRoom(roomCode, { id: playerId, username: confirmedUsername });
    } else if (pendingAction === "create") {
      setIsJoining(true);
      setJoinStep("GENERATING PRIVATE ROOM...");
      createRoom({ id: playerId, username: confirmedUsername });
    }
  };

  return (
    <main className="relative h-screen max-h-screen w-screen flex flex-col items-center justify-between bg-base-950 text-white select-none py-5 px-4 md:px-8 overflow-hidden">
      
      {/* BACKGROUND GRAPHIC (Valorant Artwork generated) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.png"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-35 z-10 object-center scale-[1.01]"
        />
        {/* Sleek tactical shooter overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/70 to-base-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#0A0D13_80%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03] mix-blend-overlay" />
        
        {/* Futuristic horizontal scanner lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent shadow-[0_0_10px_#ff4655]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* TOP HEADER */}
      <div className="w-full max-w-7xl relative z-10 flex items-center justify-between px-2 shrink-0">
        {/* LOGO */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
        >
          {/* Stylized Red and White V Shield */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image 
              src={"/logo.svg"}
              alt="Guess The Agent Logo"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          <div className="flex flex-col font-valorant leading-[0.8] text-left">
            <span className="text-[12px] tracking-wide text-white">GUESS</span>
            <span className="text-[10px] tracking-wide text-white/50">THE</span>
            <span className="text-[16px] tracking-wide text-accent">AGENT</span>
          </div>
        </Link>

        {/* HOW TO PLAY BUTTON */}
        <button 
          onClick={() => setShowHowToPlay(true)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 transition-all duration-300 px-5 py-2 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-white/80"
        >
          <Info className="h-4.5 w-4.5 text-white/60" />
          <span>How to Play</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center relative z-10 py-2 my-auto max-h-[82%]">
        
        {/* Decorative top dot */}
        <div className="mb-2 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent blur-sm opacity-50" />
            <div className="relative h-1.5 w-1.5 rotate-45 border border-accent bg-[#0A0D13]" />
          </div>
        </div>

        {/* MAIN GAME TITLE */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="font-valorant text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal uppercase tracking-[0.06em] leading-none mb-2">
            GUESS THE <span className="text-accent drop-shadow-[0_0_15px_rgba(255,70,85,0.35)]">AGENT</span>
          </h1>
          <p className="font-display text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.45em] text-white/50">
            ASK. ELIMINATE. GUESS. <span className="text-accent font-black tracking-[0.45em]">WIN.</span>
          </p>
        </motion.div>

        {/* Decorative card separation diamond */}
        <div className="h-4 my-3 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rotate-45 border border-white/20 bg-transparent" />
        </div>

        {/* PLAY MODES CARDS GRID WRAPPER */}
        <div className="relative w-full max-w-[800px] px-4">
          {/* Central decorative outline diamond */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
            <div className="h-2.5 w-2.5 rotate-45 border border-accent bg-[#0A0D13] shadow-[0_0_8px_rgba(255,70,85,0.4)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            
            {/* CARD 1: 1V1 DUEL (RED THEME) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative group"
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 rounded-lg" />
              
              {/* Notched outer border */}
              <div className="clip-notch-both p-[1px] bg-gradient-to-br from-accent/50 via-accent/10 to-transparent transition-all duration-300 group-hover:from-accent group-hover:via-accent/40 group-hover:to-accent/10">
                
                {/* Card Inner Body */}
                <div className="clip-notch-both bg-base-950/80 backdrop-blur-md p-6 md:p-8 flex flex-col items-center justify-center text-center h-[260px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,70,85,0.03),transparent_60%)]" />
                  
                  {/* Mode Icon */}
                  <Swords className="h-10 w-10 text-accent mb-4 drop-shadow-[0_0_10px_rgba(255,70,85,0.5)] transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Title */}
                  <h2 className="font-valorant text-xl md:text-2xl tracking-wider text-white mb-1.5">
                    1v1 Duel
                  </h2>
                  
                  {/* Play Button Link */}
                  <Link
                    href="/play"
                    className="flex items-center justify-center gap-3 text-accent font-display text-[10px] font-bold uppercase tracking-[0.25em] mb-4 hover:text-white transition-colors duration-300"
                  >
                    <span className="h-[1.5px] w-3 bg-gradient-to-r from-transparent to-accent group-hover:w-5 transition-all duration-300" />
                    <span>Play Now</span>
                    <span className="h-[1.5px] w-3 bg-gradient-to-l from-transparent to-accent group-hover:w-5 transition-all duration-300" />
                  </Link>

                  {/* Description */}
                  <p className="text-ink-500 text-xs max-w-[210px] leading-relaxed">
                    Match with a random player and start guessing!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: INVITE FRIEND (BLUE/VIOLET THEME) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative group cursor-pointer"
              onClick={handleCreateRoomClick}
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 rounded-lg" />
              
              {/* Notched outer border */}
              <div className="clip-notch-both p-[1px] bg-gradient-to-br from-violet/50 via-violet/10 to-transparent transition-all duration-300 group-hover:from-violet group-hover:via-violet/40 group-hover:to-violet/10">
                
                {/* Card Inner Body */}
                <div className="clip-notch-both bg-base-950/80 backdrop-blur-md p-6 md:p-8 flex flex-col items-center justify-center text-center h-[260px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,123,255,0.03),transparent_60%)]" />
                  
                  {/* Mode Icon */}
                  <Users className="h-10 w-10 text-violet mb-4 drop-shadow-[0_0_10px_rgba(140,123,255,0.5)] transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Title */}
                  <h2 className="font-valorant text-xl md:text-2xl tracking-wider text-white mb-1.5">
                    Invite Friend
                  </h2>
                  
                  {/* Action Link Triggering Modal */}
                  <button
                    onClick={handleCreateRoomClick}
                    className="flex items-center justify-center gap-3 text-violet font-display text-[10px] font-bold uppercase tracking-[0.25em] mb-4 hover:text-white transition-colors duration-300"
                  >
                    <span className="h-[1.5px] w-3 bg-gradient-to-r from-transparent to-violet group-hover:w-5 transition-all duration-300" />
                    <span>Create Room</span>
                    <span className="h-[1.5px] w-3 bg-gradient-to-l from-transparent to-violet group-hover:w-5 transition-all duration-300" />
                  </button>

                  {/* Description */}
                  <p className="text-ink-500 text-xs max-w-[210px] leading-relaxed">
                    Create a private room and play with your friends.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* JOIN WITH CODE HEADER SECTION */}
        <div className="relative flex items-center justify-center w-full max-w-[420px] mt-6 mb-3 px-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase bg-base-950 px-4 font-display font-semibold tracking-[0.35em] text-white/40">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rotate-45 bg-accent/40" />
              <span>Join With Code</span>
              <span className="h-1 w-1 rotate-45 bg-accent/40" />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="w-full max-w-[420px] mb-2 px-4">
            <div className="bg-[#FF4655]/10 border border-[#FF4655]/30 text-[#FF4655] text-xs font-display font-semibold uppercase tracking-wider p-2.5 rounded text-center">
              {errorMsg}
            </div>
          </div>
        )}

        {/* JOIN ROOM INPUT FORM */}
        <form 
          onSubmit={handleJoinRoomClick}
          className="flex flex-col sm:flex-row items-center w-full max-w-[420px] gap-2.5 px-4"
        >
          {/* Input container */}
          <div className="flex items-center flex-1 w-full bg-black/35 border border-white/5 rounded-sm focus-within:border-accent/40 transition-colors duration-300 relative overflow-hidden">
            {/* Hash box label */}
            <div className="flex shrink-0 items-center justify-center w-8 h-11 bg-white/[0.03] border-r border-white/5 text-white/35 font-display text-[14px] font-bold">
              #
            </div>
            
            {/* Text Input */}
            <Input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE"
              className="h-11 bg-transparent border-none rounded-none px-4 font-display text-white placeholder-white/20 tracking-[0.18em] uppercase outline-none text-xs sm:text-sm focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 ring-0 ring-offset-0"
              disabled={isJoining}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!roomCode.trim() || isJoining}
            className="w-full sm:w-auto h-11 px-6 bg-accent/5 hover:bg-accent/15 border border-accent/40 hover:border-accent text-white font-valorant text-[11px] tracking-[0.15em] uppercase rounded-sm hover:shadow-[0_0_12px_rgba(255,70,85,0.2)] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none shrink-0"
          >
            {isJoining ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                Connecting
              </span>
            ) : (
              "Join Room"
            )}
          </button>
        </form>

        {/* ROOM CONNECTOR LOADING OVERLAY */}
        <AnimatePresence>
          {isJoining && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-950/90 backdrop-blur-lg"
            >
              <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
                {/* Spinner */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-accent/20 blur-md rounded-full" />
                  <Loader2 className="h-10 w-10 animate-spin text-accent relative" />
                </div>
                
                {/* Title */}
                <h3 className="font-valorant text-lg tracking-widest text-white mb-2">
                  JOINING DUEL
                </h3>
                
                {/* Step indicator */}
                <p className="font-mono text-[10px] tracking-wider text-accent/80 font-bold select-none h-4 animate-pulse">
                  {joinStep}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM STATS DISPLAY BAR */}
        <div className="w-full max-w-[420px] mt-6 px-4">
          <div className="bg-black/30 border border-white/5 rounded-sm p-3.5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <div className="grid grid-cols-2 divide-x divide-white/5">
              {/* Online Players Stat */}
              <div className="flex items-center justify-center gap-3 px-2">
                <div className="h-2 w-2 rounded-full bg-mint shadow-[0_0_8px_#3cf2c4] shrink-0" />
                <Users className="h-4.5 w-4.5 text-white/35 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="font-valorant text-xl text-white leading-none tabular-nums">
                    {onlinePlayers}
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.15em] text-white/40 font-semibold">
                    Online Players
                  </span>
                </div>
              </div>

              {/* Active Rooms Stat */}
              <div className="flex items-center justify-center gap-3 px-2">
                <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_#ff4655] shrink-0 animate-pulse" />
                <Gamepad2 className="h-4.5 w-4.5 text-white/35 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="font-valorant text-xl text-white leading-none tabular-nums">
                    {activeRooms}
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.15em] text-white/40 font-semibold">
                    Active Rooms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER INFO */}
      <div className="relative z-10 w-full text-center text-[9px] font-display font-medium tracking-[0.2em] text-white/20 select-none shrink-0">
        © 2026 GUESS THE AGENT. ALL RIGHTS RESERVED.
      </div>

      {/* ============================================== */}
      {/* MODALS */}
      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
{/* 
      <InviteModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        inviteCode={inviteCode} 
      /> */}

      <UsernameModal 
        isOpen={showUsernameModal} 
        onClose={() => setShowUsernameModal(false)} 
        onConfirm={handleConfirmUsername} 
        pendingAction={pendingAction} 
      />

    </main>
  );
}
