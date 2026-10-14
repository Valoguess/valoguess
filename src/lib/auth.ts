import crypto from "crypto";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { redisStorage } from "@better-auth/redis-storage";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { anonymous, username, jwt, magicLink } from "better-auth/plugins"

import ENV from "@/env";
import { redis } from "./redis";
import { db, schema } from "@/db";
import { sendMagicLinkEmail } from "./resend";

export const auth = betterAuth({
  baseURL: ENV.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  user: {
    additionalFields: {
      usernameUpdatedAt: { type: "date"},
      nameUpdatedAt: { type: "date"},
      tagline: { type: "string", defaultValue: "New Player" },
      banner: { type: "string" },
    }
  },
  secondaryStorage: redisStorage({
		client: redis,
		keyPrefix: "better-auth:",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
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
      clientId: ENV.GOOGLE_CLIENT_ID as string,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        const cleanPrefix = profile.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
        const username = `${cleanPrefix}_${crypto.randomInt(1000, 9999)}`; 
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
        expirationTime: "1h",
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
          const randomValue = crypto.randomBytes(3).toString("hex");
          
          if (ctx?.path == "/sign-in/anonymous") {
            user.username = `guest-${randomValue}`;
            user.name = `Guest.${randomValue}`;
            user.email = `guest.${randomValue}@valoguess.fun`;
          }
          else if (ctx?.path == "/magic-link/verify") { 
            const emailPrefix = user.email.split("@")[0]
            user.username = emailPrefix.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() + `_${randomValue}`;
            user.name = emailPrefix;
          }
        }
      }
    }
  },
  
});