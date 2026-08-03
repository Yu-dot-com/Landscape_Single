import { Router } from "express";
import * as activityController from "../controllers/activity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireProjectRole } from "../middlewares/requireProjectRole";

const router = Router();

router.get("/recent", authMiddleware, activityController.getRecentActivities);
router.get(
  "/project/:projectId",
  authMiddleware,
  requireProjectRole(["owner", "editor", "viewer"]),
  activityController.getProjectActivities,
);

export default router;