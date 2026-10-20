import * as z from "zod";

export const uploadAvatar = z.object({
  file: z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file.size > 0, "File cannot be empty")
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type),
      "Only .jpg, .png, .webp, and .avif formats are supported"
    ),
});

export type UploadAvatar = z.infer<typeof uploadAvatar>;