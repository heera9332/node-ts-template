import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// Custom modules

import config from "@/config/index";
import limiter from "@/middlewares/rate-limit";
import router from "@/routes/v1";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { logger } from "@/lib/winston";

const app = express();

app.use(limiter);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.info(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};

// Enable JSON request body parsing
app.use(express.json());

// Enable URL-encoded request body parsing with extended mode
// `extended: true` allows rich objects and arrays via query string library
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024, // only compress responses larger then 1KB
  }),
);

// Use helmet to enhance security by settings various HTTP headers
app.use(helmet());

// apply CORS middleware
// app.use(cors(corsOptions));

(async () => {
  try {
    await connectToDatabase();
    app.use("/api/v1", router);

    app.listen(config.PORT, () => {
      logger.info(`server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.info("Failed to start server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    logger.info("Error during server shutdown");
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGNINT", handleServerShutdown);
