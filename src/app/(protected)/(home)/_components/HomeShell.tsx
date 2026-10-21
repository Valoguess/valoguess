"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { HomeContext, HomeContextValue } from "./HomeContext";

export function HomeShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const { party } = usePartyStore();

  // Friends collapsible sidebar state (collapsed by default)
  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(true);

  // Modals state
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Friends state and socket actions
  const friends = useFriends(user);

  // Party state and invitation actions
  const lobbyParty = useLobbyParty({
    party,
    friendsList: friends.friendsList,
  });

  // Game lifecycle handling for all (home) pages: auto-redirects to /play when match starts
  const gameLifecycle = useGameLifecycle({
    party,
    userId: user?.id,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      clearUser();
      router.replace("/login");
    } catch {
      clearUser();
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const isAnonymous = Boolean(
    user?.isAnonymous || user?.name?.startsWith("Guest")
  );

  const contextValue: HomeContextValue = {
    // Friends
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

    // Party & Invites
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

    // Friends sidebar
    isFriendsCollapsed,
    setIsFriendsCollapsed,

    // Modals
    openHowToPlay: () => setShowHowToPlay(true),
    openLogoutModal: () => setShowLogoutModal(true),
  };

  return (
    <HomeContext.Provider value={contextValue}>
      <div className="relative h-dvh max-h-dvh w-full flex flex-col bg-[#040609] text-white select-none overflow-hidden font-body">
        {/* Centralized Top Navbar */}
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

        {/* Central Workspace Row */}
        <div className="relative w-full flex-1 min-h-0 flex overflow-hidden">
          {/* Main Page Content */}
          <main className="relative flex-1 min-w-0 h-full overflow-y-auto">
            {children}
          </main>

          {/* Mobile Backdrop Overlay for Friends Drawer (< lg) */}
          {!isFriendsCollapsed && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setIsFriendsCollapsed(true)}
            />
          )}

          {/* Collapsible Friends Sidebar: slide-over drawer on < lg, docked column on >= lg */}
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
                isFriendsCollapsed ? "lg:w-16" : "lg:w-80 lg:w-84"
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

        {/* How To Play Modal */}
        <HowToPlayModal
          isOpen={showHowToPlay}
          onClose={() => setShowHowToPlay(false)}
        />

        {/* Global Logout Modal */}
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
