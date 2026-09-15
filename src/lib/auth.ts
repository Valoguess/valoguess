import { betterAuth } from "better-auth";
import { anonymous, username } from "better-auth/plugins"

import { db, schema } from "@/db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";

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
      mapProfileToUser: (profile) => {
        const cleanPrefix = profile.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
        const username = `${cleanPrefix}_${Math.floor(1000 + Math.random() * 9000)}`; 
        return {
          username
        }
      }
    },

  },
  plugins: [
    anonymous({
    }),
    nextCookies(),
    username({
      displayUsername: false,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          if (ctx?.path == "/sign-in/anonymous") {
            const randomValue = Math.random().toString(36).substring(2, 8);
            user.username = `guest-${randomValue}`;
            user.name = `Guest.${randomValue}`;
            user.email = `guest.${randomValue}@valoguess.fun`;
          }
        }
      }
    }
  },
  
});