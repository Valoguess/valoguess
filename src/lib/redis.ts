import { Redis } from "ioredis";
import ENV from "@/env";
import { logger } from "./logger";

export const redis = new Redis(ENV.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on("error", (error) => {
  logger.error({ err: error }, "[Redis Client Error]");
});