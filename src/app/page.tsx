"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCw,
  UserPlus,
  Timer as TimerIcon,
  MessageSquare,
  Target,
  Compass,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Check,
  Copy,
  Home,
  Swords,
  Trophy,
  Mail,
  Settings as SettingsIcon,
  Zap,
  Sliders,
  Plus,
  Crown,
  Users,
  Send,
  MessageCircle,
  User,
  Edit3,
  UserCheck,
  Loader2,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LobbyChat } from "@/components/LobbyChat";
import { LobbySettings } from "@/components/LobbySettings";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { socket } from "@/socket";
import { useRoomStore } from "@/store/roomStore";
import { createRoom, joinRoom, startGame, kickPlayer, leaveRoom, updateRoom } from "@/socket/emitter";
import { ServerEvents } from "@/socket/events";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  sender: string;
  time: string;
  text: string;
  colorClass: string;
  avatar: string;
};

type Friend = {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "ingame";
};

const INITIAL_FRIENDS_LIST: Friend[] = [
  { id: "1", name: "OMEN#1337", avatar: "/agents/icon/omen.png", status: "online" },
  { id: "2", name: "JETT#9021", avatar: "/agents/icon/jett.png", status: "online" },
  { id: "3", name: "KILLJOY#4040", avatar: "/agents/icon/killjoy.png", status: "online" },
  { id: "4", name: "CYPHER#0007", avatar: "/agents/icon/cypher.png", status: "ingame" },
  { id: "5", name: "SAGE#8888", avatar: "/agents/icon/sage.png", status: "online" },
];

