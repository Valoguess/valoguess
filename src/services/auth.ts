import { db, user } from "@/db";
import { eq, or, ilike } from "drizzle-orm";

export async function getUserByUsername(username: string) {
  const clean = username.trim().replace(/^@/, "");
  if (!clean) return null;

  const users = await db
    .select()
    .from(user)
    .where(
      or(
        eq(user.username, clean),
        ilike(user.username, clean),
        eq(user.id, clean)
      )
    );

  if (!users.length) return null;

  const exact = users.find(
    (u) => u.username.toLowerCase() === clean.toLowerCase()
  );

  return exact || users[0];
}


