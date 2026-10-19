import * as z from "zod";

const envSchema = z.object({
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

  NEXT_PUBLIC_SOCKET_SERVER_URL: z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;
let ENV: EnvConfig;

const isBrowser = typeof window !== "undefined";

if (process.env.SKIP_ENV_VALIDATION === "true" || isBrowser) {
  if (!isBrowser) {
    console.warn("Skipping environment variable validation");
  }

  ENV = {
    ...process.env,
    NEXT_PUBLIC_SOCKET_SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!,
  } as unknown as EnvConfig;
}
else {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      z.prettifyError(parsed.error),
    );

    process.exit(1);
  }

  ENV = parsed.data;
}

export default ENV;
