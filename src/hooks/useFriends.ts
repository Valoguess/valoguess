"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { StoreUser } from "@/store/authStore";
import { Friend, FriendRequest } from "@/types/friends";
import { usePresenceStore } from "@/store/presenceStore";
import {
  getFriendships,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "@/actions/friends";

export function useFriends(user: StoreUser | null) {
  const [friendInput, setFriendInput] = useState("");
  const [rawFriends, setRawFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendAddedToast, setFriendAddedToast] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const presence = usePresenceStore((state) => state.presence);

  const friendsList = useMemo<Friend[]>(() => {
    return rawFriends.map((f) => {
      const isOnline = Boolean(presence[f.id]);
      return {
        ...f,
        status: isOnline ? ("online" as const) : ("offline" as const),
        activity: isOnline ? "In Lobby" : "Offline",
      };
    });
  }, [rawFriends, presence]);

  const fetchFriends = useCallback(async () => {
    if (!user || user.isAnonymous) {
      setRawFriends([]);
      setFriendRequests([]);
      return;
    }

    try {
      const friendships = await getFriendships(user.id);
      if (!Array.isArray(friendships)) return;

      const friends: Friend[] = [];
      const receivedRequests: FriendRequest[] = [];
      const sentRequests: FriendRequest[] = [];

      for (const friendship of friendships) {
        if (friendship.status === "ACCEPTED") {
          const friendUser =
            friendship.requesterId === user.id
              ? friendship.receiver
              : friendship.requester;

          if (friendUser) {
            friends.push({
              id: friendUser.id,
              name: friendUser.name || "Player",
              username: friendUser.username
                ? `@${friendUser.username}`
                : undefined,
              avatar: friendUser.image || "/agents/icon/omen.png",
              status: "online",
              activity: "In Lobby",
            });
          }
          continue;
        }

        if (
          friendship.status === "PENDING" &&
          friendship.receiverId === user.id
        ) {
          if (friendship.requester) {
            receivedRequests.push({
              id: friendship.requester.id,
              name: friendship.requester.name || "Player",
              username: friendship.requester.username
                ? `@${friendship.requester.username}`
                : undefined,
              avatar: friendship.requester.image || "/agents/icon/reyna.png",
              type: "incoming",
              createdAt: friendship.createdAt
                ? new Date(friendship.createdAt).toISOString()
                : undefined,
            });
          }
          continue;
        }

        if (
          friendship.status === "PENDING" &&
          friendship.requesterId === user.id
        ) {
          if (friendship.receiver) {
            sentRequests.push({
              id: friendship.receiver.id,
              name: friendship.receiver.name || "Player",
              username: friendship.receiver.username
                ? `@${friendship.receiver.username}`
                : undefined,
              avatar: friendship.receiver.image || "/agents/icon/phoenix.png",
              type: "outgoing",
              createdAt: friendship.createdAt
                ? new Date(friendship.createdAt).toISOString()
                : undefined,
            });
          }
        }
      }

      setRawFriends(friends);
      setFriendRequests([...receivedRequests, ...sentRequests]);
    } catch (err) {
      console.error("Failed to load friends:", err);
    }
  }, [user]);

  // Initial fetch and visibility-based polling
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setRawFriends([]);
      setFriendRequests([]);
      return;
    }

    fetchFriends();

    const interval = setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "visible"
      ) {
        fetchFriends();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [user, fetchFriends]);

  // Add friend
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim() || isAddingFriend) return;
    const target = friendInput.trim();
    setIsAddingFriend(true);

    try {
      const res = await sendFriendRequest(target);
      if (res.success) {
        setFriendInput("");
        setFriendAddedToast(res.message || "Friend request sent!");
        await fetchFriends();
      } else {
        setFriendAddedToast(res.error || "Failed to send friend request");
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to send friend request");
    } finally {
      setIsAddingFriend(false);
      setTimeout(() => setFriendAddedToast(""), 4000);
    }
  };

  // Accept incoming request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await acceptFriendRequest(requestId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend request accepted!");
        await fetchFriends();
      } else {
        setFriendAddedToast(res.error || "Failed to accept request");
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to accept request");
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Decline incoming request
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const res = await declineFriendRequest(requestId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend request declined");
        await fetchFriends();
      } else {
        setFriendAddedToast(res.error || "Failed to decline request");
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to decline request");
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Cancel outgoing request
  const handleCancelRequest = async (requestId: string) => {
    try {
      const res = await cancelFriendRequest(requestId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend request cancelled");
        await fetchFriends();
      } else {
        setFriendAddedToast(res.error || "Failed to cancel request");
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to cancel request");
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Remove friend
  const handleRemoveFriend = async (friendId: string) => {
    try {
      const res = await removeFriend(friendId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend removed");
        await fetchFriends();
      } else {
        setFriendAddedToast(res.error || "Failed to remove friend");
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to remove friend");
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Invite friend
  const handleInviteFriend = (friend: Friend) => {
    setFriendAddedToast(`Invited ${friend.name} to party!`);
    setTimeout(() => setFriendAddedToast(""), 3000);
  };

  return {
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
    refetchFriends: fetchFriends,
  };
}
