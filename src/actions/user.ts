"use server";

import z from "zod";
import { eq } from "drizzle-orm";
import { headers as getHeaders } from "next/headers";

import { db, user } from "@/db";
import { auth } from "@/lib/auth";
import { welcomeSchema } from "@/schemas/welcomeSchema";

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

    const existing = await getUserById(currUser.id);

    const updates: {
      name: string;
      username: string;
      nameUpdatedAt?: Date;
      usernameUpdatedAt?: Date;
    } = {
      name: nextName,
      username: nextUsername,
    };

    if (!existing?.nameUpdatedAt || existing.name !== nextName) {
      updates.nameUpdatedAt = new Date();
    }
    if (!existing?.usernameUpdatedAt || existing.username !== nextUsername) {
      updates.usernameUpdatedAt = new Date();
    }

    await auth.api.updateUser({
      body: updates,
      headers,
    });
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    return { success: false, error: "Failed to update user" };
  }
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

    await auth.api.updateUser({
      body: {
        ...(banner !== undefined ? { banner } : {}),
        ...(tagline !== undefined ? { tagline } : {}),
      },
      headers,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    return { success: false, error: "Failed to update user profile" };
  }
}

export async function getUserById(userId: string) {
  const userData = await db.select().from(user).where(eq(user.id, userId));
  return userData[0] || null;
}
