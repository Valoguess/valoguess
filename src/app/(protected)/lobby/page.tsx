"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { socket } from "@/socket";
import { usePartyStore } from "@/store/partyStore";
import { useGameStore } from "@/store/gameStore";
import {
  createParty,
  leaveParty,
  kickPlayerFromParty,
  sendInviteToParty,
  acceptInviteToParty,
  declineInviteToParty,
  sendMessageToParty,
  createGame,
  startGame,
} from "@/socket/emitter";
import { ServerEvents } from "@/socket/events";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { useInviteStore } from "@/store/inviteStore";
import { Message, Friend } from "./_components/types";
import { useFriends } from "@/hooks/useFriends";
import { LobbyHeader } from "./_components/LobbyHeader";
import { LobbySubheader } from "./_components/LobbySubheader";
import { LobbyCenterSlots } from "./_components/LobbyCenterSlots";
import { LobbyFriendsSidebar } from "./_components/LobbyFriendsSidebar";
import { LobbyFooter } from "./_components/LobbyFooter";
import { LobbyChat } from "./_components/LobbyChat";
import { LobbySettings } from "./_components/LobbySettings";
import { HowToPlayModal } from "./_components/HowToPlayModal";

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  sender: "SYSTEM",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  text: "Party lobby initialized. Create or join a party to start!",
  colorClass: "text-[#8C7BFF]",
  avatar: "/agents/icon/miks.png",
};

