"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCw,
  Eye,
  UserPlus,
  Timer as TimerIcon,
  MessageSquare,
  Target,
  Compass,
  ChevronDown,
  ChevronLeft,
  HelpCircle,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LobbyChat } from "@/components/LobbyChat";
import { LobbySettings } from "@/components/LobbySettings";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { socket } from "@/socket";
import { useRoomStore } from "@/store/roomStore";
import { Player } from "@/types/game";
import { startGame, kickPlayer, leaveRoom, updateRoom } from "@/socket/emitter";

function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "anon";
  const stored = sessionStorage.getItem("playerId") || localStorage.getItem("playerId");
  if (stored) return stored;
  const id = crypto.randomUUID();
  sessionStorage.setItem("playerId", id);
  return id;
}

type Message = {
  id: string;
  sender: string;
  time: string;
  text: string;
  colorClass: string;
  avatar: string;
};

type Spectator = {
  id: string;
  name: string;
  avatar: string;
  status: string;
};

function LobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { hydrated, room, clearRoom } = useRoomStore();

  const playerId = getOrCreatePlayerId();
  const you = room?.me;
  const opponent = room?.opponent;
  const isHost = room ? you?.player.id === room.hostId : searchParams.get("host") !== "false";

  // State Variables
  const [roomCode, setRoomCode] = useState("000000");
  const [copied, setCopied] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Settings state synced with room
  const [timer, setTimerState] = useState(room?.settings?.timePerRound ?? 60);
  const [maxNos, setMaxNosState] = useState(room?.settings?.maxNos ?? 5);
  const [maxGuesses, setMaxGuessesState] = useState(1);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    if (room?.settings) {
      setTimerState(room.settings.timePerRound ?? 60);
      setMaxNosState(room.settings.maxNos ?? 5);
      setMaxGuessesState(1);
    }
  }, [room?.settings]);

  const setTimer = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(timer) : val;
    setTimerState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: nextVal, maxNos, maxRounds: maxGuesses });
    }
  };

  const setMaxNos = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxNos) : val;
    setMaxNosState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: timer, maxNos: nextVal, maxRounds: maxGuesses });
    }
  };

  const setMaxGuesses = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxGuesses) : val;
    setMaxGuessesState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: timer, maxNos, maxRounds: nextVal });
    }
  };

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "SYSTEM",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: "Room initialized. Connecting to server...",
      colorClass: "text-[#8C7BFF]",
      avatar: "/agents/icon/miks.png",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Spectators state
  const [spectators, setSpectators] = useState<Spectator[]>([]);

  useEffect(() => {
    if (!room) {
      router.replace("/");
    } else if (room.state === "playing") {
      router.replace(`/play?code=${room.id}`);
    }
  }, [room]);

  useEffect(() => {
    setRoomCode(room?.id || "000000");
  }, [room?.id]);

  const handleStartGame = () => {
    if (room?.id) {
      startGame(room.id);
    }
  };

  const handleKickGuest = () => {
    if (room?.id && opponent?.player?.id && isHost) {
      kickPlayer(room.id, opponent.player.id);
    }
  };

  const handleLeaveRoom = () => {
    if (room?.id) {
      leaveRoom(room.id);
    }
    clearRoom();
    router.push("/");
  };

  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scroll chat to bottom when messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // socket.emit(ClientEvents.CHAT_SEND, {
    //   roomId: roomCode,
    //   text: chatInput.trim(),
    // });
    setChatInput("");
  };

  // Invite Guest / Re-fill Slot Handler
  const handleInviteGuest = () => {
    handleCopyCode();

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "SYSTEM",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `Invite code copied! Share it with a friend to invite them.`,
        colorClass: "text-white/50",
        avatar: "/agents/icon/miks.png",
      },
    ]);
  };

  const handleBackButton = () => {
    leaveRoom(room?.id || "");
    router.replace("/");
  }

  // Kick Spectator Handler
  // const handleKickSpectator = (id: string) => {
  //   if (!isHost) return;
  //   setSpectators((prev) => prev.filter((s) => s.id !== id));
  // };

  return (
    <main className="relative h-screen max-h-screen w-screen flex flex-col items-center bg-[#05070a] text-white select-none py-4 px-4 md:px-12 overflow-hidden justify-between">
      {/* BACKGROUND GRAPHIC */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.png"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-[0.75] z-50 object-center scale-[1.01]"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/95 to-[#05070a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#05070a_95%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.015] mix-blend-overlay" /> */}
      </div>

      {/* TOP HEADER */}
      <header className="w-full max-w-[1400px] relative z-10 flex items-center justify-between shrink-0 mb-4 mt-2">
        {/* LOGO & BACK BUTTON */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* VALORANT STYLED V LOGO */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <Image
                src={"/logo.svg"}
                alt="Guess The Agent Logo"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* TEXT: GUESS THE AGENT */}
            <div className="flex flex-col font-valorant leading-[0.8] text-left">
              <span className="text-[14px] tracking-[0.08em] text-white">
                GUESS
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[8px] font-sans font-black text-white/50 tracking-wider">
                  THE
                </span>
                <span className="text-[14px] tracking-[0.08em] text-accent">
                  AGENT
                </span>
              </div>
            </div>
          </Link>

          {/* BACK TO HOME LINK */}
          <button
            onClick={handleBackButton}
            className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 hover:text-white transition-colors duration-200"
          >
            <span className="text-white/50 font-light text-[14px] leading-none">
              &lt;
            </span>
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* HOW TO PLAY BUTTON */}
        <button
          onClick={() => setShowHowToPlay(true)}
          className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/30 transition-all duration-300 px-5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white/80"
        >
          {/* Custom circular thin "i" icon */}
          <div className="h-4.5 w-4.5 rounded-full border border-white/60 flex items-center justify-center font-serif text-[10px] text-white/70 font-semibold leading-none shrink-0">
            i
          </div>
          <span>HOW TO PLAY</span>
        </button>
      </header>

      {/* MAIN LOBBY GRID */}
      <div className="w-full max-w-[1400px] flex-1 grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-5 items-stretch relative z-10 mb-4 overflow-hidden min-h-0">
        {/* LEFT COLUMN: LOBBY & CHAT & SPECTATORS */}
        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* LOBBY PLAYERS DISPLAY PANEL (Box 1) */}
          <div className="border border-white/[0.05] bg-[#07090e]/60 backdrop-blur-md rounded-sm p-4 flex flex-col justify-between relative overflow-hidden shrink-0">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Header info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 text-accent font-display text-xs font-bold uppercase tracking-[0.18em]">
                  <span className="text-accent text-[8px]">◆</span>
                  <span>WAITING FOR PLAYERS...</span>
                </div>
                <span className="text-[11px] text-white/60 mt-1">
                  Share the room code with your friend to invite them.
                </span>
              </div>

              {/* Room Code */}
              <div className="flex flex-col items-end">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/50 font-bold mb-1 font-display">
                  ROOM CODE
                </span>
                <div className="flex items-center gap-3">
                  <span
                    onClick={handleCopyCode}
                    className="font-valorant text-2xl tracking-[0.18em] text-[#FF4655] select-all cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all drop-shadow-[0_0_8px_rgba(255,70,85,0.35)]"
                    title="Click to copy code"
                  >
                    {roomCode}
                  </span>

                  {/* Refresh Button */}
                  <button
                    // onClick={}
                    disabled={!isHost}
                    className="h-8 w-8 flex items-center justify-center rounded border border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all disabled:opacity-30"
                    title="Regenerate Room Code"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Players VS Board */}
            <div className="flex items-center justify-around py-2 max-w-[640px] mx-auto w-full relative">
              {/* Host Player: NHero */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Glowing border ring */}
                  <div
                    className={cn(
                      "absolute -inset-1 rounded-full bg-gradient-to-b blur-sm opacity-60 transition-all duration-300",
                      you?.player.id === room?.hostId
                        ? "from-[#FF4655] to-transparent"
                        : "from-zinc-600 to-transparent",
                    )}
                  />

                  {/* SMALL HOST CROWN OVER HOST AVATAR - TOP LEFT */}
                  <svg
                    className="absolute -top-1.5 -left-1.5 h-5 w-5 text-[#FF4655] rotate-[-15deg] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2 19h20v2H2v-2zM2 5l4 4 6-6 6 6 4-4v12H2V5z" />
                  </svg>

                  {/* Avatar Frame (w-20 h-20 for viewport fit) */}
                  <div
                    className={cn(
                      "relative w-20 h-20 rounded-full border-2 overflow-hidden bg-black/60 transition-colors duration-300 z-0", 
                      you?.player.id === room?.hostId ? "border-[#FF4655]" : "border-white/20"
                    )}
                  >
                    <Image
                      src="/agents/icon/chamber.png"
                      alt="Chamber Avatar"
                      fill
                      className="object-cover scale-110 object-top"
                    />
                  </div>
                </div>

                {/* Host label & Name */}
                <div className="mt-3 flex flex-col items-center">
                  {/* SOLID RED HOST TAG WITH WHITE TEXT */}
                  <span className="bg-[#FF4655] text-white font-display text-[8px] font-black uppercase px-2 py-0.5 tracking-widest rounded-[2px] mb-1 shadow-[0_0_8px_rgba(255,70,85,0.3)]">
                    HOST
                  </span>
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-white">
                    {
                      you?.player.id === room?.hostId
                        ? you?.player.username
                        : opponent?.player.username
                    }
                  </span>
                  {/* Status Indicator */}
                  <div className="mt-1 flex items-center gap-1 text-mint text-[11px] font-bold uppercase tracking-wider">
                    <svg
                      className="h-3 w-3 text-mint animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" />
                      <path
                        d="M9 12l2 2 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Ready</span>
                  </div>
                </div>
              </div>

              {/* VS Diamond Decor */}
              <div className="relative flex items-center justify-center px-4 w-32">
                {/* Dotted horizontal line */}
                <div className="absolute inset-x-0 h-px border-t border-dashed border-white/20 pointer-events-none" />
                {/* Diamond container */}
                <div className="relative z-10 h-10 w-10 rotate-45 border border-accent bg-[#07090e] flex items-center justify-center shadow-[0_0_15px_rgba(255,70,85,0.25)]">
                  <span className="font-valorant text-xs text-accent rotate-[-45deg] tracking-tight">
                    VS
                  </span>
                </div>
              </div>

              {/* Guest Player Slot */}
              {opponent ? (
                <div className="flex flex-col items-center animate-fade-in">
                  <div className="relative group">
                    {/* Glowing border ring */}
                    <div
                      className={cn(
                        "absolute -inset-1 rounded-full bg-gradient-to-b blur-sm opacity-60 transition-all duration-300",
                        you?.player.id !== room?.hostId
                          ? "from-[#FF4655] to-transparent"
                          : "from-zinc-600 to-transparent",
                      )}
                    />

                    {/* Avatar Frame (w-20 h-20 for viewport fit) */}
                    <div className={cn(
                      "relative w-20 h-20 rounded-full border-2 overflow-hidden bg-black/60 z-0",
                      you?.player.id !== room?.hostId ? "border-[#FF4655]" : "border-white/20"
                    )}>
                      <Image
                        src="/agents/icon/jett.png"
                        alt="Guest Avatar"
                        fill
                        className="object-cover scale-110 object-top"
                      />
                    </div>

                    {/* HOST OVERLAY ACTION: KICK PLAYER ON HOVER */}
                    {isHost && (
                      <button
                        onClick={handleKickGuest}
                        className="absolute inset-0 bg-black/75 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-[#FF4655] font-display text-[9px] font-black uppercase tracking-wider border border-[#FF4655]/40"
                        title="Kick Guest Player"
                      >
                        <X className="h-4 w-4 mb-0.5" />
                        <span>KICK</span>
                      </button>
                    )}
                  </div>

                  {/* Guest Details */}
                  <div className="mt-3 flex flex-col items-center">
                    <div className="h-[15px] mb-1" />{" "}
                    {/* Align with host label spacing */}
                    <span className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {
                        you?.player.id !== room?.hostId
                          ? you?.player.username
                          : opponent?.player.username
                      }
                    </span>
                    <div className="mt-1 flex items-center gap-1 text-mint text-[11px] font-bold uppercase tracking-wider">
                      <svg
                        className="h-3 w-3 text-mint animate-pulse"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <path
                          d="M9 12l2 2 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Ready</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty guest slot (dashed invitation container) */
                <div className="flex flex-col items-center animate-fade-in">
                  <button
                    onClick={handleInviteGuest}
                    className="relative w-20 h-20 rounded-full border border-dashed border-white/20 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/40 transition-all text-white/40 hover:text-white/80 group"
                    title="Invite Player"
                  >
                    <UserPlus className="h-6 w-6 group-hover:scale-105 transition-transform" />
                    <span className="text-[8px] uppercase tracking-wider font-bold font-display mt-1">
                      INVITE
                    </span>
                  </button>
                  <div className="mt-3 flex flex-col items-center">
                    <div className="h-[15px] mb-1" />
                    <span className="font-display text-sm font-bold uppercase tracking-wide text-white/40">
                      Waiting...
                    </span>
                    <span className="text-[10px] text-white/35 font-medium mt-1">
                      Empty Slot
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOWER SECTION: SPECTATORS & CHAT (Side by Side - Height Managed) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 min-h-0 overflow-hidden">
            {/* SPECTATORS PANEL */}
            <div className="border border-white/[0.05] bg-[#07090e]/60 backdrop-blur-md rounded-sm p-4 flex flex-col justify-between h-full min-h-0 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5 mb-3 shrink-0">
                <div className="flex items-center gap-2 text-white/65 text-[10px] font-display font-bold uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5" />
                  <span>SPECTATORS ({spectators.length}/10)</span>
                </div>

                <button
                  // onClick={addMockSpectator}
                  className="flex items-center gap-1 border border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.05] px-2 py-0.5 text-[9px] font-bold font-display uppercase tracking-wider text-white/90 hover:text-white transition-all rounded-sm"
                >
                  <UserPlus className="h-2.5 w-2.5 text-white/70" />
                  <span>INVITE SPECTATORS</span>
                </button>
              </div>

              {/* Spectator slots list - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {/* Active spectators */}
                {spectators.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.05] rounded-sm p-1.5 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-6.5 w-6.5 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={spec.avatar}
                          alt="Spectator Avatar"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-display text-xs font-bold text-white tracking-wide truncate max-w-[110px]">
                          {spec.name}
                        </span>
                        <span className="text-[8px] text-sky-400 font-semibold tracking-wider font-display uppercase mt-0.5">
                          {spec.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="h-6.5 w-6.5 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors">
                        <Eye className="h-3 w-3" />
                      </button>

                      {/* HOST KICK SPECTATOR OPTION */}
                      {isHost && (
                        <button
                          // onClick={() => handleKickSpectator(spec.id)}
                          className="h-6.5 w-6.5 flex items-center justify-center text-accent/40 hover:text-accent hover:bg-accent/10 rounded transition-all"
                          title="Kick Spectator"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty placeholder slots */}
                {Array.from({ length: Math.max(0, 5 - spectators.length) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 border border-dashed border-white/5 rounded-sm p-1.5 opacity-35 bg-transparent"
                    >
                      <div className="h-6.5 w-6.5 rounded-full border border-dashed border-white/10 flex items-center justify-center text-white/20 bg-transparent">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="font-display text-[9.5px] text-white/55 tracking-wider">
                        Waiting for spectator...
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* ROOM CHAT PANEL */}
            <LobbyChat
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: GAME SETTINGS */}
        <LobbySettings
          isHost={isHost}
          timer={timer}
          setTimer={setTimer}
          maxNos={maxNos}
          setMaxNos={setMaxNos}
          maxGuesses={maxGuesses}
          setMaxGuesses={setMaxGuesses}
          showMoreOptions={showMoreOptions}
          setShowMoreOptions={setShowMoreOptions}
        />
      </div>

      {/* FOOTER ACTIONS BAR */}
      <div className="w-full max-w-[1400px] flex items-center justify-center gap-4 shrink-0 relative z-10 py-3 mt-auto border-t border-white/[0.02] pt-4">
        {/* LEAVE ROOM BUTTON */}
        <button
          onClick={handleLeaveRoom}
          className="h-11 px-10 rounded-[3px] border border-white/15 bg-black/40 hover:bg-white/5 hover:border-white/30 text-white/90 hover:text-white font-valorant text-[12px] tracking-[0.2em] uppercase flex items-center justify-center transition-all duration-300 cursor-pointer"
        >
          LEAVE ROOM
        </button>

        {/* START GAME BUTTON */}
        <button 
          onClick={handleStartGame}
          disabled={you?.player.id !== room?.hostId || room?.opponent === null}
          className={cn(
            "h-11 px-16 font-valorant text-[12px] tracking-[0.2em] uppercase text-white flex items-center justify-center transition-all duration-300 relative group overflow-hidden rounded-[3px] border",
            you?.player.id === room?.hostId && room?.opponent !== null
              ? "bg-gradient-to-r from-[#FF4655] to-[#B5323D] hover:shadow-[0_0_25px_rgba(255,70,85,0.55)] border-[#FF4655] hover:opacity-95 active:scale-[0.98] cursor-pointer"
              : "bg-white/[0.03] border-white/10 text-white/30 cursor-not-allowed",
          )}
        >
          <div className="flex items-center gap-6">
            <span>START GAME</span>

            {/* Diamond bracket design detail on the right */}
            <div className="flex items-center gap-1.5 text-white/60">
              <span className="h-5 w-[1px] bg-white/20 mr-1" />
              <div className="h-2 w-2 rotate-45 border border-current bg-transparent" />
              <div className="h-1.5 w-1.5 rotate-45 bg-current" />
            </div>
          </div>
        </button>
      </div>

      {/* ============================================== */}
      {/* HOW TO PLAY MODAL */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}

export default function LobbyPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#05070a] text-white">
          <div className="flex flex-col items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-12 h-12 animate-pulse">
              <path d="M15 15 L45 15 L25 85 Z" fill="#FFFFFF" />
              <path d="M32 15 L52 15 L37 75 Z" fill="#FF4655" />
              <path d="M58 15 L88 15 L78 85 Z" fill="#FF4655" />
            </svg>
            <span className="font-valorant text-xs text-white/50 tracking-widest mt-2">
              Loading Lobby...
            </span>
          </div>
        </main>
      }
    >
      <LobbyContent />
    </Suspense>
  );
}
