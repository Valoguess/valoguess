import { db, friendship } from "@/db";
import { eq, or, and } from "drizzle-orm";

export async function getFriendship(requesterId: string, receiverId: string) {
  const friendshipData = await db
    .select()
    .from(friendship)
    .where(
      or(
        and(
          eq(friendship.requesterId, requesterId),
          eq(friendship.receiverId, receiverId)
        ),
        and(
          eq(friendship.requesterId, receiverId),
          eq(friendship.receiverId, requesterId)
        )
      )
    );
  return friendshipData[0] || null;
}

export async function getFriendships(userId: string) {
  if (!userId) return [];

  const friendships = await db.query.friendship.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { receiverId: userId },
      ],
    },
    with: {
      requester: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      receiver: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return friendships;
}

export async function sendFriendRequest(requesterId: string, receiverId: string) {
  const existing = await getFriendship(requesterId, receiverId);
  if (existing) {
    if (existing.status === "DECLINED") {
      const updated = await db
        .update(friendship)
        .set({
          status: "PENDING",
          requesterId,
          receiverId,
        })
        .where(eq(friendship.id, existing.id))
        .returning();
      return updated[0];
    }
    return existing;
  }

  const inserted = await db
    .insert(friendship)
    .values({
      requesterId,
      receiverId,
      status: "PENDING",
    })
    .returning();
  return inserted[0];
}

export async function updateFriendshipStatus(
  friendshipId: string,
  status: "PENDING" | "ACCEPTED" | "DECLINED"
) {
  const updated = await db
    .update(friendship)
    .set({ status })
    .where(eq(friendship.id, friendshipId))
    .returning();
  return updated[0];
}

export async function deleteFriendship(friendshipId: string) {
  const deleted = await db
    .delete(friendship)
    .where(eq(friendship.id, friendshipId))
    .returning();
  return deleted[0];
}