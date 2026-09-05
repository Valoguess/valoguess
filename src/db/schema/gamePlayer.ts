import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { game } from "./game";

export const gameResultEnum = pgEnum("game_result", [
  "WIN",
  "LOSS",
  "DRAW",
]);

export const gamePlayer = pgTable(
  "game_player",
  {
    id: text("id")
      .primaryKey(),

    gameId: text("game_id")
      .notNull()
      .references(() => game.id, {
        onDelete: "cascade",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    result: gameResultEnum("result")
      .notNull(),

    agent: text("agent"),

    questionsAsked: integer("questions_asked")
      .default(0)
      .notNull(),

    nosUsed: integer("nos_used")
      .default(0)
      .notNull(),

    guessedCorrect: boolean("guessed_correct")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },

  (table) => [
    uniqueIndex("game_player_game_user_uidx")
      .on(table.gameId, table.userId),

    index("game_player_user_created_idx")
      .on(table.userId, table.createdAt),
  ],
);