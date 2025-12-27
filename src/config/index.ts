import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  WHITELIST_ORIGINS: [
    "http://localhost:3000"
  ],
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "1w",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as ms.StringValue,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as ms.StringValue,
};

export default config;
