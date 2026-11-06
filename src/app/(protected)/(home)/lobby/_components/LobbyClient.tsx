"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { LobbySubheader } from "./LobbySubheader";
import { LobbyLeftPanel } from "./LobbyLeftPanel";
import { LobbyCenterSlots } from "./LobbyCenterSlots";
import { PartyChatOverlay } from "@/components/chat/PartyChatOverlay";
import { InviteFriendsDialog } from "./InviteFriendsDialog";
import { useHomeContext } from "../../_components/HomeContext";

export function LobbyClient() {
  const { user } = useAuthStore();
  const [savedUsername, setSavedUsername] = useState<string>("AGENT");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

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

  const {
    party,
    friendsList,
    showPartyCode,
    handleToggleRevealCode,
    isCreatingOrJoining,
    isStartingGame,
    handleCreateParty,
    handleJoinPartyWithCode,
    handleKickGuest,
    handleLeaveParty,
    handleCopyCode,
    copied,
    onInviteFriendToParty,
    handleStartGame,
  } = useHomeContext();

  const myId = user?.id;
  const isHost = party ? party.leaderId === myId : true;
  const me =
    party?.members.find((m) => m.id === myId) ||
    (user ? { id: user.id, name: user.name || "AGENT" } : null);
  const opponent = party?.members.find((m) => m.id !== myId);

  useEffect(() => {
    if (user?.name) {
      setSavedUsername(user.name);
    }
  }, [user]);

  return (
    <div className="relative h-full w-full flex flex-col justify-between select-none overflow-y-auto lg:overflow-hidden font-body">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/bg/bg2.webp"
          alt="Valorant Background"
          fill
          priority
          quality={100}
          className="object-cover object-center scale-[1.01]"
        />
        <div className="absolute inset-0 bg-[#040609]/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#040609]/40 to-[#040609]/90" />
      </div>

      <LobbySubheader party={party} />

      <div className="relative z-10 flex-1 flex flex-col-reverse lg:flex-row items-center lg:items-stretch justify-between gap-4 lg:gap-6 px-3 sm:px-6 lg:pl-8 lg:pr-6 py-3 min-h-0 w-full">
        <aside className="w-full max-w-sm lg:w-72 flex flex-col justify-center shrink-0 z-20 lg:h-full lg:min-h-0 pb-2 lg:pb-0">
          <LobbyLeftPanel
            questionMode={questionMode}
            setQuestionMode={setQuestionMode}
            isHost={isHost}
            party={party}
            opponent={opponent}
            onStartGame={handleStartGame}
            isStartingGame={isStartingGame}
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

        <div className="w-full flex-1 flex items-center justify-center min-w-0 py-2 lg:py-0">
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
            onCopyCode={handleCopyCode}
            copied={copied}
          />
        </div>
      </div>

      <PartyChatOverlay className="bottom-6 left-6" />

      <InviteFriendsDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        friendsList={friendsList}
        onInviteFriend={onInviteFriendToParty}
      />
    </div>
  );
}
