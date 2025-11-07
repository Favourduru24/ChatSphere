import { getEnv } from "../utils/get-env";

export const ENV = {
   NODE_ENV: getEnv("NODE_ENV", "development"),
   PORT: getEnv("PORT", "8000"),
   MONGO_URL: getEnv("MONGO_URL"),
   JWT_SECRET: getEnv("JWT_SECRET", "secret_jwt"),
   JWT_EXPIRE_IN: getEnv("JWT_EXPIRES_IN", "15m"),
   FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:3000")
} as const