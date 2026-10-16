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

export function sendInviteToParty(invitedPlayerId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_SEND, { invitedPlayerId });
}

export function acceptInviteToParty(partyId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_ACCEPT, { partyId });
}

export function declineInviteToParty(partyId: string, inviterId: string) {
  socket.emit(ClientEvents.PARTY_INVITE_DECLINE, { partyId, inviterId });
}

export function kickPlayerFromParty(
  kickedPlayerId: string,
) {
  socket.emit(ClientEvents.PARTY_KICK, { kickedPlayerId });
}

export function sendMessageToParty(message: string) {
  socket.emit(ClientEvents.PARTY_CHAT, message);
}

// ==== GAME EVENTS ====

export function createGame(
  settings: GuessAgentSettings,
  mode: "GUESS_AGENT" = "GUESS_AGENT",
) {
  const isInfiniteTimer =
    settings.timePerRound === -1 ||
    settings.timePerRound === 0 ||
    Number(settings.timePerRound) <= 0 ||
    Number(settings.timePerRound) >= 999999 ||
    isNaN(Number(settings.timePerRound));

  const cleanSettings = {
    questionMode: settings.questionMode ?? "PRESET",
    maxNos: Math.max(1, Math.floor(Number(settings.maxNos) || 5)),
    maxGuesses: Math.max(1, Math.floor(Number(settings.maxGuesses) || 1)),
    questionCount: Math.max(1, Math.floor(Number(settings.questionCount) || 15)),
    timePerRound: isInfiniteTimer ? -1 : Math.floor(Number(settings.timePerRound)),
  };
  socket.emit(ClientEvents.GAME_CREATE, { mode, settings: cleanSettings });
}

export function startGame() {
  socket.emit(ClientEvents.GAME_START);
}

export function leaveGame() {
  socket.emit(ClientEvents.GAME_LEAVE);
}

// ==== GUESS AGENT SPECIFIC GAME EVENTS ====

export function consumeNo() {
  socket.emit(ClientEvents.CONSUME_NO);
}

export function askQuestion(questionId: string) {
  socket.emit(ClientEvents.QUESTION_ASK, { questionId });
}

export function answerQuestion(answer: "YES" | "NO" | "yes" | "no") {
  const normalizedAnswer = answer.toUpperCase() as "YES" | "NO";
  socket.emit(ClientEvents.QUESTION_ANSWER, { answer: normalizedAnswer });
}

export function submitGuess(guess: string) {
  socket.emit(ClientEvents.GUESS_SUBMIT, { guess });
}

// ==== AUTH EVENTS ====

export function refreshAuth(token: string) {
  socket.emit(ClientEvents.AUTH_REFRESH, token);
}