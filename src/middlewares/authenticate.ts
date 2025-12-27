import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { Types } from "mongoose";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Access denied. No token provided",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token) as { userId: Types.ObjectId };
    req.userId = decoded.userId;

    /** process to next middleware or router handler */
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "Unauthorized",
        message: "Access token has expired",
      });
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "Unauthorized",
        message: "Invalid access token",
        error
      });
    } else {
      res.status(500).json({
        code: "ServerError",
        message: "Internal server error",
        error: error,
      });
      logger.error("Error during authentication", error);
    }
  }
};

export default authenticate;
