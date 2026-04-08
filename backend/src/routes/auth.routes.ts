import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshHandler,
  getMe,
} from "../controllers/auth/auth.controller.js";
import requireAuth from "../middleware/requireAuth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshHandler);
router.get("/me", requireAuth as any, getMe);

export default router;
