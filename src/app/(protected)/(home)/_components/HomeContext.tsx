"use client";

import React, { createContext, useContext } from "react";
import { Friend, FriendRequest } from "@/types/friends";
import { Party, IncomingPartyInvite } from "@/types/party";

export interface HomeContextValue {
  // Friends state & actions
  friendsList: Friend[];
  friendRequests: FriendRequest[];
  friendInput: string;
  setFriendInput: (val: string) => void;
  handleAddFriend: (e: React.FormEvent) => void;
  handleAcceptRequest: (requestId: string) => void;
  handleDeclineRequest: (requestId: string) => void;
  handleCancelRequest: (requestId: string) => void;
  handleRemoveFriend: (friendId: string) => void | Promise<void>;
  isAddingFriend: boolean;

  // Party state & actions
  party: Party | null;
  partyInput: string;
  setPartyInput: (val: string) => void;
  copied: boolean;
  showPartyCode: boolean;
  setShowPartyCode: (show: boolean) => void;
  handleToggleRevealCode: () => void;
  isCreatingOrJoining: boolean;
  enrichedIncomingInvites: IncomingPartyInvite[];
  handleCreateParty: () => void;
  handleJoinParty: (e: React.FormEvent) => void;
  handleJoinPartyWithCode: (code: string) => void;
  handleKickGuest: (guestId?: string) => void;
  handleLeaveParty: () => void;
  handleCopyCode: () => void;
  onInviteFriendToParty: (friend: Friend) => void;
  handleAcceptPartyInvite: (inviteId: string, partyId: string) => void;
  handleDeclinePartyInvite: (inviteId: string) => void;

  // Friends Sidebar collapsible state
  isFriendsCollapsed: boolean;
  setIsFriendsCollapsed: (collapsed: boolean) => void;

  // Modals triggers
  openHowToPlay: () => void;
  openLogoutModal: () => void;
}

export const HomeContext = createContext<HomeContextValue | null>(null);

export function useHomeContext(): HomeContextValue {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHomeContext must be used within a HomeShell provider");
  }
  return context;
}
