import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";

export const userSettings = pgTable("user_settings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuidv7()`),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  hideName: boolean("hide_name").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
