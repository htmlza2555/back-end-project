import { Prisma } from "@prisma/client";

const { JWT_SECRET: ENV_JWT_SECRET } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("JWT_SECRET environment variable is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;

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
