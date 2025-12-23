import type { Request, Response } from "express";
import { logger } from "@/lib/winston";
import user, { IUser } from "@/models/user";

import config from "@/config";
import { getUsername } from "@/utils";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const username = getUsername();
    const newUser = await user.create({
      username,
      email,
      password,
      role,
    });

    console.log(email, password, role);

    res.status(201).json({
      message: "New created",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });

    logger.error("Error during user registration", error);
  }
};

export default register;
