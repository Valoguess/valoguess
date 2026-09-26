"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { StoreUser } from "@/store/authStore";
import { Friend, FriendRequest } from "@/types/friends";
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

export function useFriends(user: StoreUser | null) {
  const [friendInput, setFriendInput] = useState("");
  const [rawFriends, setRawFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendAddedToast, setFriendAddedToast] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const presence = usePresenceStore((state) => state.presence);
  const lastFriendEvent = useFriendStore((state) => state.lastFriendEvent);
  const initialFriendsData = useFriendStore((state) => state.initialFriendsData);

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

  // Handle real-time friend events from socket
  useEffect(() => {
    if (!lastFriendEvent) return;

    if (lastFriendEvent.type === "request_received") {
      setFriendAddedToast("New friend request received!");
      if (lastFriendEvent.requester) {
        const req = lastFriendEvent.requester;
        setFriendRequests((prev) => [
          ...prev.filter((r) => r.id !== req.id),
          {
            id: req.id,
            name: req.name || "Player",
            username: req.username ? `@${req.username.replace(/^@/, "")}` : undefined,
            avatar: req.avatar || "/agents/icon/reyna.png",
            type: "incoming",
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        // Fallback to fetch if socket server didn't include requester details
        fetchFriends();
      }
      setTimeout(() => setFriendAddedToast(""), 4000);
    } else if (lastFriendEvent.type === "request_accepted") {
      setFriendAddedToast("Your friend request was accepted!");
      const targetUserId = lastFriendEvent.userId;

      setFriendRequests((prev) => {
        const matched = prev.find((r) => r.id === targetUserId);
        if (matched) {
          setRawFriends((fPrev) => [
            ...fPrev.filter((f) => f.id !== targetUserId),
            {
              id: matched.id,
              name: matched.name,
              username: matched.username,
              avatar: matched.avatar,
              status: "online",
              activity: "In Lobby",
            },
          ]);
          return prev.filter((r) => r.id !== targetUserId);
        }
        // If not found in current memory, sync from database
        fetchFriends();
        return prev;
      });
      setTimeout(() => setFriendAddedToast(""), 4000);
    } else if (lastFriendEvent.type === "request_declined") {
      setFriendAddedToast("Friend request was declined.");
      const targetUserId = lastFriendEvent.userId;
      setFriendRequests((prev) => prev.filter((r) => r.id !== targetUserId));
      setTimeout(() => setFriendAddedToast(""), 4000);
    }
  }, [lastFriendEvent, fetchFriends]);

  // Update state whenever initialFriendsData arrives from socket
  useEffect(() => {
    if (initialFriendsData) {
      setRawFriends(initialFriendsData.friends);
      setFriendRequests(initialFriendsData.requests);
    }
  }, [initialFriendsData]);

  // When user is not logged in or is anonymous, clear friends
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setRawFriends([]);
      setFriendRequests([]);
      return;
    }

    // If socket has already delivered initial friends sync, no need to call getFriendships
    if (initialFriendsData) return;

    // Fallback: only call getFriendships if socket has not delivered friends sync after a grace period
    const timeout = setTimeout(() => {
      if (!useFriendStore.getState().initialFriendsData) {
        fetchFriends();
      }
    }, 4000);

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
        setFriendAddedToast(res.message || "Friend request sent!");

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
            setFriendRequests((prev) => prev.filter((r) => r.id !== res.targetUser!.id));
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
        setFriendAddedToast(res.message || "Friend request accepted!");
        if (res.requesterId) {
          acceptFriendRequestSocket(res.requesterId);
        }
      } else {
        setFriendAddedToast(res.error || "Failed to accept request");
        fetchFriends();
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to accept request");
      fetchFriends();
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Decline incoming request
  const handleDeclineRequest = async (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      const res = await declineFriendRequest(requestId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend request declined");
        if (res.requesterId) {
          declineFriendRequestSocket(res.requesterId);
        }
      } else {
        setFriendAddedToast(res.error || "Failed to decline request");
        fetchFriends();
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to decline request");
      fetchFriends();
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Cancel outgoing request
  const handleCancelRequest = async (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      const res = await cancelFriendRequest(requestId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend request cancelled");
      } else {
        setFriendAddedToast(res.error || "Failed to cancel request");
        fetchFriends();
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to cancel request");
      fetchFriends();
    }
    setTimeout(() => setFriendAddedToast(""), 4000);
  };

  // Remove friend
  const handleRemoveFriend = async (friendId: string) => {
    setRawFriends((prev) => prev.filter((f) => f.id !== friendId));

    try {
      const res = await removeFriend(friendId);
      if (res.success) {
        setFriendAddedToast(res.message || "Friend removed");
      } else {
        setFriendAddedToast(res.error || "Failed to remove friend");
        fetchFriends();
      }
    } catch (err: any) {
      setFriendAddedToast(err?.message || "Failed to remove friend");
      fetchFriends();
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
