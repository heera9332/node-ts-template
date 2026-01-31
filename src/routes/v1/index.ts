import { Router } from "express";
import authRoute from "@/routes/v1/auth";
import userRoutes from "@/routes/v1/user";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    docs: "http://localhost:3000/docs",
  });
});

router.use("/auth", authRoute);
router.use("/users", userRoutes);

export default router;