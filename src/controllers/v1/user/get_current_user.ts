import { logger } from "@/lib/winston";

import User from "@/models/user";
import type { Request, Response, NextFunction } from "express";

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.userId).select("-password").lean().exec();
    if (!user) {
      return res
        .status(404)
        .json({ code: "NotFound", message: "User not found" });
    }
    return res.status(200).json(user);
} catch (error) {
    logger.error("Error while authorizing user", error);
    return res.status(500).json({
        code: "ServerError",
        message: "Internal server error",
        error: error,
    });
  }
};

export default getCurrentUser;
