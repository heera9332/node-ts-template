import config from "@/config";
import { logger } from "@/lib/winston";

import Token from "@/models/token";

import type { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      /** delete refresh token from database */
      await Token.deleteOne({ token: refreshToken });
      logger.info(`Refresh token deleted: ${refreshToken}`);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.sendStatus(204);
    logger.info(`User logged out successfully: ${req.userId}`);
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });

    logger.error("Error during user logout", error);
  }
};

export default logout;
