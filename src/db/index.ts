import { drizzle } from 'drizzle-orm/node-postgres';

import { jwks } from "./schema/jwks";
import { game } from "./schema/game";
import { user } from "./schema/user";
import { account } from "./schema/account";
import { session } from "./schema/session";
import { userSettings } from "./schema/userSettings";
import { verification } from "./schema/verification";
import { gamePlayer, gameResultEnum } from "./schema/gamePlayer";
import { friendship, friendshipStatusEnum } from "./schema/friendship";

import { relations } from "./relations";


export const db = drizzle(process.env.DATABASE_URL!, { relations });

export const schema = {
  user,
  account,
  userSettings,
  session,
  verification,
  friendship,
  friendshipStatusEnum,
  game,
  gamePlayer,
  gameResultEnum,
  jwks
}

export {
  user,
  account,
  userSettings,
  session,
  verification,
  friendship,
  friendshipStatusEnum,
  game,
  gamePlayer,
  gameResultEnum,
  jwks
}