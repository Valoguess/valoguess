"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LobbySubheader } from "./LobbySubheader";
import { LobbyLeftPanel } from "./LobbyLeftPanel";
import { LobbyCenterSlots } from "./LobbyCenterSlots";
import { PartyChatOverlay } from "@/components/chat/PartyChatOverlay";
import { LobbySettings } from "./LobbySettings";
import { InviteFriendsDialog } from "./InviteFriendsDialog";
import { useLobbyGameLifecycle } from "../_hooks/useLobbyGameLifecycle";
import { useHomeContext } from "../../_components/HomeContext";

export function LobbyClient() {
  const { user } = useAuthStore();

  const [savedUsername, setSavedUsername] = useState<string>("AGENT");

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

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

  // Shared Home Context (Party, Friends, Invites)
  const {
    party,
    friendsList,
    showPartyCode,
    handleToggleRevealCode,
    isCreatingOrJoining,
    handleCreateParty,
    handleJoinPartyWithCode,
    handleKickGuest,
    handleLeaveParty,
    handleCopyCode,
    copied,
    onInviteFriendToParty,
  } = useHomeContext();

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
    if (user?.name) {
      setSavedUsername(user.name);
    }
  }, [user]);

  return (
    <div className="relative h-full w-full flex flex-col justify-between select-none overflow-hidden font-body">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#040609]/80 via-transparent to-[#040609]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#040609_90%)]" />
      </div>

      {/* 1. Sub-Header Bar */}
      <LobbySubheader party={party} />

      {/* 2. Main Workspace: Left Control Panel & Center Player Slots */}
      <div className="relative z-10 flex-1 flex items-stretch justify-between gap-5 pl-6 lg:pl-8 pr-4 py-2 overflow-hidden min-h-0">
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
            userName={user?.name || savedUsername || "AGENT"}
            showPartyCode={showPartyCode}
            onToggleRevealCode={handleToggleRevealCode}
            handleCopyCode={handleCopyCode}
            copied={copied}
            onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
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
            onOpenInviteDialog={() => setIsInviteDialogOpen(true)}
          />
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

      {/* Online Friends Invite Dialog */}
      <InviteFriendsDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        friendsList={friendsList}
        onInviteFriend={onInviteFriendToParty}
      />
    </div>
  );
}
