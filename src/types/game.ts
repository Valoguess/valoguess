export interface Settings {
  maxNos: number;
  timePerRound: number;
  maxGuesses: number;
  questionCount: number;
  maxRounds?: number;
}

export const DefaultSettings: Settings = {
  maxNos: 5,
  timePerRound: -1,
  maxGuesses: 1,
  questionCount: 15,
};

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

export interface GameState {
  startedAt: number;
  turnNumber: number;
  turnEndTime?: number | null;

  questionPool: string[];
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

  settings: Settings;
  createdAt: number;

  game?: GameState;
}

export interface PendingQuestion {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
}

export interface QuestionHistory {
  askedBy: string;
  targetPlayer: string;
  questionId: string;
  answer: "yes" | "no";
  timestamp: number;
}
