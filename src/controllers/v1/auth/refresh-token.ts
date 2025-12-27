import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import Token from "@/models/token";

import { logger } from "@/lib/winston";
import {
  verifyRefreshToken,
  verifyAccessToken,
  generateAccessToken,
} from "@/lib/jwt";

import type { Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExitsts = await Token.exists({ token: refreshToken });
    if (!tokenExitsts) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token",
      });
      return;
    }

    /** verify refresh token */
    const payload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(payload.userId);

    res.status(200).json({
      code: "Success",
      message: "Access token generated successfully",
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Refresh token has expired",
      });
      logger.warn(`Refresh token expired: ${error}`);
      return;
    } else if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token",
      });
      logger.warn(`Invalid refresh token: ${error}`);
      return;
    }
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error,
    });

    logger.error(`Error during refresh token: ${error}`);
  }
};

export default refreshToken;
