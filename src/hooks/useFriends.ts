"use client";

import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { logger } from "@/lib/logger";
import { DEFAULT_AVATARS } from "@/consts";
import { Friend, FriendRequest } from "@/types/friends";

import { StoreUser } from "@/store/authStore";
import { useFriendStore } from "@/store/friendStore";
import { usePresenceStore } from "@/store/presenceStore";
import { usePartyStore } from "@/store/partyStore";

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

function sanitizeUsername(username?: string) {
  if (!username) return undefined;
  return username.startsWith("@") ? username : `@${username}`;
}

export function useFriends(user: StoreUser | null) {
  const [friendInput, setFriendInput] = useState("");
  const [rawFriends, setRawFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);

  const presence = usePresenceStore((state) => state.presence);
  const party = usePartyStore((state) => state.party);
  const lastFriendEvent = useFriendStore((state) => state.lastFriendEvent);
  const clearLastFriendEvent = useFriendStore(
    (state) => state.clearLastFriendEvent
  );
  const initialFriendsData = useFriendStore(
    (state) => state.initialFriendsData
  );

  const lastProcessedTimestampRef = useRef<number>(0);
  const locallyAcceptedIdsRef = useRef<Set<string>>(new Set());
  const locallyDeclinedIdsRef = useRef<Set<string>>(new Set());

  const friendsList = useMemo<Friend[]>(() => {
    const list =
      rawFriends.length > 0
        ? rawFriends
        : user && !user.isAnonymous && initialFriendsData
        ? initialFriendsData.friends
        : [];

    const partyMemberIds = new Set(
      party?.members?.map((m) => m.id) ?? []
    );

    return list.map((f) => {
      const pres = presence[f.id];
      const isPartyMember = partyMemberIds.has(f.id);

      let status: "online" | "ingame" | "offline";
      if (pres !== undefined) {
        status =
          typeof pres === "boolean"
            ? pres
              ? "online"
              : "offline"
            : pres;
      } else if (f.status === "ingame" || f.status === "online") {
        status = f.status;
      } else {
        status = "offline";
      }

      if (isPartyMember && status === "offline") {
        status = "online";
      }

      return {
        ...f,
        status,
        activity:
          status === "ingame"
            ? "In Match"
            : status === "online"
            ? isPartyMember
              ? "In Your Party"
              : "In Lobby"
            : "Offline",
      };
    });
  }, [rawFriends, user, initialFriendsData, presence, party?.members]);

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
            const pres = usePresenceStore.getState().presence[friendUser.id];
            const isOnline =
              pres === "online" ||
              pres === "ingame";
            friends.push({
              id: friendUser.id,
              name: friendUser.name || "Player",
              username: sanitizeUsername(friendUser.username),
              avatar: friendUser.image || DEFAULT_AVATARS.USER,
              status: pres === "ingame" ? "ingame" : isOnline ? "online" : "offline",
              activity: pres === "ingame" ? "In Match" : isOnline ? "In Lobby" : "Offline",
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
              username: sanitizeUsername(friendship.requester.username),
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
              username: sanitizeUsername(friendship.receiver.username),
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
    } catch (error) {
      logger.error({ error }, "Failed to fetch friends");
    }
  }, [user]);

  useEffect(() => {
    if (!lastFriendEvent || !lastFriendEvent.timestamp) return;

    if (lastFriendEvent.timestamp <= lastProcessedTimestampRef.current) return;
    lastProcessedTimestampRef.current = lastFriendEvent.timestamp;

    if (lastFriendEvent.type === "request_received") {
      toast.info("New friend request received!");
      if (lastFriendEvent.requester) {
        const req = lastFriendEvent.requester;
        const newReq: FriendRequest = {
          id: req.id,
          name: req.name || "Player",
          username: sanitizeUsername(req.username),
          avatar: req.avatar || DEFAULT_AVATARS.OPPONENT,
          type: "incoming",
          createdAt: new Date().toISOString(),
        };
        setFriendRequests((prev) => [
          ...prev.filter((r) => r.id !== req.id),
          newReq,
        ]);
        const currentInitial = useFriendStore.getState().initialFriendsData;
        if (currentInitial) {
          useFriendStore.getState().setInitialFriendsData({
            friends: currentInitial.friends,
            requests: [
              ...currentInitial.requests.filter((r) => r.id !== req.id),
              newReq,
            ],
          });
        }
      } else {
        fetchFriends();
      }
    } else if (lastFriendEvent.type === "request_accepted") {
      const targetUserId = lastFriendEvent.userId;
      setFriendRequests((prev) => prev.filter((r) => r.id !== targetUserId));
      usePresenceStore.getState().setSinglePresence(targetUserId, true);
      fetchFriends();

      const wasLocallyAccepted =
        locallyAcceptedIdsRef.current.has(targetUserId);
      if (wasLocallyAccepted) {
        locallyAcceptedIdsRef.current.delete(targetUserId);
      } else {
        toast.success("Your friend request was accepted!");
      }
    } else if (lastFriendEvent.type === "request_declined") {
      const targetUserId = lastFriendEvent.userId;
      setFriendRequests((prev) => prev.filter((r) => r.id !== targetUserId));
      const currentInitial = useFriendStore.getState().initialFriendsData;
      if (currentInitial) {
        useFriendStore.getState().setInitialFriendsData({
          friends: currentInitial.friends,
          requests: currentInitial.requests.filter((r) => r.id !== targetUserId),
        });
      }

      const wasLocallyDeclined =
        locallyDeclinedIdsRef.current.has(targetUserId);
      if (wasLocallyDeclined) {
        locallyDeclinedIdsRef.current.delete(targetUserId);
      } else {
        toast.warning("Friend request was declined.");
      }
    }

    clearLastFriendEvent();
  }, [lastFriendEvent, fetchFriends, clearLastFriendEvent]);

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

  useEffect(() => {
    if (!user || user.isAnonymous) return;
    if (initialFriendsData) return;

    const timeout = setTimeout(() => {
      if (!useFriendStore.getState().initialFriendsData) {
        fetchFriends();
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, [user, initialFriendsData, fetchFriends]);

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
            const newFriend: Friend = {
              id: res.targetUser.id,
              name: res.targetUser.name,
              username: sanitizeUsername(res.targetUser.username),
              avatar: res.targetUser.avatar,
              status: "online",
              activity: "In Lobby",
            };
            setRawFriends((prev) => [
              ...prev.filter((f) => f.id !== res.targetUser!.id),
              newFriend,
            ]);
            setFriendRequests((prev) =>
              prev.filter((r) => r.id !== res.targetUser!.id)
            );
            const currentInitial = useFriendStore.getState().initialFriendsData;
            if (currentInitial) {
              useFriendStore.getState().setInitialFriendsData({
                friends: [
                  ...currentInitial.friends.filter(
                    (f) => f.id !== res.targetUser!.id
                  ),
                  newFriend,
                ],
                requests: currentInitial.requests.filter(
                  (r) => r.id !== res.targetUser!.id
                ),
              });
            }
            if (res.receiverId) {
              acceptFriendRequestSocket(res.receiverId);
            }
          } else {
            const newRequest: FriendRequest = {
              id: res.targetUser.id,
              name: res.targetUser.name,
              username: sanitizeUsername(res.targetUser.username),
              avatar: res.targetUser.avatar,
              type: "outgoing",
              createdAt: new Date().toISOString(),
            };
            setFriendRequests((prev) => [
              ...prev.filter((r) => r.id !== res.targetUser!.id),
              newRequest,
            ]);
            const currentInitial = useFriendStore.getState().initialFriendsData;
            if (currentInitial) {
              useFriendStore.getState().setInitialFriendsData({
                friends: currentInitial.friends,
                requests: [
                  ...currentInitial.requests.filter(
                    (r) => r.id !== res.targetUser!.id
                  ),
                  newRequest,
                ],
              });
            }
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
      logger.error({ err }, "Error sending friend request");
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    locallyAcceptedIdsRef.current.add(requestId);

    const targetRequest = friendRequests.find((r) => r.id === requestId);
    if (targetRequest) {
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
      const newFriend: Friend = {
        id: targetRequest.id,
        name: targetRequest.name,
        username: targetRequest.username,
        avatar: targetRequest.avatar,
        status: "online",
        activity: "In Lobby",
      };
      setRawFriends((prev) => [
        ...prev.filter((f) => f.id !== targetRequest.id),
        newFriend,
      ]);
      usePresenceStore.getState().setSinglePresence(targetRequest.id, true);

      const currentInitial = useFriendStore.getState().initialFriendsData;
      if (currentInitial) {
        useFriendStore.getState().setInitialFriendsData({
          friends: [
            ...currentInitial.friends.filter((f) => f.id !== targetRequest.id),
            newFriend,
          ],
          requests: currentInitial.requests.filter((r) => r.id !== requestId),
        });
      }
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

  const handleDeclineRequest = async (requestId: string) => {
    locallyDeclinedIdsRef.current.add(requestId);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    const currentInitial = useFriendStore.getState().initialFriendsData;
    if (currentInitial) {
      useFriendStore.getState().setInitialFriendsData({
        friends: currentInitial.friends,
        requests: currentInitial.requests.filter((r) => r.id !== requestId),
      });
    }

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

  const handleCancelRequest = async (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));

    const currentInitial = useFriendStore.getState().initialFriendsData;
    if (currentInitial) {
      useFriendStore.getState().setInitialFriendsData({
        friends: currentInitial.friends,
        requests: currentInitial.requests.filter((r) => r.id !== requestId),
      });
    }

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

  const handleRemoveFriend = async (friendId: string) => {
    setRawFriends((prev) => prev.filter((f) => f.id !== friendId));

    const currentInitial = useFriendStore.getState().initialFriendsData;
    if (currentInitial) {
      useFriendStore.getState().setInitialFriendsData({
        friends: currentInitial.friends.filter((f) => f.id !== friendId),
        requests: currentInitial.requests,
      });
    }

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
