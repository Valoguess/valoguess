import { socket } from "@/socket";
import { ClientEvents } from "@/socket/events";
import { GuessAgentSettings } from "@/types/game";

// ==== PLAYER EVENTS ====

export function sendPlayerHeartbeat() {
  socket.emit(ClientEvents.PLAYER_HEARTBEAT);
}

// ==== FRIEND EVENTS ====

export function sendFriendRequestSocket(receiverId: string) {
  socket.emit(ClientEvents.FRIEND_REQUEST_SEND, { receiverId });
}

export function acceptFriendRequestSocket(requesterId: string) {
  socket.emit(ClientEvents.FRIEND_REQUEST_ACCEPT, { requesterId });
}

export function declineFriendRequestSocket(requesterId: string) {
  socket.emit(ClientEvents.FRIEND_REQUEST_DECLINE, { requesterId });
}

// ==== PARTY EVENTS ====

export function createParty() {
  socket.emit(ClientEvents.PARTY_CREATE);
}

export function leaveParty() {
  socket.emit(ClientEvents.PARTY_LEAVE);
}

export function sendInviteToParty(partyId: string | undefined, invitedPlayerId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_SEND, { partyId, invitedPlayerId });
}

export function acceptInviteToParty(partyId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_ACCEPT, { partyId });
}

export function declineInviteToParty(partyId: string, inviterId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_DECLINE, { partyId, inviterId });
}

export function kickPlayerFromParty(
  kickedPlayerIdOrPartyId: string,
  maybeKickedPlayerId?: string,
) {
  const kickedPlayerId = maybeKickedPlayerId || kickedPlayerIdOrPartyId;
  socket.emit(ClientEvents.PARTY_KICK, { kickedPlayerId });
}

export function sendMessageToParty(message: string) {
  socket.emit(ClientEvents.PARTY_CHAT, message);
}

// ==== GAME EVENTS ====

export function createGame(
  partyId: string,
  settings: GuessAgentSettings,
  mode: "GUESS_AGENT" = "GUESS_AGENT",
) {
  const cleanSettings = {
    questionMode: settings.questionMode ?? "PRESET",
    maxNos: Math.max(1, Math.floor(Number(settings.maxNos) || 5)),
    maxGuesses: Math.max(1, Math.floor(Number(settings.maxGuesses) || 1)),
    questionCount: Math.max(1, Math.floor(Number(settings.questionCount) || 15)),
    timePerRound: Math.floor(Number(settings.timePerRound) ?? -1),
  };
  socket.emit(ClientEvents.GAME_CREATE, { partyId, mode, settings: cleanSettings });
}

export function startGame(gameId: string) {
  socket.emit(ClientEvents.GAME_START, { gameId });
}

// ==== GUESS AGENT SPECIFIC GAME EVENTS ====

export function askQuestion(gameId: string, questionId: string) {
  socket.emit(ClientEvents.QUESTION_ASK, { gameId, questionId });
}

export function answerQuestion(gameId: string, answer: "YES" | "NO" | "yes" | "no") {
  const normalizedAnswer = answer.toUpperCase() as "YES" | "NO";
  socket.emit(ClientEvents.QUESTION_ANSWER, { gameId, answer: normalizedAnswer });
}

export function submitGuess(gameId: string, guess: string) {
  socket.emit(ClientEvents.GUESS_SUBMIT, { gameId, guess });
}

// Backwards-compatibility aliases
export const createRoom = createParty;
export const leaveRoom = leaveParty;
export const kickPlayer = (partyOrRoomId: string, kickedPlayerId: string) =>
  kickPlayerFromParty(partyOrRoomId, kickedPlayerId);
export const sendInvite = (
  invitedPlayer: { id: string },
  partyId?: string,
) => {
  if (partyId) {
    sendInviteToParty(partyId, invitedPlayer.id);
  }
};
export const acceptInvite = (partyId: string) => acceptInviteToParty(partyId);
export const rejectInvite = (partyId: string, inviterId: string) =>
  declineInviteToParty(partyId, inviterId);
export const sendHeartbeat = () => sendPlayerHeartbeat();
