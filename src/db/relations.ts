import { defineRelations } from "drizzle-orm";
import {
  user,
  session,
  account,
  friendship,
  userSettings,
  game,
  gamePlayer,
  gameTeam,
  gameAward
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
    gameTeam,
    gameAward
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
        to: r.friendship.requesterId,
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
        from: r.friendship.requesterId,
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
 
      teams: r.many.gameTeam({
        from: r.game.id,
        to: r.gameTeam.gameId,
      }),
 
      awards: r.many.gameAward({
        from: r.game.id,
        to: r.gameAward.gameId,
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

      team: r.one.gameTeam({
        from: r.gamePlayer.teamId,
        to: r.gameTeam.id,
      }),

      awards: r.many.gameAward({
        from: r.gamePlayer.userId,
        to: r.gameAward.recipientUserId,
      }),
    },

    gameTeam: {
      game: r.one.game({
        from: r.gameTeam.gameId,
        to: r.game.id,
      }),

      players: r.many.gamePlayer({
        from: r.gameTeam.id,
        to: r.gamePlayer.teamId,
      }),

      awards: r.many.gameAward({
        from: r.gameTeam.id,
        to: r.gameAward.recipientTeamId,
      }),
    }
  }),
);