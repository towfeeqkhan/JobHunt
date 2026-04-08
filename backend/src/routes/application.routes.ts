import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/application/application.controller.js";
import { parseDescription } from "../controllers/application/parse.controller.js";
import requireAuth from "../middleware/requireAuth.middleware.js";

const router = express.Router();

router.use(requireAuth as any);

router.post("/parse", parseDescription);
router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
