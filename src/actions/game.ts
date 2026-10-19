"use server";

import { headers as getHeaders } from "next/headers";
import { auth } from "@/lib/auth";
import { getPlayerGameHistory } from "@/services/game";

export interface MatchHistoryCursor {
  endedAt: string;
  gameId: string;
}

export async function getMatchHistoryAction(
  cursor?: MatchHistoryCursor,
  limit = 10,
) {
  try {
    const headers = await getHeaders();
    const session = await auth.api.getSession({ headers });
    const currUser = session?.user;

    if (!currUser?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const parsedCursor = cursor
      ? {
          endedAt: new Date(cursor.endedAt),
          gameId: cursor.gameId,
        }
      : undefined;

    const data = await getPlayerGameHistory(currUser.id, limit, parsedCursor);

    // Format dates to ISO strings for safe serialization across server-client boundary
    const serializedItems = data.items.map((item) => ({
      ...item,
      startedAt: item.startedAt ? new Date(item.startedAt).toISOString() : null,
      endedAt: item.endedAt ? new Date(item.endedAt).toISOString() : null,
    }));

    const serializedNextCursor: MatchHistoryCursor | null =
      data.nextCursor && data.nextCursor.endedAt
        ? {
            endedAt: new Date(data.nextCursor.endedAt).toISOString(),
            gameId: data.nextCursor.gameId,
          }
        : null;

    return {
      success: true,
      data: {
        items: serializedItems,
        nextCursor: serializedNextCursor,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to fetch match history",
    };
  }
}

export async function revalidateMatchHistoryAction() {
  try {
    const headers = await getHeaders();
    const session = await auth.api.getSession({ headers });
    const currUser = session?.user;
    if (currUser?.id) {
      const { updateTag } = await import("next/cache");
      updateTag(`user-match-history-${currUser.id}`);
      return { success: true };
    }
    return { success: false, error: "Unauthorized" };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

