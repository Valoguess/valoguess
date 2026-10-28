import * as z from "zod";

export const welcomeSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(16, "Username must not exceed 16 characters")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Username can only contain letters, numbers, underscores, hyphens, and dots"
    ).optional(),
  name: z
    .string()
    .min(2, "Display name must be at least 2 characters long")
    .max(16, "Display name must not exceed 16 characters")
    .optional(),
});