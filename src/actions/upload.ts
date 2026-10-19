"use server";

import { auth } from "@/lib/auth";
import { db, user } from "@/db";
import { eq } from "drizzle-orm";
import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { attempt } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

const MAX_SIZE = 5 * 1024 * 1024;

const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  const publicIdWithExtension = parts[1].replace(/^v\d+\//, '');

  const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
  
  return publicId;
};

async function deleteImageByUrl(url: string) {
  try {
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      return;
    }
    
    // Delete the asset from Cloudinary
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    logger.warn({ err, url }, "Failed to delete old image from Cloudinary");
  }
}


export async function uploadUserAvatar(formData: FormData) {
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currUser = session?.user;
  
  if (!currUser) {
    throw new Error("User not authenticated");
  }
  const result = await attempt(
    `ratelimit:nextjs:uploadUserAvatar:${currUser.id}`,
    {maxRequests: 5, windowSeconds: 60},
  );

  if (!result.allowed) {
    return { success: false, error: "Too many requests" };
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

    updateTag("users");
    updateTag(`user-${userId}`);

    return {
      success: true,
      url: secureUrl,
    };
  } catch (err) {
    logger.error({ err, userId }, "Failed to upload avatar");
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

  if (!currUser.image) { 
    return {
      success: true
    }
  }

  await deleteImageByUrl(currUser.image);

  await db
    .update(user)
    .set({ image: null })
    .where(eq(user.id, currUser.id));

  updateTag("users");
  updateTag(`user-${currUser.id}`);

  return {
    success: true,
  };  
}
