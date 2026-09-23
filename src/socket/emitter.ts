import { socket } from "@/socket";
import { ClientEvents } from "@/socket/events";
import { Settings } from "@/types/game";

// ROOM EVENTS

export function createRoom() {
  socket.emit(ClientEvents.ROOM_CREATE);
}

export function joinRoom(roomId: string) {
  socket.emit(ClientEvents.ROOM_JOIN, {roomId});
}

export function leaveRoom(roomId: string) {
  socket.emit(ClientEvents.ROOM_LEAVE, { roomId });
}

export function updateRoom(roomId: string, settings: Settings) {
  socket.emit(ClientEvents.ROOM_UPDATE, { roomId, settings });
}

export function reconnectRoom(roomId: string, reconnectToken: string) {
  socket.emit(ClientEvents.ROOM_RECONNECT, { roomId, reconnectToken });
}

// Game Events

export function startGame(roomId: string) { 
  socket.emit(ClientEvents.GAME_START, roomId);
}

export function sendHeartbeat(roomId: string) {
  socket.emit(ClientEvents.GAME_HEARTBEAT, roomId);
}

// Question Events

export function askQuestion(roomId: string, questionId: string) {
  socket.emit(ClientEvents.QUESTION_ASK, { roomId, questionId });
}

export function answerQuestion(roomId: string, answer: "yes" | "no") {
  socket.emit(ClientEvents.QUESTION_ANSWER, { roomId, answer });
}

export function submitGuess(roomId: string, guess: string) {
  socket.emit(ClientEvents.GUESS_SUBMIT, { roomId, guess });
}

export function kickPlayer(roomId: string, kickedPlayerId: string) {
  socket.emit(ClientEvents.ROOM_KICK, { roomId, kickedPlayerId });
}

// PARTY INVITE EVENTS

export function sendInvite(
  invitedPlayer: { id: string; username: string },
  roomId?: string,
) {
  console.log("test 2")
  socket.emit(ClientEvents.INVITE_SEND, {invitedPlayer, roomId});
}

export function acceptInvite(roomId: string) {
  socket.emit(ClientEvents.INVITE_ACCEPT, { roomId });
}

export function rejectInvite(roomId: string, inviterId: string) {
  socket.emit(ClientEvents.INVITE_REJECT, { roomId, inviterId });
}

export function sendPlayerHeartbeat() {
  socket.emit(ClientEvents.PLAYER_HEARTBEAT);
}