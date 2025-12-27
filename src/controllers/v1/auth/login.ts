import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

import User from "@/models/user";
import Token from "@/models/token";
import config from "@/config";

import { IUser } from "@/models/user";
import { Request, Response } from "express";

type UserData = Pick<IUser, "email" | "password">;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select("username email password role")
      .lean()
      .exec();

    /** user not found */
    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    /** generate access and refresh token for the new user */
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateAccessToken(user._id);

    /** store refresh token in database */
    await Token.create({ token: refreshToken, userId: user._id });

    logger.info(
      `Refresh token stored for user: ${{
        userId: user._id,
        token: refreshToken,
      }}`,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "User logged in successfully",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });

    logger.info(`User loggedin successfully: ${user}`);
  } catch (error) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: error,
    });

    logger.error("Error during user login", error);
  }
};

export default login;
