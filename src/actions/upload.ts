"use server";

import { auth } from "@/lib/auth";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";
import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";

const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadUserAvatar(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  const userId = currUser.id;

  const file = formData.get("avatar") as File;

  if (!file || file.size === 0) {
    return {
      success: false,
      error: "No image file provided",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "Only image files are allowed",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: "Image must be smaller than 5 MB",
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "valoguess/users_avatars",
          public_id: `${userId}_avatar`,
          overwrite: true,
          invalidate: true, // Forces Cloudinary CDN to clear caches instantly
          resource_type: "image",
          transformation: [
            {
              width: 500,
              height: 500,
              crop: "fill",
              gravity: "center",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary returned no result"));
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const secureUrl = result.secure_url;

    // Persist new avatar in database
    await db
      .update(user)
      .set({ image: secureUrl })
      .where(eq(user.id, userId));

    return {
      success: true,
      url: secureUrl,
    };
  } catch (error) {
    console.error("User avatar upload failed:", error);
    return {
      success: false,
      error: "Failed to upload avatar",
    };
  }
}

export async function removeUserAvatar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  await db
    .update(user)
    .set({ image: null })
    .where(eq(user.id, currUser.id));

  return {
    success: true,
  };
}
