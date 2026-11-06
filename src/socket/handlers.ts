import { socket } from "@/socket";
import { ClientEvents } from "@/socket/events";
import { usePartyStore } from "@/store/partyStore";
import { useGameStore } from "@/store/gameStore";
import { useInviteStore } from "@/store/inviteStore";
import { useAuthStore } from "@/store/authStore";
import { usePresenceStore, normalizePresenceStatus } from "@/store/presenceStore";
import { useFriendStore } from "@/store/friendStore";
import { useTempResultStore } from "@/store/tempResultStore";
import { Party } from "@/types/party";
import { GuessAgentGameDTO } from "@/types/game";
import { DEFAULT_AVATARS } from "@/consts";
import { toast } from "sonner";

export function sendHeartbeat() {
  if (socket.connected) {
    socket.emit(ClientEvents.PLAYER_HEARTBEAT);
  }
}

export function handlePartySync(syncedParty: Party | null) {
  if (!syncedParty) {
    usePartyStore.getState().clearParty();
    return;
  }
  usePartyStore.getState().setParty(syncedParty);
}

export function handlePartyChatSync(data: { userId: string; message: string }) {
  if (!data || !data.message) return;
  const currentUserId = useAuthStore.getState().user?.id;
  const isMe = data.userId === currentUserId;
  const currentParty = usePartyStore.getState().party;
  const member = currentParty?.members.find((m) => m.id === data.userId);

  const senderName = isMe
    ? useAuthStore.getState().user?.name || "YOU"
    : member?.name || "Player";

  usePartyStore.getState().addPartyMessage({
    id: crypto.randomUUID(),
    sender: senderName,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    text: data.message,
    colorClass: isMe ? "text-[#3CF2C4]" : "text-[#8C7BFF]",
    avatar: isMe ? DEFAULT_AVATARS.GUEST : DEFAULT_AVATARS.USER,
  });
}

export function handlePartyInviteSync(data: {
  partyId: string;
  inviterId?: string;
  otherPlayerId?: string;
  status: "PENDING" | "DECLINED";
}) {
  if (!data || !data.partyId) return;

  const { partyId, inviterId, otherPlayerId, status } = data;

  if (status === "DECLINED") {
    useInviteStore.getState().setLastDeclinedInvite({
      otherPlayerId: otherPlayerId || inviterId || "",
      partyId,
      roomId: partyId,
      timestamp: Date.now(),
    });
    return;
  }

  if (status === "PENDING" && inviterId) {
    const id = `inv-${inviterId}-${partyId}`;
    useInviteStore.getState().addIncomingInvite({
      id,
      inviteId: id,
      partyId,
      roomId: partyId,
      sender: {
        id: inviterId,
        name: "Player",
        avatar: DEFAULT_AVATARS.USER,
      },
      sentAt: Date.now(),
    });
  }
}

export function handleGameSync(
  syncedGame: GuessAgentGameDTO | null,
  context: { pathname: string; router: { push: (path: string) => void } }
) {
  if (!syncedGame || (typeof syncedGame === "object" && !syncedGame.id)) {
    const currentGame = useGameStore.getState().game;
    const currentFinishedGame = useTempResultStore.getState().tempResultGame;
    const isFinished =
      currentGame?.status === "FINISHED" ||
      currentFinishedGame?.status === "FINISHED";

    if (!isFinished) {
      useGameStore.getState().clearGame();
      if (context.pathname === "/play") {
        toast.error("Game not found. Redirecting to lobby.");
        context.router.push("/lobby");
      }
    }
    return;
  }

  if (syncedGame.status === "FINISHED") {
    useTempResultStore.getState().setTempResultGame(syncedGame);
  }

  const currentUserId = useAuthStore.getState().user?.id;
  if (typeof window !== "undefined" && syncedGame?.id) {
    const me =
      (currentUserId
        ? syncedGame.players?.find((p) => p.id === currentUserId)
        : undefined) ||
      (syncedGame.status !== "FINISHED"
        ? syncedGame.players?.find(
            (p) => p.state && p.state.secretAgent !== null
          )
        : undefined);

    if (me) {
      sessionStorage.setItem(`my_player_id_${syncedGame.id}`, me.id);
      if (me.state?.secretAgent) {
        sessionStorage.setItem(
          `secret_agent_${syncedGame.id}`,
          me.state.secretAgent
        );
      }
    }
  }

  useGameStore.getState().setGame(syncedGame);

  if (
    (syncedGame.status === "STARTING" || syncedGame.status === "PLAYING") &&
    context.pathname !== "/play"
  ) {
    context.router.push("/play");
  }
}

export function handleSocketError(
  err: any,
  context?: { pathname?: string }
) {
  if (
    err?.message === "Player is not in a game" ||
    err?.errorCode === "PLAYER_NOT_IN_GAME"
  ) {
    return;
  }
  if (err?.message === "Player not found") {
    socket.disconnect();
    socket.connect();
  }
  if (
    err?.message === "Party not found" ||
    err?.message === "User not in party"
  ) {
    usePartyStore.getState().clearParty();
    toast.error(err.message);
  }
  if (err?.message === "Game not found") {
    const isFinished =
      useGameStore.getState().game?.status === "FINISHED" ||
      useTempResultStore.getState().tempResultGame?.status === "FINISHED";
    if (!isFinished) {
      useGameStore.getState().clearGame();
      if (context?.pathname === "/play") {
        toast.error(err.message);
      }
    }
  }
}

