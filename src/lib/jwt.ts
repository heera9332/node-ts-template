import { Types } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config";

export const generateAccessToken = (userId: Types.ObjectId): string => {
  const secret = config.JWT_ACCESS_SECRET as string;

  const options: SignOptions = {
    expiresIn: config.ACCESS_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'],
    subject: "apiAccess",
  };

  return jwt.sign({ userId }, secret, options);
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET as string, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'],
    subject: "apiRefresh",
  });
};
