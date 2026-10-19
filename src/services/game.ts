import { db } from "@/db";
import { cacheLife, cacheTag } from "next/cache";

interface HistoryCursor {
  endedAt: Date;
  gameId: string;
}

export async function getPlayerGameHistory(
  userId: string,
  limit = 20,
  cursor?: HistoryCursor,
) {
  "use cache";
  cacheTag("match-history", `user-match-history-${userId}`);
  cacheLife("minutes");

  const pageSize = Math.min(Math.max(limit, 1), 50);

  const rows = await db.query.game.findMany({
    where: cursor
      ? {
          AND: [
            { players: { userId } },
            {
              OR: [
                { endedAt: { lt: cursor.endedAt } },
                {
                  AND: [
                    { endedAt: { eq: cursor.endedAt } },
                    { id: { lt: cursor.gameId } },
                  ],
                },
              ],
            },
          ],
        }
      : {
          players: { userId },
        },

    columns: {
      id: true,
      mode: true,
      startedAt: true,
      endedAt: true,
      summary: true,
    },

    with: {
      players: {
        columns: {
          userId: true,
          name: true,
          image: true,
          outcome: true,
          placement: true,
          score: true,
          details: true,
          teamId: true,
        },
      },

      teams: {
        columns: {
          id: true,
          name: true,
          outcome: true,
          placement: true,
        },
      },
    },

    orderBy: (game, { desc }) => [desc(game.endedAt), desc(game.id)],

    limit: pageSize + 1,
  });

  const hasMore = rows.length > pageSize;
  const items = rows.slice(0, pageSize);
  const last = items.at(-1);

  const data = {
    items,
    nextCursor:
      hasMore && last
        ? {
            endedAt: last.endedAt,
            gameId: last.id,
          }
        : null,
  };

  return data;
}