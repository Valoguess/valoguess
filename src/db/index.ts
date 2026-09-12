import { user } from "./schema/user";
import { account } from "./schema/account";
import { userSettings } from "./schema/userSettings";
import { session } from "./schema/session";
import { verification } from "./schema/verification";
import { gamePlayer, gameResultEnum } from "./schema/gamePlayer";
import { friendship, friendshipStatusEnum } from "./schema/friendship";
import { game } from "./schema/game";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL!);

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
}