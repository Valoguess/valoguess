import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { redisStorage } from "@better-auth/redis-storage";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { anonymous, username, jwt, magicLink } from "better-auth/plugins"

import { redis } from "./redis";
import { db, schema } from "@/db";
import { sendMagicLinkEmail } from "./resend";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  secondaryStorage: redisStorage({
		client: redis,
		keyPrefix: "better-auth:",
  }),
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    customRules: {
      "/sign-in/magic-link": {
        window: 60,
        max: 3,
      },
      "/sign-in/anonymous": {
        window: 900,
        max: 10,
      }
    }
  },
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
    magicLink({ 
      sendMagicLink: async ({ email, url }) => { 
        void sendMagicLinkEmail(email, url);
      }
    }),
    anonymous({
    }),
    username({
      displayUsername: false,
    }),
    jwt({
      jwt: {
        definePayload: ({user}) => {
          return {
            id: user.id,
            name: user.name,
            username: user.username,
          }
        }
      }
    }),
    nextCookies(),
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
          else if (ctx?.path == "/magic-link/verify") { 
            const randomValue = Math.random().toString(36).substring(2, 8);
            user.username = user.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() + `_${randomValue}`;
            user.name = user.email.split("@")[0];
          }
        }
      }
    }
  },
  
});