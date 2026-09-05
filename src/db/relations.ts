import { defineRelations } from "drizzle-orm";
import {
  user,
  session,
  account,
  friendship,
  userSettings,
  game,
  gamePlayer,
} from ".";


export const relations = defineRelations(
  {
    user,
    session,
    account,
    friendship,
    userSettings,
    game,
    gamePlayer,
  },

  (r) => ({

    user: {
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),

      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),

      settings: r.one.userSettings({
        from: r.user.id,
        to: r.userSettings.userId,
      }),

      sentFriendRequests: r.many.friendship({
        from: r.user.id,
        to: r.friendship.receiverId,
      }),

      receivedFriendRequests: r.many.friendship({
        from: r.user.id,
        to: r.friendship.receiverId,
      }),

      games: r.many.gamePlayer({
        from: r.user.id,
        to: r.gamePlayer.userId,
      }),
    },

    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },

    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },

    userSettings: {
      user: r.one.user({
        from: r.userSettings.userId,
        to: r.user.id,
      }),
    },

    friendship: {
      requester: r.one.user({
        from: r.friendship.receiverId,
        to: r.user.id,
      }),

      receiver: r.one.user({
        from: r.friendship.receiverId,
        to: r.user.id,
      }),
    },

    game: {
      players: r.many.gamePlayer({
        from: r.game.id,
        to: r.gamePlayer.gameId,
      }),

      winner: r.one.user({
        from: r.game.winnerId,
        to: r.user.id,
      }),
    },

    gamePlayer: {
      game: r.one.game({
        from: r.gamePlayer.gameId,
        to: r.game.id,
      }),

      user: r.one.user({
        from: r.gamePlayer.userId,
        to: r.user.id,
      }),
    },
  }),
);