import {
  pgTable,
  text,
  timestamp,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const session = pgTable("session", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  
  token: varchar("token", { length: 255 })
    .notNull()
    .unique(),
  
  expiresAt: timestamp("expires_at", { precision: 6, withTimezone: true })
    .notNull(),

  ipAddress: text("ip_address"),

  userAgent: text("user_agent"),

  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  
}, (table) => [
  index("session_userId_idx")
    .on(table.userId),
]);
