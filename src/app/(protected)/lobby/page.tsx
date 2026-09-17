"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "@/socket";
import { useRoomStore } from "@/store/roomStore";
import {
  createRoom,
  joinRoom,
  startGame,
  kickPlayer,
  leaveRoom,
  updateRoom,
} from "@/socket/emitter";
import { ServerEvents } from "@/socket/events";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { Message } from "./_components/types";
import { useFriends } from "@/hooks/useFriends";
import { LobbyHeader } from "./_components/LobbyHeader";
import { LobbySubheader } from "./_components/LobbySubheader";
import { LobbyCenterSlots } from "./_components/LobbyCenterSlots";
import { LobbyFriendsSidebar } from "./_components/LobbyFriendsSidebar";
import { LobbyFooter } from "./_components/LobbyFooter";
import { LobbyChat } from "./_components/LobbyChat";
import { LobbySettings } from "./_components/LobbySettings";
import { HowToPlayModal } from "./_components/HowToPlayModal";

export default function LobbyPage() {
  const router = useRouter();
  const { room, clearRoom } = useRoomStore();
  const { user } = useAuthStore();

  // Username from authStore / localStorage
  const [savedUsername, setSavedUsername] = useState<string>("AGENT");
  const [isClient, setIsClient] = useState(false);

  // Form & Room state
  const [roomInput, setRoomInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreatingOrJoining, setIsCreatingOrJoining] = useState(false);
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

  // Settings state synced with room
  const [timer, setTimerState] = useState(room?.settings?.timePerRound ?? 60);
  const [maxNos, setMaxNosState] = useState(room?.settings?.maxNos ?? 5);
  const [maxGuesses, setMaxGuessesState] = useState(
    room?.settings?.maxGuesses ?? 1,
  );
  const [questionCount, setQuestionCountState] = useState(
    room?.settings?.questionCount ?? 15,
  );
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Friends state & actions managed by dedicated custom hook
  const {
    friendInput,
    setFriendInput,
    friendsList,
    friendRequests,
    friendAddedToast,
    isAddingFriend,
    handleAddFriend,
    handleAcceptRequest,
    handleDeclineRequest,
    handleCancelRequest,
    handleRemoveFriend,
    handleInviteFriend,
  } = useFriends(user);

  useEffect(() => {
    setIsClient(true);
    const local = localStorage.getItem("username");
    if (user?.name) {
      setSavedUsername(user.name);
    } else if (local) {
      setSavedUsername(local);
    }
  }, [user]);

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

  const you = room?.me;
  const opponent = room?.opponent;
  const isHost = room ? you?.player.id === room.hostId : true;

  const setTimer = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(timer) : val;
    setTimerState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, {
        timePerRound: nextVal,
        maxNos,
        maxGuesses,
        questionCount,
      });
    }
  };

  const setMaxNos = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxNos) : val;
    setMaxNosState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, {
        timePerRound: timer,
        maxNos: nextVal,
        maxGuesses,
        questionCount,
      });
    }
  };

  const setMaxGuesses = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxGuesses) : val;
    setMaxGuessesState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, {
        timePerRound: timer,
        maxNos,
        maxGuesses: nextVal,
        questionCount,
      });
    }
  };

  const setQuestionCount = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(questionCount) : val;
    setQuestionCountState(nextVal);
    if (room && isHost) {
      updateRoom(room.id, {
        timePerRound: timer,
        maxNos,
        maxGuesses,
        questionCount: nextVal,
      });
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
    setErrorMsg("");
    setIsCreatingOrJoining(true);

    let pId =
      localStorage.getItem("playerId") || sessionStorage.getItem("playerId");
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
    setErrorMsg("");
    setIsCreatingOrJoining(true);

    let pId =
      localStorage.getItem("playerId") || sessionStorage.getItem("playerId");
    if (!pId) {
      pId = crypto.randomUUID();
      localStorage.setItem("playerId", pId);
      sessionStorage.setItem("playerId", pId);
    }
    joinRoom(roomInput.trim().toUpperCase(), {
      id: pId,
      username: savedUsername,
    });
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
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/80 via-transparent to-[#040609]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#040609_90%)]" />
      </div>

      {/* 1. TOP HEADER NAVIGATION BAR */}
      <LobbyHeader
        savedUsername={user?.name || "AGENT"}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* 2. SUB-HEADER BAR (Mode Selector + Party Controls) */}
      <LobbySubheader
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        showModeDropdown={showModeDropdown}
        setShowModeDropdown={setShowModeDropdown}
        onOpenSettings={() => setShowSettingsModal(true)}
        room={room}
        copied={copied}
        handleCopyCode={handleCopyCode}
        handleCreateParty={handleCreateParty}
        handleJoinParty={handleJoinParty}
        roomInput={roomInput}
        setRoomInput={setRoomInput}
        isCreatingOrJoining={isCreatingOrJoining}
      />

      {errorMsg && (
        <div className="relative z-10 w-full max-w-md mx-auto mt-2 px-4">
          <div className="bg-accent/15 border border-accent/40 text-accent text-xs font-display font-bold uppercase tracking-wider p-2.5 rounded text-center">
            {errorMsg}
          </div>
        </div>
      )}

      {/* 3. CENTER CONTENT: 4 PLAYER CARDS & COLLAPSIBLE SIDEBAR */}
      <div className="relative z-10 flex-1 flex items-center justify-between gap-6 px-8 py-2 min-h-0">
        <LobbyCenterSlots
          room={room}
          you={you}
          opponent={opponent}
          isHost={isHost}
          savedUsername={savedUsername}
          isCreatingOrJoining={isCreatingOrJoining}
          handleCreateParty={handleCreateParty}
          handleKickGuest={handleKickGuest}
          handleCopyCode={handleCopyCode}
        />

        <LobbyFriendsSidebar
          isFriendsCollapsed={isFriendsCollapsed}
          setIsFriendsCollapsed={setIsFriendsCollapsed}
          isAnonymous={Boolean(
            user?.isAnonymous ??
            (typeof window !== "undefined" &&
              localStorage.getItem("username")?.startsWith("Guest")),
          )}
          friendsList={friendsList}
          friendRequests={friendRequests}
          friendInput={friendInput}
          setFriendInput={setFriendInput}
          handleAddFriend={handleAddFriend}
          handleAcceptRequest={handleAcceptRequest}
          handleDeclineRequest={handleDeclineRequest}
          handleCancelRequest={handleCancelRequest}
          handleRemoveFriend={handleRemoveFriend}
          handleInviteFriend={handleInviteFriend}
          friendAddedToast={friendAddedToast}
          isAddingFriend={isAddingFriend}
        />
      </div>

      {/* 4. BOTTOM CONTROL ACTION BAR */}
      <LobbyFooter
        showChatDrawer={showChatDrawer}
        setShowChatDrawer={setShowChatDrawer}
        room={room}
        isHost={isHost}
        opponent={opponent}
        handleStartGame={handleStartGame}
        handleLeaveParty={handleLeaveParty}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* SLIDING CHAT DRAWER */}
      <AnimatePresence>
        {showChatDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 left-8 z-50 w-96 h-100 shadow-2xl"
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
          <div className="relative w-full h-135">
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
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}
