export type GuessAgentQuestionMode = "PRESET" | "FREEFORM";

export interface GuessAgentSettings {
  questionMode: GuessAgentQuestionMode;
  maxNos: number;
  maxGuesses: number;
  questionCount: number;
  timePerRound: number;
  maxRounds?: number;
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

export type GameStatus = "WAITING" | "STARTING" | "PLAYING" | "FINISHED";
export type RoomState = "waiting" | "starting" | "playing" | "finished";

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
  startedAt?: number;
  turnNumber?: number;
  currentTurn?: string;
  turnEndTime?: number | null;
  questionPool?: string[];
  pendingQuestion?: PendingQuestion;
  history: QuestionHistory[];
  result?: GuessAgentResult;
  endedAt?: number;
}

export interface GuessAgentGameDTO {
  id: string;
  status: GameStatus;
  hostId?: string;
  createdAt?: number;
  players: GuessAgentPlayerDTO[];
  settings: GuessAgentSettings;
  state?: GuessAgentStateDTO;

  // Flattened fallbacks for resilience
  startingAt?: number;
  startingEndsAt?: number;
  startedAt?: number;
  turnNumber?: number;
  currentTurn?: string;
  turnEndTime?: number | null;
  questionPool?: string[];
  pendingQuestion?: PendingQuestion;
  history?: QuestionHistory[];
  result?: GuessAgentResult;
  endedAt?: number;
}

export type GameDTO = GuessAgentGameDTO;

