import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins"

import { db } from "@/db";
import { schema } from "@/db/schema";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { 
    provider: "pg",
    schema
  }),
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  },
  plugins: [
    anonymous()
  ],
});