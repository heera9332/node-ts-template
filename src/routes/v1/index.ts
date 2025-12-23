import { Router } from "express";
import authRoute from "./auth";

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

export default router;