export function handleFriendsSync(data: any) {
  if (!data) return;

  let friendsArr: any[] = [];
  let requestsObj: any = null;

  if (Array.isArray(data)) {
    friendsArr = data;
  } else if (Array.isArray(data.friends)) {
    friendsArr = data.friends;
    requestsObj = data.requests;
  } else if (data.friends && typeof data.friends === "object") {
    friendsArr = Array.isArray(data.friends.friends)
      ? data.friends.friends
      : [];
    requestsObj = data.friends.requests;
  }

  if (friendsArr.length > 0) {
    usePresenceStore.getState().setFriendsPresence(
      friendsArr.map((f: any) => ({
        userId: f.id || f.userId,
        status: f.status !== undefined ? f.status : f.online,
      }))
    );
  }

  const friends = friendsArr.map((f: any) => {
    const friendId = f.id || f.userId;
    const status = normalizePresenceStatus(
      f.status !== undefined ? f.status : f.online
    );
    return {
      id: friendId,
      name: f.name || "Player",
      username: f.username
        ? f.username.startsWith("@")
          ? f.username
          : `@${f.username}`
        : undefined,
      avatar: f.image || DEFAULT_AVATARS.USER,
      status,
      activity:
        status === "ingame"
          ? "In Match"
          : status === "online"
          ? "In Lobby"
          : "Offline",
    };
  });

  const incoming = (requestsObj?.incoming || []).map((r: any) => ({
    id: r.id || r.userId,
    name: r.name || "Player",
    username: r.username
      ? r.username.startsWith("@")
        ? r.username
        : `@${r.username}`
      : undefined,
    avatar: r.image || DEFAULT_AVATARS.OPPONENT,
    type: "incoming" as const,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));

  const outgoing = (requestsObj?.outgoing || []).map((r: any) => ({
    id: r.id || r.userId,
    name: r.name || "Player",
    username: r.username
      ? r.username.startsWith("@")
        ? r.username
        : `@${r.username}`
      : undefined,
    avatar: r.image || DEFAULT_AVATARS.GUEST,
    type: "outgoing" as const,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
  }));

  useFriendStore.getState().setInitialFriendsData({
    friends,
    requests: [...incoming, ...outgoing],
  });
}

export function handleFriendPresence(data: any) {
  const userId = data?.userId || data?.id || data?.friendId;
  if (userId) {
    const rawStatus = data?.status !== undefined ? data.status : data?.online;
    const normalized = normalizePresenceStatus(rawStatus);
    usePresenceStore.getState().setSinglePresence(userId, normalized);

    const initial = useFriendStore.getState().initialFriendsData;
    if (initial && Array.isArray(initial.friends)) {
      const updatedFriends = initial.friends.map((f) =>
        f.id === userId
          ? {
              ...f,
              status: normalized,
              activity:
                normalized === "ingame"
                  ? "In Match"
                  : normalized === "online"
                  ? "In Lobby"
                  : "Offline",
            }
          : f
      );
      useFriendStore.getState().setInitialFriendsData({
        ...initial,
        friends: updatedFriends,
      });
    }
  }
}

export function handleFriendRequest(data: any) {
  const userId = data?.id || data?.requesterId || data?.userId;
  if (userId) {
    const requester =
      data?.requester ||
      (data?.name
        ? {
            id: userId,
            name: data.name,
            username: data.username,
            avatar: data.image || data.avatar,
          }
        : undefined);

    useFriendStore.getState().triggerFriendSync({
      type: "request_received",
      userId,
      requester,
    });
  }
}

export function handleFriendRequestAccepted(data: {
  userId?: string;
  accepterId?: string;
}) {
  const targetUserId = data?.userId || data?.accepterId;
  if (targetUserId) {
    useFriendStore.getState().triggerFriendSync({
      type: "request_accepted",
      userId: targetUserId,
    });
    usePresenceStore.getState().setSinglePresence(targetUserId, true);

    const initial = useFriendStore.getState().initialFriendsData;
    if (initial) {
      useFriendStore.getState().setInitialFriendsData({
        friends: initial.friends,
        requests: initial.requests.filter((r) => r.id !== targetUserId),
      });
    }
  }
}

export function handleFriendRequestDeclined(data: {
  userId?: string;
  declinerId?: string;
}) {
  const targetUserId = data?.userId || data?.declinerId;
  if (targetUserId) {
    useFriendStore.getState().triggerFriendSync({
      type: "request_declined",
      userId: targetUserId,
    });

    const initial = useFriendStore.getState().initialFriendsData;
    if (initial) {
      useFriendStore.getState().setInitialFriendsData({
        friends: initial.friends,
        requests: initial.requests.filter((r) => r.id !== targetUserId),
      });
    }
  }
}

export function handleOpponentDisconnected(data: {
  playerName?: string;
  reconnectWindowMs?: number;
}) {
  const seconds = Math.round((data?.reconnectWindowMs ?? 60000) / 1000);
  toast.warning(
    `${data?.playerName ?? "Opponent"} disconnected. They have ${seconds}s to reconnect or you win.`,
    { duration: seconds * 1000, closeButton: true }
  );
}
