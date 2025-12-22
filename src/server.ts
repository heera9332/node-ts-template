import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// Custom modules

import config from "@/config/index";
import limiter from "@/middlewares/rate-limit";
import router from "@/routes/v1";

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
      console.log(`CORS Error: ${origin} is not allowed by CORS`);
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
    app.use("/api/v1", router);

    app.listen(config.PORT, () => {
      console.log(`server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    console.log("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    console.log("Error during server shutdown");
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGNINT", handleServerShutdown);
