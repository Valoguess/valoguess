import * as z from "zod";

export const updateProfileSchema = z.object({
  banner: z.string().optional(),
  tagline: z.string().optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;