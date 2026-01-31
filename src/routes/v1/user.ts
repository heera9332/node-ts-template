import { Router } from "express";
import { param, query, body } from "express-validator";

/** middleware */

import authenticate from "@/middlewares/authenticate"; 
import authorize from "@/middlewares/authorize";

/** controller */

import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import User from "@/models/user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCurrentUser,
);

router.put(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  body("username")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username must be less than 20 characters")
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });

      if (userExists) {
        throw Error("This username is already in use");
      }
    }),
  body("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const emailExists = await User.exists({ email: value });
      if (emailExists) {
        throw Error("This email is already in use");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
    body("firstName")
    .optional()
    .isLength({ max: 20 }),
    body("lastName")
    .optional()
    .isLength({ max: 20 }),
    body(["socialLinks.website", "socialLinks.facebook", "socialLinks.instagram", "socialLinks.x", "socialLinks.youtube", "socialLinks.linkedin"]).optional().isURL().withMessage("Invalid URL format").isLength({ max: 100 }).withMessage("URL must be less than 100 characters"),
  updateCurrentUser,
);

router.delete(
    "/current",
    authenticate,
    authorize(["admin", "user"]),
    deleteCurrentUser
)

export default router;
