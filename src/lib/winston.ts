import winston from "winston";
import config from "@/config";

const { combine, timestamp, errors, align, printf, colorize, json } =
  winston.format;

const transports: winston.transport[] = [];

/**
 * Console logs (dev)
 */
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
        errors({ stack: true }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 0
              ? `\n${JSON.stringify(meta, null, 2)}`
              : "";

          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

/**
 * File logs (prod)
 */
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), json()),
    }),
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  transports,
  exitOnError: false,
  format: combine(timestamp(), errors({ stack: true }), json()),
  silent: config.NODE_ENV === "test", // disable logging in test environment
});

export { logger };
