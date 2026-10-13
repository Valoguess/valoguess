"use server";

import z from "zod";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db, user } from "@/db";
import { auth } from "@/lib/auth";
import { welcomeSchema } from "@/schemas/welcomeSchema";

import {
  UpdateProfileSchema,
  updateProfileSchema,
} from "@/schemas/updateProfile";

export async function updateUser(formData: z.infer<typeof welcomeSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  if (currUser)

  try {
    const { username, name } = welcomeSchema.parse(formData);

    const updatedUser = await db
      .update(user)
      .set({ name, username })
      .where(eq(user.id, currUser.id))
      .returning();
  
    return updatedUser;
  } catch (error) {
    if (error instanceof z.ZodError) { 
      throw new Error("Invalid input data");
    } else {
      throw new Error("Failed to update user");
    }
  }
}

export async function updateUserProfile(formData: UpdateProfileSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  try {
    const { banner, tagline } = updateProfileSchema.parse(formData);

    const updatedUser = await db
      .update(user)
      .set({ banner, tagline })
      .where(eq(user.id, currUser.id))
      .returning();

    return updatedUser;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input data");
    } else {
      throw new Error("Failed to update user profile");
    }
  }
}

export async function getUserById(userId: string) {
  const userData = await db.select().from(user).where(eq(user.id, userId));
  return userData[0] || null;
}