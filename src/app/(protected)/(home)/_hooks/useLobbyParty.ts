import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Party } from "@/types/party";
import { Friend } from "@/types/friends";
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
import { toast } from "sonner";

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
  const [showPartyCode, setShowPartyCode] = useState(false);
  const [isCreatingOrJoining, setIsCreatingOrJoining] = useState(false);

  // Queued actions when party is lazily created
  const pendingCopyRef = useRef(false);
  const pendingRevealRef = useRef(false);
  const pendingInviteRef = useRef<string | null>(null);

  // When party syncs, clear joining loader and execute queued actions
  useEffect(() => {
    if (party?.id) {
      setIsCreatingOrJoining(false);

      if (pendingRevealRef.current) {
        pendingRevealRef.current = false;
        setShowPartyCode(true);
        toast.success(`Party created! Code #${party.id} revealed.`);
      }

      if (pendingCopyRef.current) {
        pendingCopyRef.current = false;
        navigator.clipboard.writeText(party.id);
        setCopied(true);
        toast.success(`Party created! Code #${party.id} copied.`);
        setTimeout(() => setCopied(false), 2000);
      }

      if (pendingInviteRef.current) {
        const friendId = pendingInviteRef.current;
        pendingInviteRef.current = null;
        sendInviteToParty(friendId);
        const friend = friendsList.find((f) => f.id === friendId);
        toast.success(`Party invite sent to ${friend?.name || "friend"}!`);
      }
    }
  }, [party?.id, friendsList]);

  // Handle declined party invites from friends
  useEffect(() => {
    if (!lastDeclinedInvite) return;
    const { otherPlayerId } = lastDeclinedInvite;
    const friend = friendsList.find((f) => f.id === otherPlayerId);
    const friendName = friend?.name || "Friend";
    toast.warning(`${friendName} declined the party invite.`);
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
    setIsCreatingOrJoining(true);
    createParty();
  }, []);

  const handleJoinParty = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!partyInput.trim()) return;
    setIsCreatingOrJoining(true);
    acceptInviteToParty(partyInput.trim());
  }, [partyInput]);

  const handleJoinPartyWithCode = useCallback((code: string) => {
    if (!code.trim()) return;
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
    setShowPartyCode(false);
    pendingCopyRef.current = false;
    pendingRevealRef.current = false;
    pendingInviteRef.current = null;
  }, [clearParty, clearGame]);

  const handleToggleRevealCode = useCallback(() => {
    if (showPartyCode) {
      setShowPartyCode(false);
      return;
    }
    if (!party?.id) {
      pendingRevealRef.current = true;
      setIsCreatingOrJoining(true);
      createParty();
      return;
    }
    setShowPartyCode(true);
  }, [showPartyCode, party?.id]);

  const handleCopyCode = useCallback(() => {
    if (!party?.id) {
      pendingCopyRef.current = true;
      setIsCreatingOrJoining(true);
      createParty();
      return;
    }
    navigator.clipboard.writeText(party.id);
    setCopied(true);
    toast.success("Party code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [party?.id]);

  const onInviteFriendToParty = useCallback((friend: Friend) => {
    if (!party?.id) {
      pendingInviteRef.current = friend.id;
      setIsCreatingOrJoining(true);
      createParty();
      return;
    }
    sendInviteToParty(friend.id);
    toast.success(`Party invite sent to ${friend.name}!`);
  }, [party?.id]);

  const handleAcceptPartyInvite = useCallback((inviteId: string, incomingPartyId: string) => {
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
    showPartyCode,
    setShowPartyCode,
    handleToggleRevealCode,
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
  };
}
