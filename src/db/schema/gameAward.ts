import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

import { game } from "./game";
import { user } from "./user";
import { gameTeam } from "./gameTeam";

export const gameAwardTypeEnum = pgEnum("game_award_type", [
  "MATCH_MVP",
  "TEAM_MVP",
  "BEST_DEDUCER",
  "MOST_QUESTIONS",
  "CUSTOM",
]);

export const gameAward = pgTable(
  "game_award",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),

    gameId: uuid("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),

    type: gameAwardTypeEnum("type").notNull(),

    // At least one recipient can be set.
    // Both null can represent a match-wide accolade.
    recipientUserId: text("recipient_user_id").references(() => user.id),

    recipientTeamId: uuid("recipient_team_id").references(() => gameTeam.id),

    title: text("title").notNull(),

    description: text("description").notNull(),

    // Optional supporting stats, e.g. { questionsAsked: 8 }.
    details: jsonb("details").$type<Record<string, unknown>>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("game_award_game_idx").on(table.gameId),
    index("game_award_user_idx").on(table.recipientUserId),
  ],
);
