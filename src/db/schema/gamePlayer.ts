import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  uuid,
  index,
  uniqueIndex,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { game } from "./game";

export const gamePlayerOutcomeEnum = pgEnum("game_player_outcome", [
  "WIN",
  "LOSS",
  "DRAW",
]);

export const gamePlayer = pgTable(
  "game_player",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),

    gameId: uuid("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id),

    name: text("name").notNull(),

    tagline: text("tagline"),
    image: text("image"),
    banner: text("banner"),

    // Null for solo/individual matches.
    teamId: uuid("team_id"),

    outcome: gamePlayerOutcomeEnum("outcome"),

    // Individual ranking, if applicable.
    placement: integer("placement"),

    // Optional score for ranked or score-based modes.
    score: integer("score"),

    // Agent, role, questions asked, Nos used, etc.
    details: jsonb("details").$type<Record<string, unknown>>().notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("game_player_game_user_uidx").on(table.gameId, table.userId),
    index("game_player_user_created_idx").on(table.userId, table.createdAt),
    index("game_player_team_idx").on(table.teamId),
  ],
);