export default function LobbyPage() {
  const router = useRouter();
  const { party, clearParty, partyMessages } = usePartyStore();
  const { game } = useGameStore();
  const { user } = useAuthStore();

  const [savedUsername, setSavedUsername] = useState<string>("AGENT");
  const [isClient, setIsClient] = useState(false);

  // Form & Party code state
  const [partyInput, setPartyInput] = useState("");
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

  // Settings state for match creation
  const [timer, setTimerState] = useState(60);
  const [maxNos, setMaxNosState] = useState(5);
  const [maxGuesses, setMaxGuessesState] = useState(1);
  const [questionCount, setQuestionCountState] = useState(15);
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
  } = useFriends(user);

  const [inviteToast, setInviteToast] = useState("");

  // Incoming party invites state from global inviteStore
  const { incomingInvites, lastDeclinedInvite, removeIncomingInvite } =
    useInviteStore();

  // Handle inviting a friend to the current party
  const onInviteFriendToParty = (friend: Friend) => {
    // if (!party?.id) {
    //   setInviteToast("Please create a party first to invite friends!");
    //   setTimeout(() => setInviteToast(""), 3500);
    //   return;
    // }

    sendInviteToParty(party?.id, friend.id);
    setInviteToast(`Party invite sent to ${friend.name}!`);
    setTimeout(() => setInviteToast(""), 3000);
  };

  // Handle declined party invites from friends
  useEffect(() => {
    if (!lastDeclinedInvite) return;
    const { otherPlayerId } = lastDeclinedInvite;
    const friend = friendsList.find((f) => f.id === otherPlayerId);
    const friendName = friend?.name || "Friend";
    setInviteToast(`${friendName} declined the party invite.`);
    setTimeout(() => setInviteToast(""), 4000);
  }, [lastDeclinedInvite, friendsList]);

  // Enrich incoming invites with known friend info
  const enrichedIncomingInvites = incomingInvites.map((inv) => {
    const matched = friendsList.find((f) => f.id === inv.sender.id);
    if (matched) {
      return {
        ...inv,
        sender: {
          ...inv.sender,
          name: matched.name,
          username: matched.username,
          avatar: matched.avatar,
        },
      };
    }
    return inv;
  });

  // Handle accepting an incoming party invite
  const handleAcceptPartyInvite = (inviteId: string, incomingPartyId: string) => {
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    acceptInviteToParty(incomingPartyId);
    removeIncomingInvite(inviteId, incomingPartyId);
  };

  // Handle declining an incoming party invite
  const handleDeclinePartyInvite = (inviteId: string) => {
    const invite = incomingInvites.find((i) => i.id === inviteId);
    const targetPartyId = invite?.partyId || invite?.roomId;
    if (targetPartyId && invite?.sender?.id) {
      declineInviteToParty(targetPartyId, invite.sender.id);
    }
    removeIncomingInvite(inviteId);
  };

  useEffect(() => {
    setIsClient(true);
    if (user?.name) {
      setSavedUsername(user.name);
    }
  }, [user]);

  // When party syncs, clear joining loader
  useEffect(() => {
    if (party) {
      setIsCreatingOrJoining(false);
    }
  }, [party]);

  const myId = user?.id;
  const isHost = party ? party.leaderId === myId : true;
  const me = party?.members.find((m) => m.id === myId) || (user ? { id: user.id, name: user.name || "AGENT" } : null);
  const opponent = party?.members.find((m) => m.id !== myId);

  // Game lifecycle handling:
  // 1. If leader created game (game.status === "WAITING"), leader triggers startGame(game.id)
  // 2. When game.status === "PLAYING", navigate to /play?code=${game.id}
  useEffect(() => {
    if (!game) return;

    if (isHost && game.status === "WAITING") {
      startGame(game.id);
      return;
    }

    if (game.status === "PLAYING") {
      router.push(`/play?code=${game.id}`);
    }
  }, [game, isHost, router]);

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

  const setTimer = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(timer) : val;
    setTimerState(nextVal);
  };

  const setMaxNos = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxNos) : val;
    setMaxNosState(nextVal);
  };

  const setMaxGuesses = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(maxGuesses) : val;
    setMaxGuessesState(nextVal);
  };

  const setQuestionCount = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === "function" ? val(questionCount) : val;
    setQuestionCountState(nextVal);
  };

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const displayMessages =
    partyMessages.length > 0 ? partyMessages : [DEFAULT_WELCOME_MESSAGE];

  // Execute Create Party
  const handleCreateParty = () => {
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    createParty();
  };

  // Execute Join Party / Accept Invite
  const handleJoinParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyInput.trim()) return;
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    acceptInviteToParty(partyInput.trim());
  };

  // Execute Start Game (Party Leader only, 2 players required)
  const handleStartGame = () => {
    if (!party?.id || !isHost || !opponent) return;

    // If game already exists in WAITING state, call startGame
    if (game?.id && game.status === "WAITING") {
      startGame(game.id);
      return;
    }

    createGame(party.id, {
      questionMode: "PRESET",
      timePerRound: timer,
      maxNos,
      maxGuesses,
      questionCount,
    });
  };

  const handleKickGuest = () => {
    if (party?.id && opponent?.id && isHost) {
      kickPlayerFromParty(party.id, opponent.id);
    }
  };

  const handleLeaveParty = () => {
    leaveParty();
    clearParty();
    setIsCreatingOrJoining(false);
  };

  const handleCopyCode = () => {
    if (!party?.id) return;
    navigator.clipboard.writeText(party.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessageToParty(chatInput.trim());
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
        party={party}
        copied={copied}
        handleCopyCode={handleCopyCode}
        handleCreateParty={handleCreateParty}
        handleJoinParty={handleJoinParty}
        partyInput={partyInput}
        setPartyInput={setPartyInput}
        isCreatingOrJoining={isCreatingOrJoining}
      />

      {errorMsg && (
        <div className="relative z-10 w-full max-w-md mx-auto mt-2 px-4">
          <div className="bg-accent/15 border border-accent/40 text-accent text-xs font-display font-bold uppercase tracking-wider p-2.5 rounded text-center">
            {errorMsg}
          </div>
        </div>
      )}

      {inviteToast && (
        <div className="relative z-20 w-full max-w-md mx-auto mt-2 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-[#090d14]/90 border border-mint/40 text-mint text-xs font-display font-bold uppercase tracking-wider p-2 rounded text-center shadow-[0_0_15px_rgba(60,242,196,0.2)] flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-ping" />
            {inviteToast}
          </div>
        </div>
      )}

      {/* 3. CENTER CONTENT: 4 PLAYER CARDS & COLLAPSIBLE SIDEBAR */}
      <div className="relative z-10 flex-1 flex items-center justify-between gap-6 px-8 py-2 min-h-0">
        <LobbyCenterSlots
          party={party}
          me={me}
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
          isAnonymous={Boolean(user?.isAnonymous || user?.name?.startsWith("Guest"))}
          friendsList={friendsList}
          friendRequests={friendRequests}
          friendInput={friendInput}
          setFriendInput={setFriendInput}
          handleAddFriend={handleAddFriend}
          handleAcceptRequest={handleAcceptRequest}
          handleDeclineRequest={handleDeclineRequest}
          handleCancelRequest={handleCancelRequest}
          handleRemoveFriend={handleRemoveFriend}
          handleInviteFriend={onInviteFriendToParty}
          incomingPartyInvites={enrichedIncomingInvites}
          onAcceptPartyInvite={handleAcceptPartyInvite}
          onDeclinePartyInvite={handleDeclinePartyInvite}
          friendAddedToast={friendAddedToast || inviteToast}
          isAddingFriend={isAddingFriend}
        />
      </div>

      {/* 4. BOTTOM CONTROL ACTION BAR */}
      <LobbyFooter
        showChatDrawer={showChatDrawer}
        setShowChatDrawer={setShowChatDrawer}
        party={party}
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
              messages={displayMessages}
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
