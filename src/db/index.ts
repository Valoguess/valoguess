import { drizzle } from 'drizzle-orm/node-postgres';

import { jwks } from "./schema/jwks";
import { user } from "./schema/user";
import { account } from "./schema/account";
import { session } from "./schema/session";
import { game, gameModeEnum } from "./schema/game";
import { userSettings } from "./schema/userSettings";
import { verification } from "./schema/verification";
import { gameTeam, gameOutcomeEnum } from "./schema/gameTeam";
import { gameAward, gameAwardTypeEnum } from "./schema/gameAward";
import { friendship, friendshipStatusEnum } from "./schema/friendship";
import { gamePlayer, gamePlayerOutcomeEnum } from "./schema/gamePlayer";

import { relations } from "./relations";
import ENV from '@/env';

export const db = drizzle(ENV.DATABASE_URL!, { relations });

export const schema = {
  user,
  account,
  userSettings,
  session,
  verification,
  friendship,
  friendshipStatusEnum,
  game,
  gameModeEnum,
  gamePlayer,
  gamePlayerOutcomeEnum,
  gameTeam,
  gameOutcomeEnum,
  gameAward,
  gameAwardTypeEnum,
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
  gameModeEnum,
  gamePlayer,
  gamePlayerOutcomeEnum,
  gameTeam,
  gameOutcomeEnum,
  gameAward,
  gameAwardTypeEnum,
  jwks
}