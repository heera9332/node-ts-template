import { logger } from "@/lib/winston";

import type { Request, Response } from "express";
import User from "@/models/user";

const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.deleteOne({ _id: userId }).exec();
    if (!user) {
      return res
        .status(404)
        .json({ code: "NotFound", message: "User not found" });
    }
    logger.info(`User ${userId} deleted their account`);
    return res.sendStatus(204);
  } catch (error) {
    logger.error("Error while deleting user", error);
    return res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });
  }
};

export default deleteCurrentUser;
