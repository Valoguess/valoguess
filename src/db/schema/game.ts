import {
  pgTable,
  text,
  timestamp,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const game = pgTable("game", {
  id: uuid("id").primaryKey()
    .defaultRandom(),

  mode: text("mode")
    .notNull(),

  startedAt: timestamp("started_at")
    .notNull(),

  endedAt: timestamp("ended_at"),

  winnerId: text("winner_id")
    .references(() => user.id),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  
}, (table) => [
  index("game_created_at_idx")
    .on(table.createdAt),

  index("game_winner_id_idx")
    .on(table.winnerId),
]);
