import {
  pgTable,
  text,
  timestamp,
  index,
  uniqueIndex,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const friendshipStatusEnum = pgEnum("friendship_status", [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
]);

export const friendship = pgTable("friendship", {
  id: uuid("id").primaryKey()
    .defaultRandom(),

  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  receiverId: text("receiver_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  status: friendshipStatusEnum("status")
    .default("PENDING")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  
}, (table) => [
  uniqueIndex("friendship_requester_receiver_uidx")
    .on(table.receiverId, table.receiverId),

  index("friendship_requester_idx")
    .on(table.receiverId, table.status),

  index("friendship_receiver_idx")
    .on(table.receiverId, table.status),
]);
