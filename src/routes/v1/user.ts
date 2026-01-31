import { Router } from "express";
import { param, query, body } from "express-validator";

/** middleware */

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validation-error";
import authorize from "@/middlewares/authorize";

/** controller */
  
import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";

const router = Router();

router.get(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']),
    getCurrentUser
);

router.put(
    '/current', 
    authenticate, 
    authorize(['admin', 'user']),
    updateCurrentUser
);

export default router;
 