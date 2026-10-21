"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { StoreUser } from "@/store/authStore";
import { Friend, FriendRequest } from "@/types/friends";
import { DEFAULT_AVATARS } from "@/consts";
import { usePresenceStore } from "@/store/presenceStore";
import { useFriendStore } from "@/store/friendStore";
import {
  sendFriendRequestSocket,
  acceptFriendRequestSocket,
  declineFriendRequestSocket,
} from "@/socket/emitter";
import {
  getFriendships,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "@/actions/friends";
import { toast } from "sonner";

export function useFriends(user: StoreUser | null) {
  const [friendInput, setFriendInput] = useState("");
  const [rawFriends, setRawFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const presence = usePresenceStore((state) => state.presence);
  const lastFriendEvent = useFriendStore((state) => state.lastFriendEvent);
  const clearLastFriendEvent = useFriendStore(
    (state) => state.clearLastFriendEvent,
  );
  const initialFriendsData = useFriendStore(
    (state) => state.initialFriendsData,
  );

  // Track processed event timestamp to prevent duplicate processing on navigation / remount
  const lastProcessedTimestampRef = useRef<number>(0);
  // Track requests locally accepted or declined by this user to prevent echo toasts
  const locallyAcceptedIdsRef = useRef<Set<string>>(new Set());
  const locallyDeclinedIdsRef = useRef<Set<string>>(new Set());

  const friendsList = useMemo<Friend[]>(() => {
    const list =
      rawFriends.length > 0
        ? rawFriends
        : user && !user.isAnonymous && initialFriendsData
        ? initialFriendsData.friends
        : [];

    return list.map((f) => {
      const isOnline =
        presence[f.id] !== undefined
          ? Boolean(presence[f.id])
          : f.status === "online";
      return {
        ...f,
        status: isOnline ? ("online" as const) : ("offline" as const),
        activity: isOnline ? "In Lobby" : "Offline",
      };
    });
  }, [rawFriends, user, initialFriendsData, presence]);

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
              avatar: friendUser.image || DEFAULT_AVATARS.USER,
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
              avatar: friendship.requester.image || DEFAULT_AVATARS.OPPONENT,
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
              avatar: friendship.receiver.image || DEFAULT_AVATARS.GUEST,
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
    } catch {
      // Graceful fallback on network/session error
    }
  }, [user]);

  // Handle real-time friend events from socket
  useEffect(() => {
    if (!lastFriendEvent || !lastFriendEvent.timestamp) return;

    // Ignore events that have already been processed to prevent re-firing on navigation/remount
    if (lastFriendEvent.timestamp <= lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = lastFriendEvent.timestamp;

    if (lastFriendEvent.type === "request_received") {
      toast.info("New friend request received!");
      if (lastFriendEvent.requester) {
        const req = lastFriendEvent.requester;
        setFriendRequests((prev) => [
          ...prev.filter((r) => r.id !== req.id),
          {
            id: req.id,
            name: req.name || "Player",
            username: req.username
              ? `@${req.username.replace(/^@/, "")}`
              : undefined,
            avatar: req.avatar || DEFAULT_AVATARS.OPPONENT,
            type: "incoming",
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        // Fallback to fetch if socket server didn't include requester details
        fetchFriends();
      }
    } else if (lastFriendEvent.type === "request_accepted") {
      const targetUserId = lastFriendEvent.userId;
      setFriendRequests((prev) => prev.filter((r) => r.id !== targetUserId));
      fetchFriends();

      // Only display the toast if the other player accepted our request,
      // not when we were the one who clicked accept locally.
      const wasLocallyAccepted = locallyAcceptedIdsRef.current.has(targetUserId);
      if (wasLocallyAccepted) {
        locallyAcceptedIdsRef.current.delete(targetUserId);
      } else {
        toast.success("Your friend request was accepted!");
      }
    } else if (lastFriendEvent.type === "request_declined") {
      const targetUserId = lastFriendEvent.userId;
      setFriendRequests((prev) => prev.filter((r) => r.id !== targetUserId));

      // Only display the toast if the other player declined our request,
      // not when we were the one who clicked decline locally.
      const wasLocallyDeclined = locallyDeclinedIdsRef.current.has(targetUserId);
      if (wasLocallyDeclined) {
        locallyDeclinedIdsRef.current.delete(targetUserId);
      } else {
        toast.warning("Friend request was declined.");
      }
    }

    // Clear consumed event from the store so it never lingers
    clearLastFriendEvent();
  }, [lastFriendEvent, fetchFriends, clearLastFriendEvent]);

  // Synchronize friends with socket initialFriendsData and auth user state
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setRawFriends([]);
      setFriendRequests([]);
      return;
    }

    if (initialFriendsData) {
      setRawFriends(initialFriendsData.friends);
      setFriendRequests(initialFriendsData.requests);
    }
  }, [user, initialFriendsData]);

  // Fallback: only call getFriendships if socket has not delivered friends sync after a grace period
  useEffect(() => {
    if (!user || user.isAnonymous) return;
    if (initialFriendsData) return;

    const timeout = setTimeout(() => {
      if (!useFriendStore.getState().initialFriendsData) {
        fetchFriends();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [user, initialFriendsData, fetchFriends]);

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
        const msg = res.message || "Friend request sent!";
        toast.success(msg);

        if (res.targetUser) {
          if (res.autoAccepted) {
            setRawFriends((prev) => [
              ...prev.filter((f) => f.id !== res.targetUser!.id),
              {
                id: res.targetUser!.id,
                name: res.targetUser!.name,
                username: res.targetUser!.username,
                avatar: res.targetUser!.avatar,
                status: "online",
                activity: "In Lobby",
              },
            ]);
            setFriendRequests((prev) =>
              prev.filter((r) => r.id !== res.targetUser!.id),
            );
            if (res.receiverId) {
              acceptFriendRequestSocket(res.receiverId);
            }
          } else {
            setFriendRequests((prev) => [
              ...prev.filter((r) => r.id !== res.targetUser!.id),
              {
                id: res.targetUser!.id,
                name: res.targetUser!.name,
                username: res.targetUser!.username,
                avatar: res.targetUser!.avatar,
                type: "outgoing",
                createdAt: new Date().toISOString(),
              },
            ]);
            if (res.receiverId) {
              sendFriendRequestSocket(res.receiverId);
            }
          }
        } else {
          await fetchFriends();
        }
      } else {
        const err = res.error || "Failed to send friend request";
        toast.error(err);
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to send friend request";
      toast.error(msg);
    } finally {
      setIsAddingFriend(false);
    }
  };

  // Accept incoming request
  const handleAcceptRequest = async (requestId: string) => {
    locallyAcceptedIdsRef.current.add(requestId);

    const targetRequest = friendRequests.find((r) => r.id === requestId);
    if (targetRequest) {
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
      setRawFriends((prev) => [
        ...prev.filter((f) => f.id !== targetRequest.id),
        {
          id: targetRequest.id,
          name: targetRequest.name,
          username: targetRequest.username,
          avatar: targetRequest.avatar,
          status: "online",
          activity: "In Lobby",
        },
      ]);
    }

    try {
      const res = await acceptFriendRequest(requestId);
      if (res.success) {
        if (res.requesterId) {
          locallyAcceptedIdsRef.current.add(res.requesterId);
        }
        const msg = res.message || "Friend request accepted!";
        toast.success(msg);
        if (res.requesterId) {
          acceptFriendRequestSocket(res.requesterId);
        }
      } else {
        locallyAcceptedIdsRef.current.delete(requestId);
        const err = res.error || "Failed to accept request";
        toast.error(err);
        fetchFriends();
      }
    } catch (err: any) {
      locallyAcceptedIdsRef.current.delete(requestId);
      const msg = err?.message || "Failed to accept request";
      toast.error(msg);
      fetchFriends();
    }
  };

  // Decline incoming request
  const handleDeclineRequest = async (requestId: string) => {
    locallyDeclinedIdsRef.current.add(requestId);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      const res = await declineFriendRequest(requestId);
      if (res.success) {
        if (res.requesterId) {
          locallyDeclinedIdsRef.current.add(res.requesterId);
        }
        const msg = res.message || "Friend request declined";
        toast.info(msg);
        if (res.requesterId) {
          declineFriendRequestSocket(res.requesterId);
        }
      } else {
        locallyDeclinedIdsRef.current.delete(requestId);
        const err = res.error || "Failed to decline request";
        toast.error(err);
        fetchFriends();
      }
    } catch (err: any) {
      locallyDeclinedIdsRef.current.delete(requestId);
      const msg = err?.message || "Failed to decline request";
      toast.error(msg);
      fetchFriends();
    }
  };

  // Cancel outgoing request
  const handleCancelRequest = async (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      const res = await cancelFriendRequest(requestId);
      if (res.success) {
        const msg = res.message || "Friend request cancelled";
        toast.info(msg);
      } else {
        const err = res.error || "Failed to cancel request";
        toast.error(err);
        fetchFriends();
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to cancel request";
      toast.error(msg);
      fetchFriends();
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendId: string) => {
    setRawFriends((prev) => prev.filter((f) => f.id !== friendId));

    try {
      const res = await removeFriend(friendId);
      if (res.success) {
        const msg = res.message || "Friend removed";
        toast.success(msg);
      } else {
        const err = res.error || "Failed to remove friend";
        toast.error(err);
        fetchFriends();
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to remove friend";
      toast.error(msg);
      fetchFriends();
    }
  };

  // Invite friend
  const handleInviteFriend = (friend: Friend) => {
    const msg = `Invited ${friend.name} to party!`;
    toast.success(msg);
  };

  return {
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
    handleInviteFriend,
    refetchFriends: fetchFriends,
  };
}
