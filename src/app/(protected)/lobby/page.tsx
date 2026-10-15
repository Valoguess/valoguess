"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePartyStore } from "@/store/partyStore";
import { useAuthStore } from "@/store/authStore";
import { useFriends } from "@/hooks/useFriends";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LobbyHeader } from "./_components/LobbyHeader";
import { LobbySubheader } from "./_components/LobbySubheader";
import { LobbyLeftPanel } from "./_components/LobbyLeftPanel";
import { LobbyCenterSlots } from "./_components/LobbyCenterSlots";
import { LobbyFriendsSidebar } from "./_components/LobbyFriendsSidebar";
import { PartyChatOverlay } from "@/components/chat/PartyChatOverlay";
import { LobbySettings } from "./_components/LobbySettings";
import { HowToPlayModal } from "./_components/HowToPlayModal";
import { useLobbyParty } from "./_hooks/useLobbyParty";
import { useLobbyGameLifecycle } from "./_hooks/useLobbyGameLifecycle";

export default function LobbyPage() {
  const { party } = usePartyStore();
  const { user } = useAuthStore();

  const [savedUsername, setSavedUsername] = useState<string>("AGENT");
  const [isClient, setIsClient] = useState(false);

  // Friends Menu Collapsible State (closed by default)
  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(true);

  // Modals & Drawers state
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Match Settings State (persisted in localStorage via Zustand)
  const {
    questionMode,
    setQuestionMode,
    timer,
    setTimer,
    maxNos,
    setMaxNos,
    maxGuesses,
    setMaxGuesses,
    questionCount,
    setQuestionCount,
    showMoreOptions,
    setShowMoreOptions,
  } = useGameSettingsStore();

  // Friends state & actions managed by dedicated custom hook
  const {
    friendInput,
    setFriendInput,
    friendsList,
    friendRequests,
    isAddingFriend,
    handleAddFriend,
    handleAcceptRequest,
    handleDeclineRequest,
    handleCancelRequest,
    handleRemoveFriend,
  } = useFriends(user);

  // Party state & invitation actions
  const {
    partyInput,
    setPartyInput,
    copied,
    isCreatingOrJoining,
    enrichedIncomingInvites,
    handleCreateParty,
    handleJoinParty,
    handleJoinPartyWithCode,
    handleKickGuest,
    handleLeaveParty,
    handleCopyCode,
    onInviteFriendToParty,
    handleAcceptPartyInvite,
    handleDeclinePartyInvite,
  } = useLobbyParty({ party, friendsList });

  const myId = user?.id;
  const isHost = party ? party.leaderId === myId : true;
  const me =
    party?.members.find((m) => m.id === myId) ||
    (user ? { id: user.id, name: user.name || "AGENT" } : null);
  const opponent = party?.members.find((m) => m.id !== myId);

  // Game lifecycle & match creation hook
  const { handleStartGame } = useLobbyGameLifecycle({
    party,
    isHost,
    opponentId: opponent?.id,
    questionMode,
    timer,
    maxNos,
    maxGuesses,
    questionCount,
    onSetIsCreatingOrJoining: () => {},
  });

  useEffect(() => {
    setIsClient(true);
    if (user?.name) {
      setSavedUsername(user.name);
    }
  }, [user]);

  if (!isClient) return null;

  return (
    <main className="relative h-screen max-h-screen w-screen flex flex-col justify-between bg-[#040609] text-white select-none overflow-hidden font-body">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover opacity-35 object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/80 via-transparent to-[#040609]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#040609_90%)]" />
      </div>

      {/* 1. Top Header Navigation Bar */}
      <LobbyHeader
        savedUsername={user?.name || "AGENT"}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <div className="relative w-full flex-1 min-h-0 flex justify-between">
        <div className="relative flex-1 min-w-0 flex flex-col min-h-0">
          {/* 2. Sub-Header Bar */}
          <LobbySubheader
            party={party}
            copied={copied}
            handleCopyCode={handleCopyCode}
            handleCreateParty={handleCreateParty}
            handleJoinParty={handleJoinParty}
            partyInput={partyInput}
            setPartyInput={setPartyInput}
            isCreatingOrJoining={isCreatingOrJoining}
          />


          {/* 3. Main Workspace: Left Control Panel & Center Player Slots */}
          <div className="relative z-10 flex-1 flex items-stretch justify-between gap-5 pl-6 lg:pl-8 py-2 overflow-hidden">
            {/* Left Column: Gamemode Selector & Party Controls */}
            <aside className="w-70 flex flex-col justify-center shrink-0 select-none z-20 h-full min-h-0 gap-2.5 pb-1">
              <LobbyLeftPanel
                questionMode={questionMode}
                setQuestionMode={setQuestionMode}
                isHost={isHost}
                party={party}
                opponent={opponent}
                onStartGame={handleStartGame}
                onOpenSettings={() => setShowSettingsModal(true)}
                onLeaveParty={handleLeaveParty}
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
                isCreatingOrJoining={isCreatingOrJoining}
                handleCreateParty={handleCreateParty}
                handleJoinPartyWithCode={handleJoinPartyWithCode}
                handleKickGuest={() => handleKickGuest(opponent?.id)}
                myId={myId}
              />
            </aside>

            {/* Center Column: Player Podium Slots */}
            <div className="flex-1 flex items-center justify-center min-w-0 h-full">
              <LobbyCenterSlots
                party={party}
                me={me}
                opponent={opponent}
                isHost={isHost}
                savedUsername={savedUsername}
                isCreatingOrJoining={isCreatingOrJoining}
                handleCreateParty={handleCreateParty}
                handleKickGuest={() => handleKickGuest(opponent?.id)}
                handleCopyCode={handleCopyCode}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Friends Drawer */}
        <div className="relative h-full w-16">
          <div
            className={cn(
              "transition-all duration-300 h-full shrink-0 z-30 absolute right-0",
              isFriendsCollapsed ? "w-16" : "w-80 lg:w-84",
            )}
          >
            <LobbyFriendsSidebar
              isFriendsCollapsed={isFriendsCollapsed}
              setIsFriendsCollapsed={setIsFriendsCollapsed}
              isAnonymous={Boolean(
                user?.isAnonymous || user?.name?.startsWith("Guest"),
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
              handleInviteFriend={onInviteFriendToParty}
              incomingPartyInvites={enrichedIncomingInvites}
              onAcceptPartyInvite={handleAcceptPartyInvite}
              onDeclinePartyInvite={handleDeclinePartyInvite}
              isAddingFriend={isAddingFriend}
            />
          </div>
        </div>
      </div>

      {/* Floating Party Chat */}
      <PartyChatOverlay className="bottom-6 left-6" />

      {/* Custom Game Settings Modal */}
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
              questionMode={questionMode}
              setQuestionMode={setQuestionMode}
              showMoreOptions={showMoreOptions}
              setShowMoreOptions={setShowMoreOptions}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </main>
  );
}
