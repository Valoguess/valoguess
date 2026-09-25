"use server";

import { db, friendship } from "@/db";
import { auth } from "@/lib/auth";
import { getUserByUsername } from "@/services/auth";
import {
  getFriendships as getFriendshipsService,
  getFriendship as getFriendshipService,
} from "@/services/friendship";
import { and, eq, or } from "drizzle-orm";
import { headers } from "next/headers";

const isUuid = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function getFriendships(userId?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    const targetId = userId || currUser?.id;
    if (!targetId || currUser?.isAnonymous) {
      return [];
    }

    return await getFriendshipsService(targetId);
  } catch (err: any) {
    console.error("Error fetching friendships:", err);
    return [];
  }
}

export async function sendFriendRequest(targetUsername: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    if (!currUser) {
      return { success: false, error: "You must be signed in to send friend requests" };
    }

    if (currUser.isAnonymous) {
      return {
        success: false,
        error: "Guest accounts cannot add friends. Please link your account.",
      };
    }

    const clean = targetUsername.trim();
    if (!clean) {
      return { success: false, error: "Please enter a username" };
    }

    const targetUser = await getUserByUsername(clean);
    if (!targetUser) {
      return { success: false, error: `Player with username "${clean}" not found` };
    }

    if (targetUser.id === currUser.id) {
      return { success: false, error: "You cannot add yourself as a friend" };
    }

    if (targetUser.isAnonymous) {
      return { success: false, error: "Cannot add guest/anonymous accounts" };
    }

    const displayName = targetUser.name || targetUser.username;

    // Check existing friendship
    const existing = await getFriendshipService(currUser.id, targetUser.id);

    if (existing) {
      if (existing.status === "ACCEPTED") {
        return { success: false, error: `${displayName} is already your friend` };
      }

      if (existing.status === "PENDING") {
        if (existing.requesterId === currUser.id) {
          return {
            success: false,
            error: `Friend request to ${displayName} is already pending`,
          };
        } else {
          // The target user already sent a pending request to current user, auto-accept it!
          await db
            .update(friendship)
            .set({ status: "ACCEPTED" })
            .where(eq(friendship.id, existing.id));

          return {
            success: true,
            message: `Accepted incoming request from ${displayName}! You are now friends.`,
            receiverId: targetUser.id,
            autoAccepted: true,
          };
        }
      }

      // If status was DECLINED, reset to PENDING with current user as requester
      await db
        .update(friendship)
        .set({
          status: "PENDING",
          requesterId: currUser.id,
          receiverId: targetUser.id,
        })
        .where(eq(friendship.id, existing.id));

      return {
        success: true,
        message: `Friend request sent to ${displayName}!`,
        receiverId: targetUser.id,
      };
    }

    await db.insert(friendship).values({
      requesterId: currUser.id,
      receiverId: targetUser.id,
      status: "PENDING",
    });

    return {
      success: true,
      message: `Friend request sent to ${displayName}!`,
      receiverId: targetUser.id,
    };
  } catch (err: any) {
    console.error("Error sending friend request:", err);
    return { success: false, error: err?.message || "Failed to send friend request" };
  }
}

export async function acceptFriendRequest(targetIdOrFriendshipId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    if (!currUser) {
      return { success: false, error: "User not authenticated" };
    }

    const validUuid = isUuid(targetIdOrFriendshipId);

    const whereCondition = validUuid
      ? or(
          and(
            eq(friendship.requesterId, targetIdOrFriendshipId),
            eq(friendship.receiverId, currUser.id),
            eq(friendship.status, "PENDING")
          ),
          and(
            eq(friendship.id, targetIdOrFriendshipId),
            eq(friendship.receiverId, currUser.id),
            eq(friendship.status, "PENDING")
          )
        )
      : and(
          eq(friendship.requesterId, targetIdOrFriendshipId),
          eq(friendship.receiverId, currUser.id),
          eq(friendship.status, "PENDING")
        );

    const updated = await db
      .update(friendship)
      .set({ status: "ACCEPTED" })
      .where(whereCondition)
      .returning();

    if (!updated.length) {
      return {
        success: false,
        error: "Friend request not found or already processed",
      };
    }

    return {
      success: true,
      message: "Friend request accepted!",
      requesterId: updated[0].requesterId,
    };
  } catch (err: any) {
    console.error("Error accepting friend request:", err);
    return { success: false, error: err?.message || "Failed to accept friend request" };
  }
}

