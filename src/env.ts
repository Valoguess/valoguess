import * as z from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  REDIS_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  RESEND_API_KEY: z.string(),
  CLOUDINARY_URL: z.string(),
  DATABASE_URL: z.string(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SOCKET_SERVER_URL: z.string(),
});

// --- VALIDATION LOGIC ---
const isServer = typeof window === "undefined";

const serverParsed = isServer
  ? serverSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      REDIS_URL: process.env.REDIS_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CLOUDINARY_URL: process.env.CLOUDINARY_URL,
      DATABASE_URL: process.env.DATABASE_URL,
    })
  : null; // Skip server vars on client

const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
});

if (isServer && serverParsed && !serverParsed.success) {
  console.error(
    "❌ Invalid Server Environment Variables:\n",
    z.prettifyError(serverParsed.error),
  );
  if (isServer) process.exit(1);
}

if (!clientParsed.success) {
  console.error(
    "❌ Invalid Client Environment Variables:\n",
    z.prettifyError(clientParsed.error),
  );
  if (isServer) process.exit(1);
}

// Combine them into a single exportable object
const ENV = {
  ...(serverParsed?.data || {}),
  ...(clientParsed.data || {}),
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;

export default ENV;