import { useState, useEffect, useMemo, useCallback } from "react";
import { Party } from "@/types/party";
import { Friend } from "../_components/types";
import { usePartyStore } from "@/store/partyStore";
import { useGameStore } from "@/store/gameStore";
import { useInviteStore } from "@/store/inviteStore";
import {
  createParty,
  leaveParty,
  kickPlayerFromParty,
  sendInviteToParty,
  acceptInviteToParty,
  declineInviteToParty,
} from "@/socket/emitter";

interface UseLobbyPartyProps {
  party: Party | null;
  friendsList: Friend[];
}

export function useLobbyParty({ party, friendsList }: UseLobbyPartyProps) {
  const { clearParty } = usePartyStore();
  const { clearGame } = useGameStore();
  const { incomingInvites, lastDeclinedInvite, removeIncomingInvite } = useInviteStore();

  const [partyInput, setPartyInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreatingOrJoining, setIsCreatingOrJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [inviteToast, setInviteToast] = useState("");

  // When party syncs, clear joining loader
  useEffect(() => {
    if (party) {
      setIsCreatingOrJoining(false);
    }
  }, [party]);

  // Handle declined party invites from friends
  useEffect(() => {
    if (!lastDeclinedInvite) return;
    const { otherPlayerId } = lastDeclinedInvite;
    const friend = friendsList.find((f) => f.id === otherPlayerId);
    const friendName = friend?.name || "Friend";
    setInviteToast(`${friendName} declined the party invite.`);
    const timer = setTimeout(() => setInviteToast(""), 4000);
    return () => clearTimeout(timer);
  }, [lastDeclinedInvite, friendsList]);

  // Enrich incoming invites with known friend info
  const enrichedIncomingInvites = useMemo(() => {
    return incomingInvites.map((inv) => {
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
  }, [incomingInvites, friendsList]);

  // Actions
  const handleCreateParty = useCallback(() => {
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    createParty();
  }, []);

  const handleJoinParty = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!partyInput.trim()) return;
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    acceptInviteToParty(partyInput.trim());
  }, [partyInput]);

  const handleJoinPartyWithCode = useCallback((code: string) => {
    if (!code.trim()) return;
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    acceptInviteToParty(code.trim());
  }, []);

  const handleKickGuest = useCallback((opponentId?: string) => {
    if (opponentId) {
      kickPlayerFromParty(opponentId);
    }
  }, []);

  const handleLeaveParty = useCallback(() => {
    leaveParty();
    clearParty();
    clearGame();
    setIsCreatingOrJoining(false);
  }, [clearParty, clearGame]);

  const handleCopyCode = useCallback(() => {
    if (!party?.id) return;
    navigator.clipboard.writeText(party.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [party?.id]);

  const onInviteFriendToParty = useCallback((friend: Friend) => {
    sendInviteToParty(friend.id);
    setInviteToast(`Party invite sent to ${friend.name}!`);
    setTimeout(() => setInviteToast(""), 3000);
  }, []);

  const handleAcceptPartyInvite = useCallback((inviteId: string, incomingPartyId: string) => {
    setErrorMsg("");
    setIsCreatingOrJoining(true);
    acceptInviteToParty(incomingPartyId);
    removeIncomingInvite(inviteId, incomingPartyId);
  }, [removeIncomingInvite]);

  const handleDeclinePartyInvite = useCallback((inviteId: string) => {
    const invite = incomingInvites.find((i) => i.id === inviteId);
    const targetPartyId = invite?.partyId || invite?.roomId;
    if (targetPartyId && invite?.sender?.id) {
      declineInviteToParty(targetPartyId, invite.sender.id);
    }
    removeIncomingInvite(inviteId);
  }, [incomingInvites, removeIncomingInvite]);

  return {
    partyInput,
    setPartyInput,
    copied,
    isCreatingOrJoining,
    errorMsg,
    setErrorMsg,
    inviteToast,
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
  };
}
