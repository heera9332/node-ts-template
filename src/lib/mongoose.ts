import config from "@/config";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import { logger } from "./winston";

const clientOptions: ConnectOptions = {
  dbName: "node-ts-template",
  appName: "Node Typescript Template",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MongoDB URI is not defined in the configuration");
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info("Connected to the database successfully", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    logger.info("Error connecting to the database.", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Disconncted from the database successfully", {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    logger.info("Error while disconnecting from database", error);
  }
};
