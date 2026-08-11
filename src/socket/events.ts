export const ClientEvents = {
  ROOM_CREATE: "room:create",
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",
  ROOM_UPDATE: "room:update",
  ROOM_KICK: "room:kick",

  ROOM_RECONNECT: "room:reconnect",

  GAME_START: "game:start",

  GAME_HEARTBEAT: "game:heartbeat",

  QUESTION_ASK: "question:ask",
  QUESTION_ANSWER: "question:answer",
  GUESS_SUBMIT: "guess:submit",

  // TURN_END: "turn:end",

  CHAT_SEND: "chat:send",
} as const;

export const ServerEvents = {
  ROOM_SYNC: "room:sync",

  GAME_STARTED: "game:started",
  // GAME_UPDATED: "game:updated",
  GAME_OVER: "game:over",

  CHAT_MESSAGE: "chat:message",

  AUTH: "auth",
  ERROR: "app:error",
} as const;


