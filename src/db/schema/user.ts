import {
  pgTable,
  text,
  timestamp,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  
  username: varchar("username", { length: 255 })
    .notNull()
    .unique(),  
    
  name: text("name")
    .notNull(),
    
  usernameUpdatedAt: timestamp("username_updated_at", { precision: 6, withTimezone: true }),
  nameUpdatedAt: timestamp("name_updated_at", { precision: 6, withTimezone: true }),
  
  email: varchar("email", { length: 255 }).notNull().unique(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  tagline: text("tagline").default("New Player"),
  image: text("image"),
  banner: text("banner"),

  isAnonymous: boolean("is_anonymous").default(false),

  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type User = typeof user.$inferSelect;