import { and, eq, sql } from "drizzle-orm";
import { db, game, gamePlayer, user, userSettings } from "@/db";

export async function migrateAnonUser(guestId: string, userId: string) {
  await db.transaction(async (tx) => {
    const [permanentSettings] = await tx
      .select({ userId: userSettings.userId })
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (permanentSettings) {
      await tx.delete(userSettings).where(eq(userSettings.userId, guestId));
    } else {
      await tx
        .update(userSettings)
        .set({ userId })
        .where(eq(userSettings.userId, guestId));
    }

    await tx
      .update(game)
      .set({ hostId: userId })
      .where(eq(game.hostId, guestId));

    const guestGames = await tx
      .select({ gameId: gamePlayer.gameId })
      .from(gamePlayer)
      .where(eq(gamePlayer.userId, guestId));

    for (const { gameId } of guestGames) {
      const [existingParticipation] = await tx
        .select({ gameId: gamePlayer.gameId })
        .from(gamePlayer)
        .where(
          and(eq(gamePlayer.gameId, gameId), eq(gamePlayer.userId, userId)),
        )
        .limit(1);

      if (existingParticipation) {
        await tx
          .delete(gamePlayer)
          .where(
            and(eq(gamePlayer.gameId, gameId), eq(gamePlayer.userId, guestId)),
          );
      } else {
        await tx
          .update(gamePlayer)
          .set({ userId })
          .where(
            and(eq(gamePlayer.gameId, gameId), eq(gamePlayer.userId, guestId)),
          );
      }
    }

    await tx
      .update(game)
      .set({
        summary: sql`
          jsonb_set(
            ${game.summary},
            '{winnerID}',
            to_jsonb(${userId}::text),
            false
          )
        `,
      })
      .where(sql`${game.summary}->>'winnerID' = ${guestId}`);

    await tx.delete(user).where(eq(user.id, guestId));
  });
}
