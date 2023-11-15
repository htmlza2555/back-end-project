import { Prisma } from "@prisma/client";

const { JWT_SECRET: ENV_JWT_SECRET, REDIS_URL: ENV_REDIS_URL } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("JWT_SECRET environment variable is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;
export const REDIS_URL = ENV_REDIS_URL ?? "redis://localhost:6379";

export const DEFAULT_USER_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  registeredAt: true,
};

export const getAuthToken = (authorizationHeader: string) => {
  authorizationHeader.replace("Bearer ", "").trim();
};

export const BLACKLIST_REDIS_KEY_PREFIX = "bl_";

export const BLACKLIST_REDIS_VALUE = "1";
