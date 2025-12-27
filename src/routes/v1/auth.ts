import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";

import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh-token";
import logout from "@/controllers/v1/auth/logout";

import validationError from "@/middlewares/validation-error";
import User from "@/models/user";
import authenticate from "@/middlewares/authenticate";

const router = Router();

router.post(
  "/register",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        return Promise.reject("Email is already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"),
  validationError,
  register,
);

router.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const user = await User.exists({ email: value });
      if (!user) {
        throw new Error("Invalid email or password");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (value, { req }) => {
      const { email } = req.body;
      const user = await User.findOne({ email })
        .select("password")
        .lean()
        .exec();

      if (!user) {
        return new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(value, user.password);

      if (!isMatch) {
        return new Error("Invalid email or password");
      }
    }),
  validationError,
  login,
);

router.post(
  "/refresh-token",
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isJWT()
    .withMessage("Invalid refresh token format"),
  validationError,
  refreshToken,
);

router.post("/logout", authenticate, logout);

export default router;
