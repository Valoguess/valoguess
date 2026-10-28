import * as z from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(16, "Username must not exceed 16 characters")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Username can only contain letters, numbers, underscores, hyphens, and dots",
  )
  .optional();
