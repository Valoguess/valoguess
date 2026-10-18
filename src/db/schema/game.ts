import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  index,
  uuid,
  pgEnum,
  jsonb,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const gameModeEnum = pgEnum("game_mode", [
  "GUESS_AGENT",
  "IMPOSTER",
  "CODENAMES",
]);

export const game = pgTable(
  "game",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),

    mode: gameModeEnum("mode").notNull(),

    hostId: text("host_id")
      .notNull()
      .references(() => user.id),
    
    settings: jsonb("settings").$type<Record<string, unknown>>().notNull(),

    summary: jsonb("summary").$type<Record<string, unknown>>(),

    startedAt: timestamp("started_at"),

    endedAt: timestamp("ended_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("game_created_at_idx").on(table.createdAt),
    index("game_mode_ended_at_idx").on(table.mode, table.endedAt),
  ],
);
