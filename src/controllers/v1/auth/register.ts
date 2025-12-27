import type { Request, Response } from "express";

import { logger } from "@/lib/winston";
import User, { IUser } from "@/models/user";
import config from "@/config";
import { getUsername } from "@/utils";
import { generateAccessToken } from "@/lib/jwt";
import Token from "@/models/token";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  if(role === "admin" && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
    res.status(403).json({
      code: "AuthorizationError",
      message: "You are not allowed to register as admin",
    });

    logger.warn(`Unauthorized admin registration attempt: ${email}`);
    return;
  }

  try {
    const username = getUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    /** generate access and refresh token for the new user */
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateAccessToken(newUser._id);

    /** store refresh token in database */
    await Token.create({ token: refreshToken, userId: newUser._id });

    logger.info(
      `Refresh token stored for user: ${{
        userId: newUser._id,
        token: refreshToken,
      }}`,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "New created",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info(`New user registered: ${newUser}`);
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
