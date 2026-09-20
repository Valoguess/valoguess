import { pgTable } from "drizzle-orm/pg-core";
import { text, timestamp } from "drizzle-orm/pg-core";

export const jwks = pgTable("jwks", {
  id: text("id").primaryKey(),
  
  publicKey: text("public_key").notNull(),
  
  privateKey: text("private_key").notNull(),
  
  createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),
  
  expiresAt: timestamp("expires_at", { precision: 6, withTimezone: true }),

  alg: text("alg"),
  crv: text("crv"),
});