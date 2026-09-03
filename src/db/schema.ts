import { defineRelations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const friendshipStatusEnum = pgEnum("friendship_status", [
  "PENDING",
  "ACCEPTED",
  "DECLINED",
]);

export const gameResultEnum = pgEnum("game_result", [
  "WIN",
  "LOSS",
  "DRAW",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  image: text("image"),

  isAnonymous: boolean("is_anonymous").default(false),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    expiresAt: timestamp("expires_at")
      .notNull(),

    token: text("token")
      .notNull()
      .unique(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
  },

  (table) => [
    index("session_user_id_idx")
      .on(table.userId),
  ],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    issuer: text("issuer")
      .notNull(),

    accountId: text("account_id")
      .notNull(),

    providerId: text("provider_id")
      .notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    accessToken: text("access_token"),

    refreshToken: text("refresh_token"),

    idToken: text("id_token"),

    accessTokenExpiresAt: timestamp(
      "access_token_expires_at",
    ),

    refreshTokenExpiresAt: timestamp(
      "refresh_token_expires_at",
    ),

    scope: text("scope"),

    password: text("password"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    uniqueIndex("account_issuer_account_id_uidx")
      .on(table.issuer, table.accountId),

    index("account_user_id_idx")
      .on(table.userId),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier")
      .notNull(),

    value: text("value")
      .notNull(),

    expiresAt: timestamp("expires_at")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    index("verification_identifier_idx")
      .on(table.identifier),
  ],
);

export const userSettings = pgTable("user_settings", {
  id: text("id")
    .primaryKey(),

  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  hideName: boolean("hide_name")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const friendship = pgTable(
  "friendship",
  {
    id: text("id")
      .primaryKey(),

    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    receiverId: text("receiver_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    status: friendshipStatusEnum("status")
      .default("PENDING")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },

  (table) => [
    uniqueIndex("friendship_requester_receiver_uidx")
      .on(table.requesterId, table.receiverId),

    index("friendship_requester_idx")
      .on(table.requesterId, table.status),

    index("friendship_receiver_idx")
      .on(table.receiverId, table.status),
  ],
);

export const game = pgTable(
  "game",
  {
    id: text("id")
      .primaryKey(),

    mode: text("mode")
      .notNull(),

    startedAt: timestamp("started_at")
      .notNull(),

    endedAt: timestamp("ended_at"),

    winnerId: text("winner_id")
      .references(() => user.id),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("game_created_at_idx")
      .on(table.createdAt),

    index("game_winner_id_idx")
      .on(table.winnerId),
  ],
);

export const gamePlayer = pgTable(
  "game_player",
  {
    id: text("id")
      .primaryKey(),

    gameId: text("game_id")
      .notNull()
      .references(() => game.id, {
        onDelete: "cascade",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    result: gameResultEnum("result")
      .notNull(),

    agent: text("agent"),

    questionsAsked: integer("questions_asked")
      .default(0)
      .notNull(),

    nosUsed: integer("nos_used")
      .default(0)
      .notNull(),

    guessedCorrect: boolean("guessed_correct")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },

  (table) => [
    uniqueIndex("game_player_game_user_uidx")
      .on(table.gameId, table.userId),

    index("game_player_user_created_idx")
      .on(table.userId, table.createdAt),
  ],
);

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

export const schema = {
  user,
  session,
  verification,
  account,
  friendship,
  userSettings,
  game,
  gamePlayer,
}