export default function DefaultPartyPage() {
  const router = useRouter();

  const { room, clearRoom } = useRoomStore();

  // Callsign from localStorage
  const [savedUsername, setSavedUsername] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Form & Room state
  const [roomInput, setRoomInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreatingOrJoining, setIsCreatingOrJoining] = useState(false);
  const [joinStep, setJoinStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Gamemode Selector State
  const [selectedMode, setSelectedMode] = useState<"duel" | "blitz">("duel");
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Friends Menu Collapsible State
  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(false);

  // Modals & Drawers state
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);

  // Add Friend state
  const [friendInput, setFriendInput] = useState("");
  const [friendsList, setFriendsList] = useState<Friend[]>(INITIAL_FRIENDS_LIST);
  const [friendAddedToast, setFriendAddedToast] = useState("");

  // Settings state synced with room
  const [timer, setTimerState] = useState(room?.settings?.timePerRound ?? 60);
  const [maxNos, setMaxNosState] = useState(room?.settings?.maxNos ?? 5);
  const [maxGuesses, setMaxGuessesState] = useState(room?.settings?.maxGuesses ?? 1);
  const [questionCount, setQuestionCountState] = useState(room?.settings?.questionCount ?? 15);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Redirect to /callsign if username is not saved in localStorage
  useEffect(() => {
    setIsClient(true);
    const username = localStorage.getItem("username");
    if (!username) {
      router.replace("/callsign");
    } else {
      setSavedUsername(username);
    }
  }, [router]);

  useEffect(() => {
    if (room?.settings) {
      setTimerState(room.settings.timePerRound ?? 60);
      setMaxNosState(room.settings.maxNos ?? 5);
      setMaxGuessesState(room.settings.maxGuesses ?? 1);
      setQuestionCountState(room.settings.questionCount ?? 15);
    }
  }, [room?.settings]);

  // Handle room state change
  useEffect(() => {
    if (room?.state === "playing") {
      router.push(`/play?code=${room.id}`);
    }
  }, [room, router]);

  // Socket error handler
  useEffect(() => {
    const onError = (err: any) => {
      setIsCreatingOrJoining(false);
      setErrorMsg(err?.message || "An error occurred");
      setTimeout(() => setErrorMsg(""), 4000);
    };
    socket.on(ServerEvents.ERROR, onError);
    return () => {
      socket.off(ServerEvents.ERROR, onError);
    };
  }, []);

  const playerId = isClient
    ? sessionStorage.getItem("playerId") || localStorage.getItem("playerId") || "anon"
    : "anon";

  const you = room?.me;
  const opponent = room?.opponent;
  const isHost = room ? you?.player.id === room.hostId : true;

  const setTimer = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(timer) : val;
    setTimerState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: nextVal, maxNos, maxGuesses, questionCount });
    }
  };

  const setMaxNos = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxNos) : val;
    setMaxNosState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: timer, maxNos: nextVal, maxGuesses, questionCount });
    }
  };

  const setMaxGuesses = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxGuesses) : val;
    setMaxGuessesState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: timer, maxNos, maxGuesses: nextVal, questionCount });
    }
  };

  const setQuestionCount = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(questionCount) : val;
    setQuestionCountState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, { timePerRound: timer, maxNos, maxGuesses, questionCount: nextVal });
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
      text: "Lobby initialized. Create or join a party to start!",
      colorClass: "text-[#8C7BFF]",
      avatar: "/agents/icon/miks.png",
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Execute Create Party
  const handleCreateParty = () => {
    if (!savedUsername) {
      router.push("/callsign");
      return;
    }
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    setJoinStep("CREATING PARTY LOBBY...");
    
    let pId = localStorage.getItem("playerId") || sessionStorage.getItem("playerId");
    if (!pId) {
      pId = crypto.randomUUID();
      localStorage.setItem("playerId", pId);
      sessionStorage.setItem("playerId", pId);
    }
    createRoom({ id: pId, username: savedUsername });
  };

  // Execute Join Party
  const handleJoinParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim()) return;
    if (!savedUsername) {
      router.push("/callsign");
      return;
    }
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    setJoinStep("JOINING PARTY LOBBY...");

    let pId = localStorage.getItem("playerId") || sessionStorage.getItem("playerId");
    if (!pId) {
      pId = crypto.randomUUID();
      localStorage.setItem("playerId", pId);
      sessionStorage.setItem("playerId", pId);
    }
    joinRoom(roomInput.trim().toUpperCase(), { id: pId, username: savedUsername });
  };

  const handleStartGame = () => {
    if (room?.id && isHost && opponent) {
      startGame(room.id);
    }
  };

  const handleKickGuest = () => {
    if (room?.id && opponent?.player?.id && isHost) {
      kickPlayer(room.id, opponent.player.id);
    }
  };

  const handleLeaveParty = () => {
    if (room?.id) {
      leaveRoom(room.id);
    }
    clearRoom();
    setIsCreatingOrJoining(false);
  };

  const handleCopyCode = () => {
    if (!room?.id) return;
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: savedUsername || "YOU",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: chatInput.trim(),
        colorClass: "text-[#3CF2C4]",
        avatar: "/agents/icon/chamber.png",
      },
    ]);
    setChatInput("");
  };

  // Add Friend Handler
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim()) return;
    const name = friendInput.trim().toUpperCase();
    
    if (friendsList.some(f => f.name === name)) {
      setFriendAddedToast("Friend already in list!");
      setTimeout(() => setFriendAddedToast(""), 3000);
      return;
    }

    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
      avatar: "/agents/icon/iso.png",
      status: "online",
    };

    setFriendsList([newFriend, ...friendsList]);
    setFriendInput("");
    setFriendAddedToast(`Added ${name} to friends!`);
    setTimeout(() => setFriendAddedToast(""), 3000);
  };

  if (!isClient) return null;

  return (
    <main className="relative h-screen max-h-screen w-screen flex flex-col justify-between bg-[#040609] text-white select-none overflow-hidden font-body">
      
      {/* BACKGROUND ARTWORK */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.png"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-35 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040609]/80 via-transparent to-[#040609]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#040609_90%)]" />
      </div>

      {/* ==================================================== */}
      {/* 1. TOP HEADER NAVIGATION BAR (Valorant Client Style) */}
      {/* ==================================================== */}
      <header className="relative z-20 w-full h-16 bg-[#080B10]/90 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Logo + Subtitle */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image src="/logo.svg" alt="ValoGuess Logo" fill className="object-contain transition-transform group-hover:scale-105" priority />
          </div>
          <div className="flex flex-col text-left leading-none font-valorant">
            <h1 className="flex items-baseline gap-1 m-0">
              <span className="text-sm tracking-wider text-white">VALO</span>
              <span className="text-sm tracking-wider text-accent">GUESS</span>
              <span className="sr-only"> — The Tactical 1v1 Valorant Guess Who Game</span>
            </h1>
            <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-white/40 mt-1">
              ASK. ELIMINATE. GUESS. <span className="text-accent">WIN.</span>
            </span>
          </div>
        </Link>

        {/* Center: Navigation Bar & PLAY Header Tab */}
        <div className="flex items-center gap-2">
          <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-sm border border-accent/40 bg-accent/15 text-accent shadow-[0_0_12px_rgba(255,70,85,0.2)]">
            <Home className="h-4.5 w-4.5" />
          </Link>
          <div className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition">
            <Swords className="h-4.5 w-4.5" />
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition">
            <Trophy className="h-4.5 w-4.5" />
          </div>

          {/* LARGE RED CENTRAL "PLAY" TAB */}
          <div className="relative px-12 h-11 flex items-center justify-center clip-tag bg-gradient-to-r from-accent via-accent to-accent-dim text-white font-valorant text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(255,70,85,0.4)] mx-4">
            <span>PLAY</span>
          </div>

          <button onClick={() => setShowHowToPlay(true)} className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition">
            <Mail className="h-4.5 w-4.5" />
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition" title="Room Settings">
            <SettingsIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Right: Online Status & Callsign Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-mint/30 bg-mint/5 text-mint text-[10px] font-display font-bold uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-mint animate-pulse shadow-[0_0_8px_#3cf2c4]" />
            <span>ONLINE</span>
          </div>

          {/* Callsign Link to /callsign */}
          <Link
            href="/callsign"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/40 bg-accent/10 hover:bg-accent/20 text-white transition group"
            title="Click to edit your tactical callsign"
          >
            <User className="h-3.5 w-3.5 text-accent" />
            <span className="font-valorant text-xs tracking-wider text-white">
              {savedUsername || "AGENT"}
            </span>
            <Edit3 className="h-3 w-3 text-white/40 group-hover:text-white transition" />
          </Link>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. SUB-HEADER BAR (Mode Selector Card + Settings Gear + Party Controls) */}
      {/* ==================================================== */}
      <div className="relative z-50 px-8 pt-4 flex items-center justify-between shrink-0">
        
        {/* GAMEMODE SELECTOR CARD WITH SETTINGS GEAR BUTTON ⚙️ */}
        <div className="flex items-center gap-2 relative z-50">
          
          {/* Mode Dropdown Trigger Button */}
          <div className="relative z-50">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="clip-notch-both border border-[#FF4655]/60 bg-[#0c1017] hover:bg-[#121824] backdrop-blur-md p-3 px-5 flex items-center gap-3.5 hover:border-[#FF4655] transition-all text-left shadow-[0_0_20px_rgba(255,70,85,0.2)] group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-sm border border-[#FF4655]/50 bg-[#FF4655]/15 flex items-center justify-center text-[#FF4655] shrink-0 shadow-[0_0_10px_rgba(255,70,85,0.3)]">
                {selectedMode === "duel" ? <Swords className="h-5 w-5" /> : <Flame className="h-5 w-5 text-[#FF4655] animate-pulse" />}
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#FF4655] drop-shadow-[0_0_6px_rgba(255,70,85,0.3)]">
                  GAMEMODE
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-valorant text-lg tracking-[0.08em] text-white">
                    {selectedMode === "duel" ? "1V1 DUEL" : "BLITZ MODE"}
                  </span>
                  {selectedMode === "blitz" && (
                    <span className="text-[8px] font-display font-black bg-[#FF4655] text-white px-2 py-0.5 rounded uppercase tracking-widest shadow-[0_0_8px_rgba(255,70,85,0.4)]">⚡ FAST</span>
                  )}
                </div>
              </div>

              <ChevronDown className={cn("h-4 w-4 text-white ml-3 transition-transform duration-200 group-hover:text-[#FF4655]", showModeDropdown && "rotate-180")} />
            </button>

            {/* GAMEMODE DROPDOWN MENU */}
            <AnimatePresence>
              {showModeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="absolute left-0 top-full mt-2 w-72 z-[100] bg-[#0c1017] border-2 border-[#FF4655]/50 rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.9)] p-2.5 space-y-2 backdrop-blur-xl"
                >
                  {/* OPTION 1: 1V1 DUEL */}
                  <button
                    onClick={() => {
                      setSelectedMode("duel");
                      setShowModeDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-sm border transition-all flex items-center justify-between cursor-pointer",
                      selectedMode === "duel"
                        ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_12px_rgba(255,70,85,0.25)]"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Swords className="h-4.5 w-4.5 text-[#FF4655]" />
                      <div className="flex flex-col">
                        <span className="font-valorant text-xs tracking-wider text-white">1V1 DUEL</span>
                        <span className="text-[9.5px] font-sans font-semibold text-white/70 mt-0.5">Tactical 1v1 agent elimination</span>
                      </div>
                    </div>
                    {selectedMode === "duel" && <Check className="h-4 w-4 text-[#FF4655]" />}
                  </button>

                  {/* OPTION 2: BLITZ MODE */}
                  <button
                    onClick={() => {
                      setSelectedMode("blitz");
                      setShowModeDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-sm border transition-all flex items-center justify-between cursor-pointer",
                      selectedMode === "blitz"
                        ? "border-[#FF4655] bg-[#FF4655]/15 text-white shadow-[0_0_12px_rgba(255,70,85,0.25)]"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="h-4.5 w-4.5 text-[#FF4655]" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-valorant text-xs tracking-wider text-white">BLITZ</span>
                          <span className="text-[8px] font-display font-black bg-[#FF4655] text-white px-1.5 py-0.2 rounded">⚡ NEW</span>
                        </div>
                        <span className="text-[9.5px] font-sans font-semibold text-white/70 mt-0.5">Fast 30s timers & rapid rounds</span>
                      </div>
                    </div>
                    {selectedMode === "blitz" && <Check className="h-4 w-4 text-[#FF4655]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SETTINGS GEAR BUTTON NEXT TO MODE SELECTOR ⚙️ */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="h-11 w-11 flex items-center justify-center rounded-sm border border-[#FF4655]/50 bg-[#0c1017] hover:bg-[#FF4655]/20 hover:border-[#FF4655] text-white/90 hover:text-white transition-all shadow-[0_0_15px_rgba(255,70,85,0.15)] cursor-pointer"
            title="Configure Game Settings (Timer, Max NOs, Max Guesses)"
          >
            <Sliders className="h-5 w-5 text-[#FF4655]" />
          </button>

        </div>

        {/* Center Party State / Create / Join Controls */}
        {room ? (
          /* When in a party: Show Party Code badge & Copy */
          <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-sm p-1.5 px-4 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.25em] text-white/50 font-bold font-display">PARTY CODE</span>
              <span className="font-valorant text-xl tracking-[0.2em] text-accent drop-shadow-[0_0_8px_rgba(255,70,85,0.3)]">
                #{room.id}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-accent/40 bg-accent/10 hover:bg-accent/20 text-white font-display text-[10px] font-bold uppercase tracking-wider transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-mint" /> : <Copy className="h-3.5 w-3.5 text-accent" />}
              <span>{copied ? "COPIED" : "COPY CODE"}</span>
            </button>
          </div>
        ) : (
          /* When NO party: Show CREATE PARTY and JOIN PARTY controls */
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateParty}
              disabled={isCreatingOrJoining}
              className="px-6 py-2 bg-accent hover:bg-accent-dim text-white font-valorant text-xs tracking-[0.2em] uppercase rounded-sm shadow-[0_0_15px_rgba(255,70,85,0.3)] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>CREATE PARTY</span>
            </button>

            <form onSubmit={handleJoinParty} className="flex items-center gap-2">
              <Input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                placeholder="PARTY CODE #"
                className="w-36 h-9 bg-black/60 border-white/10 px-3 font-display text-white text-xs uppercase tracking-wider placeholder-white/30 rounded-sm"
              />
              <button
                type="submit"
                disabled={!roomInput.trim() || isCreatingOrJoining}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-display text-[11px] font-bold tracking-wider uppercase rounded-sm transition disabled:opacity-30"
              >
                JOIN
              </button>
            </form>
          </div>
        )}

      </div>

      {errorMsg && (
        <div className="relative z-10 w-full max-w-md mx-auto mt-2 px-4">
          <div className="bg-accent/15 border border-accent/40 text-accent text-xs font-display font-bold uppercase tracking-wider p-2.5 rounded text-center">
            {errorMsg}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CENTER CONTENT: 4 ANGLED PLAYER CARDS (2 PRIMARY + 2 EXTRA SLOTS) & COLLAPSIBLE SIDEBAR */}
      {/* ==================================================== */}
      <div className="relative z-10 flex-1 flex items-center justify-between gap-6 px-8 py-2 min-h-0">
        
        {/* CENTER SLOTS (4 Angled Valorant Lobby Cards: 2 Main + 2 Extra) */}
        <div className="flex-1 flex items-center justify-center gap-4 h-full max-h-[520px] max-w-[1100px] mx-auto">
          
          {/* SLOT 1 (LEFT MAIN SLOT - HOST / PARTY LEADER) */}
          {room ? (
            /* HOST / PARTY LEADER CARD */
            <div className="flex flex-col items-center justify-between flex-1 h-full max-h-[520px] max-w-[260px] border-2 border-accent/60 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 shadow-[0_0_30px_rgba(255,70,85,0.15)] group transition-all duration-300">
              <div className="w-full flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 bg-accent px-2.5 py-1 clip-tag text-white font-display text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(255,70,85,0.4)]">
                  <Crown className="h-3 w-3" />
                  <span>PARTY LEADER</span>
                </div>
                <span className="text-[9px] text-mint font-display font-bold uppercase tracking-wider">READY</span>
              </div>

              <div className="relative w-full flex-1 my-2 overflow-hidden rounded-sm border border-white/10 bg-base-950">
                <Image
                  src="/agents/banner/chamber.png"
                  alt="Agent Banner"
                  fill
                  className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16] via-transparent to-transparent" />
              </div>

              <div className="w-full text-center z-10 pt-1">
                <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
                  {you?.player.username || savedUsername}
                </h3>
                <span className="text-[10px] text-accent font-display font-bold uppercase tracking-widest block mt-0.5">
                  {isHost ? "HOST • 1V1 DUELIST" : "MEMBER"}
                </span>
              </div>
            </div>
          ) : (
            /* NO PARTY DEFAULT CENTER EMBLEM */
            <div className="flex flex-col items-center justify-center flex-1 h-full max-h-[520px] max-w-[260px] border border-dashed border-accent/40 bg-black/40 backdrop-blur-md clip-notch-both relative p-6 text-center shadow-[0_0_20px_rgba(255,70,85,0.08)]">
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-accent/20 blur-md rounded-full animate-pulse" />
                <Image src="/logo.svg" alt="V Emblem" fill className="object-contain" />
              </div>

              <h2 className="font-valorant text-2xl tracking-wider text-white mb-1">
                NO PARTY
              </h2>
              <p className="text-ink-400 text-xs max-w-[180px] leading-relaxed mb-6 font-medium">
                Create or join a party to start playing
              </p>

              <button
                onClick={handleCreateParty}
                disabled={isCreatingOrJoining}
                className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-dim text-white font-valorant text-xs tracking-widest uppercase rounded-sm shadow-[0_0_20px_rgba(255,70,85,0.4)] transition cursor-pointer"
              >
                {isCreatingOrJoining ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>CREATE PARTY</span>
              </button>
            </div>
          )}

          {/* SLOT 2 (RIGHT MAIN SLOT - GUEST / CHALLENGER) */}
          {room ? (
            opponent ? (
              /* OPPONENT CARD */
              <div className="flex flex-col items-center justify-between flex-1 h-full max-h-[480px] max-w-[260px] border-2 border-mint/40 bg-[#0a0e16]/80 backdrop-blur-md clip-notch-both relative p-4 shadow-[0_0_20px_rgba(60,242,196,0.1)] group transition-all duration-300">
                <div className="w-full flex items-center justify-between z-10">
                  <span className="bg-mint/20 border border-mint/40 px-2 py-0.5 text-mint font-display text-[9px] font-bold uppercase tracking-widest rounded-sm">
                    CHALLENGER
                  </span>
                  {isHost && (
                    <button
                      onClick={handleKickGuest}
                      className="text-accent/60 hover:text-accent p-1 hover:bg-accent/10 rounded transition"
                      title="Kick Player"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="relative w-full flex-1 my-2 overflow-hidden rounded-sm border border-white/10 bg-base-950">
                  <Image
                    src="/agents/banner/jett.png"
                    alt="Opponent Banner"
                    fill
                    className="object-cover object-top scale-105 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16] via-transparent to-transparent" />
                </div>

                <div className="w-full text-center z-10 pt-1">
                  <h3 className="font-display text-xl font-black uppercase tracking-wider text-white truncate">
                    {opponent.player.username}
                  </h3>
                  <span className="text-[10px] text-mint font-display font-bold uppercase tracking-widest block mt-0.5">
                    READY FOR MATCH
                  </span>
                </div>
              </div>
            ) : (
              /* IN PARTY BUT WAITING FOR OPPONENT */
              <div className="flex flex-col items-center justify-center flex-1 h-full max-h-[480px] max-w-[260px] border border-dashed border-white/20 bg-black/30 backdrop-blur-md clip-notch-both relative p-6 text-center">
                <div className="h-16 w-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4 text-white/40">
                  <UserPlus className="h-7 w-7" />
                </div>

                <h3 className="font-valorant text-lg tracking-wider text-white mb-1">
                  WAITING...
                </h3>
                <p className="text-ink-400 text-xs max-w-[160px] leading-relaxed mb-5 font-medium">
                  Share party code #{room.id} to invite opponent
                </p>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-display text-[10px] font-bold tracking-widest uppercase rounded-sm border border-white/15 transition"
                >
                  <Copy className="h-3.5 w-3.5 text-accent" />
                  <span>COPY CODE</span>
                </button>
              </div>
            )
          ) : (
            /* SLOT 2 EMPTY (WHEN NO PARTY) */
            <div className="hidden sm:flex flex-col items-center justify-center flex-1 h-full max-h-[480px] max-w-[260px] border border-white/5 bg-black/20 clip-notch-both opacity-35 relative">
              <Plus className="h-8 w-8 text-white/30" />
            </div>
          )}

          {/* SLOT 3 (EXTRA PARTY SLOT FOR 4 PLAYERS MAX) */}
          <div className="hidden md:flex flex-col items-center justify-center flex-1 h-full max-h-[460px] max-w-[220px] border border-white/5 bg-black/20 clip-notch-both opacity-30 hover:opacity-50 transition relative">
            <Plus className="h-6 w-6 text-white/30" />
            <span className="text-[8px] font-display uppercase tracking-widest text-white/30 mt-1">SLOT 3</span>
          </div>

          {/* SLOT 4 (EXTRA PARTY SLOT FOR 4 PLAYERS MAX) */}
          <div className="hidden lg:flex flex-col items-center justify-center flex-1 h-full max-h-[440px] max-w-[220px] border border-white/5 bg-black/20 clip-notch-both opacity-25 hover:opacity-45 transition relative">
            <Plus className="h-6 w-6 text-white/30" />
            <span className="text-[8px] font-display uppercase tracking-widest text-white/30 mt-1">SLOT 4</span>
          </div>

        </div>

        {/* ==================================================== */}
        {/* COLLAPSIBLE RIGHT SIDEBAR: PLAYERS MENU & ADD FRIEND */}
        {/* ==================================================== */}
        <div 
          className={cn(
            "hidden md:flex flex-col h-full max-h-[520px] bg-black/50 border border-white/10 rounded-sm backdrop-blur-md justify-between transition-all duration-300 shrink-0",
            isFriendsCollapsed ? "w-16 p-2" : "w-72 p-4"
          )}
        >
          {/* Header Bar with Collapse Toggle Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
            {!isFriendsCollapsed && (
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-white/90 truncate">
                <Users className="h-4 w-4 text-accent shrink-0" />
                <span>PLAYERS ({friendsList.length})</span>
              </div>
            )}
            
            <button
              onClick={() => setIsFriendsCollapsed(!isFriendsCollapsed)}
              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition mx-auto"
              title={isFriendsCollapsed ? "Expand Friends Menu" : "Collapse Friends Menu"}
            >
              {isFriendsCollapsed ? <ChevronLeft className="h-4 w-4 text-accent" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* ADD FRIEND SECTION (Shown when expanded) */}
          {!isFriendsCollapsed ? (
            <div className="py-3 border-b border-white/10 shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-white/50 font-display font-bold block mb-1.5 text-left">
                ADD FRIEND
              </span>
              <form onSubmit={handleAddFriend} className="flex items-center gap-1.5">
                <Input
                  type="text"
                  value={friendInput}
                  onChange={(e) => setFriendInput(e.target.value)}
                  placeholder="CALLSIGN (E.G. JETT#9021)"
                  className="h-8 bg-black/60 border-white/10 text-[10px] font-display uppercase tracking-wider text-white placeholder-white/30 px-2.5"
                />
                <button
                  type="submit"
                  disabled={!friendInput.trim()}
                  className="h-8 px-3 bg-accent hover:bg-accent-dim text-white font-display text-[9px] font-bold uppercase tracking-wider rounded-sm disabled:opacity-30 transition shrink-0"
                >
                  ADD
                </button>
              </form>
              {friendAddedToast && (
                <span className="text-[9px] text-mint font-display font-bold mt-1.5 block text-left animate-fade-in">
                  {friendAddedToast}
                </span>
              )}
            </div>
          ) : null}

          {/* Friends List Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2 py-3 scrollbar-thin">
            {friendsList.map((friend) => (
              <div 
                key={friend.id} 
                className={cn(
                  "flex items-center rounded-sm bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition cursor-pointer",
                  isFriendsCollapsed ? "justify-center p-1.5" : "justify-between p-2"
                )}
                onClick={() => {
                  if (isFriendsCollapsed) setIsFriendsCollapsed(false);
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <Image src={friend.avatar} alt={friend.name} fill className="object-cover object-top" />
                    {/* Status Dot */}
                    <div 
                      className={cn(
                        "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-black",
                        friend.status === "online" ? "bg-mint" : "bg-amber-400"
                      )} 
                    />
                  </div>

                  {!isFriendsCollapsed && (
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-display text-[11px] font-bold text-white tracking-wide truncate max-w-[110px]">{friend.name}</span>
                      <span className="text-[8px] text-mint uppercase font-semibold tracking-wider font-display">
                        {friend.status === "online" ? "• Online" : "• In Game"}
                      </span>
                    </div>
                  )}
                </div>

                {!isFriendsCollapsed && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFriendAddedToast(`Invited ${friend.name}!`);
                      setTimeout(() => setFriendAddedToast(""), 3000);
                    }}
                    className="text-white/40 hover:text-accent p-1 transition"
                    title="Invite to Party"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ==================================================== */}
      {/* 4. BOTTOM CONTROL ACTION BAR (Valorant Style) */}
      {/* ==================================================== */}
      <footer className="relative z-20 w-full h-20 bg-[#080B10]/95 border-t border-white/10 px-8 flex items-center justify-between shrink-0">
        
        {/* Left: Chat Drawer Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChatDrawer(!showChatDrawer)}
            className={cn(
              "h-11 w-11 flex items-center justify-center rounded-sm border transition relative",
              showChatDrawer
                ? "border-accent bg-accent/20 text-accent shadow-[0_0_12px_rgba(255,70,85,0.3)]"
                : "border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/70 hover:text-white"
            )}
            title="Toggle Room Chat"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
          </button>
        </div>

        {/* Center: BIG RED START MATCH BUTTON & CUSTOM GAME */}
        <div className="flex items-center gap-4">
          
          {/* BIG RED GLOWING START MATCH BUTTON */}
          <button
            onClick={handleStartGame}
            disabled={!room || !isHost || !opponent}
            className={cn(
              "h-14 px-24 font-valorant text-xl tracking-[0.25em] uppercase text-white flex items-center justify-center transition-all duration-300 relative clip-tag border",
              room && isHost && opponent
                ? "bg-accent hover:bg-accent-dim shadow-[0_0_35px_rgba(255,70,85,0.6)] border-accent cursor-pointer active:scale-95"
                : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-50"
            )}
            title={!room ? "Create or join a party to start" : !opponent ? "Waiting for opponent to join" : "Start Match"}
          >
            <span>{room ? (isHost ? (opponent ? "START MATCH" : "WAITING FOR PLAYER") : "READY") : "START MATCH"}</span>
          </button>

          {/* CUSTOM GAME / ROOM SETTINGS OVERLAY BUTTON */}
          <button onClick={() => setShowSettingsModal(true)} className="h-12 px-6 rounded-sm border border-white/15 bg-white/[0.03] hover:bg-white/10 font-display text-xs font-bold uppercase tracking-[0.2em] text-white transition flex items-center gap-2">
            <Sliders className="h-4 w-4 text-accent" />
            <span>CUSTOM GAME</span>
          </button>
        </div>

        {/* Right: LEAVE PARTY (If in room) */}
        {room && (
          <button
            onClick={handleLeaveParty}
            className="h-11 px-6 rounded-sm border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-display text-xs font-bold uppercase tracking-[0.2em] transition cursor-pointer"
          >
            LEAVE PARTY
          </button>
        )}

      </footer>

      {/* SLIDING CHAT DRAWER */}
      <AnimatePresence>
        {showChatDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-8 z-50 w-96 h-[400px] shadow-2xl"
          >
            <LobbyChat
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CUSTOM GAME SETTINGS MODAL */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="bg-transparent border-none max-w-xl p-0 shadow-none outline-none">
          <div className="relative w-full h-[540px]">
            <LobbySettings
              isHost={isHost}
              timer={timer}
              setTimer={setTimer}
              maxNos={maxNos}
              setMaxNos={setMaxNos}
              maxGuesses={maxGuesses}
              setMaxGuesses={setMaxGuesses}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              showMoreOptions={showMoreOptions}
              setShowMoreOptions={setShowMoreOptions}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* HOW TO PLAY MODAL */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

    </main>
  );
}
