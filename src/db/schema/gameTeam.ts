import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { game } from "./game";
import { sql } from "drizzle-orm";

export const gameOutcomeEnum = pgEnum("game_outcome", ["WIN", "LOSS", "DRAW"]);

export const gameTeam = pgTable(
  "game_team",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),

    gameId: uuid("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),

    name: text("name").notNull(),

    outcome: gameOutcomeEnum("outcome"),

    // 1 = first place, 2 = second, etc.
    placement: integer("placement"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("game_team_game_idx").on(table.gameId),
    uniqueIndex("game_team_id_game_uidx").on(table.id, table.gameId),
  ],
);
