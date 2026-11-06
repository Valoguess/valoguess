"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TopNavbar } from "@/components/navigation/TopNavbar";
import { HomeFriendsSidebar } from "./HomeFriendsSidebar";
import { HowToPlayModal } from "./HowToPlayModal";
import { LogoutConfirmationModal } from "./LogoutConfirmationModal";
import { useAuthStore } from "@/store/authStore";
import { usePartyStore } from "@/store/partyStore";
import { useFriends } from "@/hooks/useFriends";
import { useLobbyParty } from "../_hooks/useLobbyParty";
import { useGameLifecycle } from "../_hooks/useGameLifecycle";
import { signOut } from "@/lib/auth-client";
import { socket } from "@/socket";
import { toast } from "sonner";
import { HomeContext, HomeContextValue } from "./HomeContext";

export function HomeShell({ children }: { children: React.ReactNode }) {
  const { user, clearUser } = useAuthStore();
  const { party } = usePartyStore();

  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(true);

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const friends = useFriends(user);

  const lobbyParty = useLobbyParty({
    party,
    friendsList: friends.friendsList,
  });

  const gameLifecycle = useGameLifecycle({
    party,
    userId: user?.id,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.loading("Signing out...", { id: "logout-toast" });
    try {
      socket.disconnect();
      await signOut();
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      clearUser();
      toast.dismiss("logout-toast");
      window.location.href = "/login";
    }
  };

  const isAnonymous = Boolean(
    user?.isAnonymous || user?.name?.startsWith("Guest")
  );

  const contextValue: HomeContextValue = {
    friendsList: friends.friendsList,
    friendRequests: friends.friendRequests,
    friendInput: friends.friendInput,
    setFriendInput: friends.setFriendInput,
    handleAddFriend: friends.handleAddFriend,
    handleAcceptRequest: friends.handleAcceptRequest,
    handleDeclineRequest: friends.handleDeclineRequest,
    handleCancelRequest: friends.handleCancelRequest,
    handleRemoveFriend: friends.handleRemoveFriend,
    isAddingFriend: friends.isAddingFriend,

    party,
    partyInput: lobbyParty.partyInput,
    setPartyInput: lobbyParty.setPartyInput,
    copied: lobbyParty.copied,
    showPartyCode: lobbyParty.showPartyCode,
    setShowPartyCode: lobbyParty.setShowPartyCode,
    handleToggleRevealCode: lobbyParty.handleToggleRevealCode,
    isCreatingOrJoining: lobbyParty.isCreatingOrJoining,
    enrichedIncomingInvites: lobbyParty.enrichedIncomingInvites,
    handleCreateParty: lobbyParty.handleCreateParty,
    handleJoinParty: lobbyParty.handleJoinParty,
    handleJoinPartyWithCode: lobbyParty.handleJoinPartyWithCode,
    handleKickGuest: lobbyParty.handleKickGuest,
    handleLeaveParty: lobbyParty.handleLeaveParty,
    handleCopyCode: lobbyParty.handleCopyCode,
    onInviteFriendToParty: lobbyParty.onInviteFriendToParty,
    handleAcceptPartyInvite: lobbyParty.handleAcceptPartyInvite,
    handleDeclinePartyInvite: lobbyParty.handleDeclinePartyInvite,
    handleStartGame: gameLifecycle.handleStartGame,
    isStartingGame: gameLifecycle.isStartingGame,

    isFriendsCollapsed,
    setIsFriendsCollapsed,

    openHowToPlay: () => setShowHowToPlay(true),
    openLogoutModal: () => setShowLogoutModal(true),
  };

  return (
    <HomeContext.Provider value={contextValue}>
      <div className="relative h-dvh max-h-dvh w-full flex flex-col bg-[#040609] text-white select-none overflow-hidden font-body">
        <TopNavbar
          savedUsername={user?.name || "AGENT"}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenLogout={() => setShowLogoutModal(true)}
          onOpenFriends={() => setIsFriendsCollapsed(false)}
          friendRequestsCount={
            friends.friendRequests.filter((r) => r.type === "incoming").length +
            lobbyParty.enrichedIncomingInvites.length
          }
        />

        <div className="relative w-full flex-1 min-h-0 flex overflow-hidden">
          <main className="relative flex-1 min-w-0 h-full overflow-y-auto">
            {children}
          </main>

          {!isFriendsCollapsed && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
              onClick={() => setIsFriendsCollapsed(true)}
            />
          )}

          <div
            className={cn(
              "transition-all duration-300 h-full",
              isFriendsCollapsed
                ? "hidden lg:block lg:relative lg:w-16 lg:shrink-0 lg:z-30"
                : "fixed inset-y-0 right-0 w-80 sm:w-84 max-w-[88vw] z-50 lg:relative lg:w-16 lg:shrink-0 lg:z-30"
            )}
          >
            <div
              className={cn(
                "transition-all duration-300 h-full shrink-0",
                "w-full lg:absolute lg:right-0",
                isFriendsCollapsed ? "lg:w-16" : "lg:w-80 sm:lg:w-84"
              )}
            >
              <HomeFriendsSidebar
                isFriendsCollapsed={isFriendsCollapsed}
                setIsFriendsCollapsed={setIsFriendsCollapsed}
                isAnonymous={isAnonymous}
                friendsList={friends.friendsList}
                friendRequests={friends.friendRequests}
                friendInput={friends.friendInput}
                setFriendInput={friends.setFriendInput}
                handleAddFriend={friends.handleAddFriend}
                handleAcceptRequest={friends.handleAcceptRequest}
                handleDeclineRequest={friends.handleDeclineRequest}
                handleCancelRequest={friends.handleCancelRequest}
                handleRemoveFriend={friends.handleRemoveFriend}
                handleInviteFriend={lobbyParty.onInviteFriendToParty}
                incomingPartyInvites={lobbyParty.enrichedIncomingInvites}
                onAcceptPartyInvite={lobbyParty.handleAcceptPartyInvite}
                onDeclinePartyInvite={lobbyParty.handleDeclinePartyInvite}
                isAddingFriend={friends.isAddingFriend}
              />
            </div>
          </div>
        </div>

        <HowToPlayModal
          isOpen={showHowToPlay}
          onClose={() => setShowHowToPlay(false)}
        />

        <LogoutConfirmationModal
          isOpen={showLogoutModal}
          onOpenChange={setShowLogoutModal}
          isAnonymous={isAnonymous}
          isLoggingOut={isLoggingOut}
          onConfirmLogout={handleLogout}
        />
      </div>
    </HomeContext.Provider>
  );
}
