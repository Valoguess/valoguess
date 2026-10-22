"use server";

import z from "zod";
import { eq } from "drizzle-orm";
import { headers as getHeaders } from "next/headers";
import { cacheLife, cacheTag, updateTag } from "next/cache";

import { db, user } from "@/db";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { welcomeSchema } from "@/schemas/welcomeSchema";
import { attempt } from "@/lib/rateLimit";
import { uploadAvatar } from "@/schemas/uploadAvatar";
import { deleteImageByUrl, uploadAvatarToCloudinary } from "@/lib/cloudinary";

import {
  UpdateProfileSchema,
  updateProfileSchema,
} from "@/schemas/updateProfile";

export async function updateUser(formData: z.infer<typeof welcomeSchema>) {
  const headers = await getHeaders();
  const session = await auth.api.getSession({ headers });
  const currUser = session?.user;

  if (!currUser) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const { username: nextUsername, name: nextName } =
      welcomeSchema.parse(formData);

    if (!nextName && !nextUsername) {
      return { success: false, error: "No data to update" };
    }

    const existing = await getUserById(currUser.id);

    if (!existing) {
      return { success: false, error: "User not found" };
    }

    const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();

    const canUpdate = (lastUpdatedAt: Date | null | undefined) =>
      !lastUpdatedAt ||
      now.getTime() - new Date(lastUpdatedAt).getTime() >= COOLDOWN_MS;

    const updates: {
      name?: string;
      username?: string;
      nameUpdatedAt?: Date;
      usernameUpdatedAt?: Date;
    } = {};

    if (nextName && nextName !== existing.name) {
      if (!canUpdate(existing.nameUpdatedAt)) {
        return {
          success: false,
          error: "You can change your name only once every 30 days",
        };
      }

      updates.name = nextName;
      updates.nameUpdatedAt = now;
    }

    if (nextUsername && nextUsername !== existing.username) {
      if (!canUpdate(existing.usernameUpdatedAt)) {
        return {
          success: false,
          error: "You can change your username only once every 30 days",
        };
      }

      updates.username = nextUsername;
      updates.usernameUpdatedAt = now;
    }

    if (Object.keys(updates).length === 0) {
      return { success: true };
    }

    await auth.api.updateUser({
      body: updates,
      headers,
    });

    updateTag("users");
    updateTag(`user-${currUser.id}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    logger.error({ err: error, userId: currUser.id }, "Failed to update user");

    return {
      success: false,
      error: "Failed to update user",
    };
  }
}

export async function uploadUserAvatar(formData: FormData) {
  const headers = await getHeaders();

  const session = await auth.api.getSession({
    headers,
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }
  const result = await attempt(
    `ratelimit:nextjs:uploadUserAvatar:${currUser.id}`,
    { maxRequests: 5, windowSeconds: 60 },
  );

  if (!result.allowed) {
    return { success: false, error: "Too many requests" };
  }

  const userId = currUser.id;

  try {
    const rawfileData = formData.get("avatar") as File;
    const { file } = uploadAvatar.parse({ file: rawfileData });

    const secureUrl = await uploadAvatarToCloudinary(file, userId);

    await auth.api.updateUser({
      body: { image: secureUrl },
      headers: await getHeaders(),
    });

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
  const headers = await getHeaders();

  const session = await auth.api.getSession({
    headers,
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  if (!currUser.image) {
    return {
      success: true,
    };
  }

  await deleteImageByUrl(currUser.image);

  await auth.api.updateUser({
    body: { image: null },
    headers,
  });

  updateTag("users");
  updateTag(`user-${currUser.id}`);

  return {
    success: true,
  };
}

export async function updateUserProfile(formData: UpdateProfileSchema) {
  const headers = await getHeaders();
  const session = await auth.api.getSession({ headers });
  const currUser = session?.user;

  if (!currUser) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const { banner, tagline } = updateProfileSchema.parse(formData);
    
    if (!banner && !tagline) {
      return { success: true };
    }

    await auth.api.updateUser({
      body: {
        ...(banner !== undefined && { banner }),
        ...(tagline !== undefined && { tagline }),
      },
      headers,
    });

    updateTag("users");
    updateTag(`user-${currUser.id}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    logger.error(
      { err: error, userId: currUser.id },
      "Failed to update user profile",
    );
    return { success: false, error: "Failed to update user profile" };
  }
}

export async function getUserById(userId: string) {
  "use cache";
  cacheTag("users", `user-${userId}`);
  cacheLife("hours");

  const userData = await db.select().from(user).where(eq(user.id, userId));
  return userData[0] || null;
}
