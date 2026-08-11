export interface Settings {
  maxNos: number;
  maxRounds: number;
  timePerRound: number;
}

export const DefaultSettings: Settings = {
  maxNos: 5,
  maxRounds: -1,
  timePerRound: 60,
}

export interface Spectator {
  id: string;
  username: string;
  // socketId: string;
}

export type RoomState = "waiting" | "playing" | "finished";

export interface RoomPlayer {
  id: string;
  username: string;
}

export interface PlayerGameState {
  isMyTurn: boolean;

  secretAgent: string | null;
  guess: string | null;

  nosRemaining: number;
  guessesRemaining: number;
}

export interface Player {
  player: RoomPlayer;
  state: PlayerGameState;
}

export interface RoomSpectator {
  id: string;
  username: string;
}

export interface GameState {
  startedAt: number;
  turnNumber: number;
  turnEndTime?: number;

  pendingQuestion?: PendingQuestion | undefined;
  history: QuestionHistory[];

  winnerId?: string | undefined;
  endedAt?: number | undefined;
}


export interface Room {
  id: string;
  state: RoomState;
  hostId: string;

  me: Player;
  opponent?: Player;

  spectators: RoomSpectator[];

  settings: Settings;
  createdAt: number;

  game?: GameState;
}

export interface PendingQuestion {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
  // questionLabel: string;
}

export interface QuestionHistory {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
  answer: "yes" | "no";
  timestamp: number;
}

