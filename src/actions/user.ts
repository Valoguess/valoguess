"use server";

import { db, user } from "@/db";
import { auth } from "@/lib/auth";
import { welcomeSchema } from "@/schemas/welcomeSchema"
import { eq } from "drizzle-orm";
import z from "zod";


export async function updateUser(formData: z.infer<typeof welcomeSchema>) {
  const session = await auth.api.getSession()
  const currUser = session?.user;

  if (!currUser) {
    throw new Error("User not authenticated");
  }

  const updatedUser = await db.update(user)
    .set({
      name: formData.name,
      username: formData.username,
    })
    .where(eq(user.id, currUser.id))
    .returning();

  return updatedUser;
}

export async function getUserById(userId: string) {
  const userData = await db.select().from(user).where(eq(user.id, userId));
  return userData[0] || null;
}