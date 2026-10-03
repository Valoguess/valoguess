export type GuessAgentQuestionMode = "PRESET" | "FREEFORM";

export interface GuessAgentSettings {
  questionMode: GuessAgentQuestionMode;
  maxNos: number;
  maxGuesses: number;
  questionCount: number;
  timePerRound: number;
  maxRounds?: number;
  questionPool?: string[];
}

export const DefaultGuessAgentSettings: GuessAgentSettings = {
  questionMode: "PRESET",
  maxNos: 5,
  maxGuesses: 1,
  questionCount: 15,
  timePerRound: -1,
};

// Alias for backwards compatibility
export type Settings = GuessAgentSettings;
export const DefaultSettings = DefaultGuessAgentSettings;

export type GameStatus = "WAITING" | "PLAYING" | "FINISHED";
export type RoomState = "waiting" | "playing" | "finished";

export interface GuessAgentPrivateStateDTO {
  isMyTurn: boolean;
  secretAgent: string | null;
  guess: string | null;
  nosRemaining: number;
  guessesRemaining: number;
}

export interface GuessAgentPlayerDTO {
  id: string;
  name: string;
  state?: GuessAgentPrivateStateDTO;
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
  answer: "YES" | "NO";
  timestamp: number;
}

export type GuessAgentResult =
  | {
      result: "WIN";
      winnerId: string;
    }
  | {
      result: "TIE";
      winnerId: null;
    };

export interface GuessAgentStateDTO {
  startedAt: number;
  turnNumber: number;
  currentTurn: string;
  turnEndTime: number | null;
  pendingQuestion?: PendingQuestion;
  history: QuestionHistory[];
  result?: GuessAgentResult;
  endedAt?: number;
}

export interface GuessAgentGameDTO {
  id: string;
  status: GameStatus;
  players: GuessAgentPlayerDTO[];
  settings: GuessAgentSettings;
  state?: GuessAgentStateDTO;

  // Flattened fallbacks for resilience
  startedAt?: number;
  turnNumber?: number;
  currentTurn?: string;
  turnEndTime?: number | null;
  pendingQuestion?: PendingQuestion;
  history?: QuestionHistory[];
  result?: GuessAgentResult;
  endedAt?: number;
}

export type GameDTO = GuessAgentGameDTO;

// Compatibility types for legacy room-based code
export interface RoomPlayer {
  id: string;
  name: string;
  username?: string;
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
