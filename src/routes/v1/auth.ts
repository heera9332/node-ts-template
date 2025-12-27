import { Router } from "express";
import { body } from "express-validator";

import register from "@/controllers/v1/auth/register";

import validationError from "@/middlewares/validation-error";
import User from "@/models/user";

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
    })
    ,
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

export default router;
