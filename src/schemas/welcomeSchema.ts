import * as z from "zod";

export const welcomeSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Username can only contain letters, numbers, underscores, hyphens, and dots"
    ),
  name: z
    .string()
    .min(2, "Display name must be at least 2 characters long")
    .max(30, "Display name must not exceed 30 characters"),
});