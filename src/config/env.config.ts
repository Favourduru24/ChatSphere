import { getEnv } from "../utils/get-env";

export const ENV = {
  // Node environment
  NODE_ENV: getEnv("NODE_ENV", "production"),

  // Dynamic PORT (Railway will inject this automatically)
  PORT: process.env.PORT, // fallback handled in index.ts if needed

  // MongoDB connection string
  MONGO_URL: getEnv("MONGO_URL"),

  // JWT config
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRE_IN: getEnv("JWT_EXPIRES_IN", "15m"),

  // Frontend URL for CORS
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN"),

  // Cloudinary (if used)
  CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

  // Google Generative AI
  GOOGLE_GENERATIVE_AI_API_KEY: getEnv("GOOGLE_GENERATIVE_AI_API_KEY"),
} as const;