export async function declineFriendRequest(targetIdOrFriendshipId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    if (!currUser) {
      return { success: false, error: "User not authenticated" };
    }

    const validUuid = isUuid(targetIdOrFriendshipId);

    const whereCondition = validUuid
      ? or(
          and(
            eq(friendship.requesterId, targetIdOrFriendshipId),
            eq(friendship.receiverId, currUser.id),
            eq(friendship.status, "PENDING")
          ),
          and(
            eq(friendship.id, targetIdOrFriendshipId),
            eq(friendship.receiverId, currUser.id),
            eq(friendship.status, "PENDING")
          )
        )
      : and(
          eq(friendship.requesterId, targetIdOrFriendshipId),
          eq(friendship.receiverId, currUser.id),
          eq(friendship.status, "PENDING")
        );

    const updated = await db
      .update(friendship)
      .set({ status: "DECLINED" })
      .where(whereCondition)
      .returning();

    if (!updated.length) {
      return { success: false, error: "Friend request not found" };
    }

    return {
      success: true,
      message: "Friend request declined",
      requesterId: updated[0].requesterId,
    };
  } catch (err: any) {
    console.error("Error declining friend request:", err);
    return { success: false, error: err?.message || "Failed to decline friend request" };
  }
}

export async function cancelFriendRequest(targetIdOrFriendshipId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    if (!currUser) {
      return { success: false, error: "User not authenticated" };
    }

    const validUuid = isUuid(targetIdOrFriendshipId);

    const whereCondition = validUuid
      ? or(
          and(
            eq(friendship.requesterId, currUser.id),
            eq(friendship.receiverId, targetIdOrFriendshipId),
            eq(friendship.status, "PENDING")
          ),
          and(
            eq(friendship.id, targetIdOrFriendshipId),
            eq(friendship.requesterId, currUser.id),
            eq(friendship.status, "PENDING")
          )
        )
      : and(
          eq(friendship.requesterId, currUser.id),
          eq(friendship.receiverId, targetIdOrFriendshipId),
          eq(friendship.status, "PENDING")
        );

    const deleted = await db
      .delete(friendship)
      .where(whereCondition)
      .returning();

    if (!deleted.length) {
      return { success: false, error: "Friend request not found" };
    }

    return { success: true, message: "Friend request cancelled" };
  } catch (err: any) {
    console.error("Error cancelling friend request:", err);
    return { success: false, error: err?.message || "Failed to cancel friend request" };
  }
}

export async function removeFriend(targetId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const currUser = session?.user;

    if (!currUser) {
      return { success: false, error: "User not authenticated" };
    }

    const validUuid = isUuid(targetId);

    const userConditions = [
      and(eq(friendship.requesterId, targetId), eq(friendship.receiverId, currUser.id)),
      and(eq(friendship.requesterId, currUser.id), eq(friendship.receiverId, targetId)),
    ];

    if (validUuid) {
      userConditions.push(
        and(
          eq(friendship.id, targetId),
          or(
            eq(friendship.requesterId, currUser.id),
            eq(friendship.receiverId, currUser.id)
          )
        )
      );
    }

    const deleted = await db
      .delete(friendship)
      .where(and(or(...userConditions), eq(friendship.status, "ACCEPTED")))
      .returning();

    if (!deleted.length) {
      return { success: false, error: "Friendship not found" };
    }

    return { success: true, message: "Friend removed" };
  } catch (err: any) {
    console.error("Error removing friend:", err);
    return { success: false, error: err?.message || "Failed to remove friend" };
  }
}