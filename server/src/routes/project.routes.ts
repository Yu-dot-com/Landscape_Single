import express from "express";
import {
  createProject,
  deleteProject,
  getOwnedProjects,
  getProjectItems,
  getSharedProjects,
  getUserProjects,
  updateProjectName,
  updateProjectThumbnail,
} from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireProjectRole } from "../middlewares/requireProjectRole";
import { validateMiddleware } from "../middlewares/validate.middleware";
import {
  createProjectSchema,
  updateProjectNameSchema,
} from "../schemas/project.schema";
import { getProjectCount } from "../controllers/project.controller";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  validateMiddleware(createProjectSchema),
  createProject,
);
router.get("/get", authMiddleware, getUserProjects);
router.delete(
  "/delete/:projectId",
  authMiddleware,
  requireProjectRole(["owner","admin"]),
  deleteProject,
);
router.patch(
  "/update/:projectId",
  authMiddleware,
  validateMiddleware(updateProjectNameSchema),
  requireProjectRole(["owner"]),
  updateProjectName,
);
router.get("/getOwned", authMiddleware, getOwnedProjects);
router.get("/getShared", authMiddleware, getSharedProjects);
router.get("/count", authMiddleware, getProjectCount);
router.get(
  "/canvas/:projectId",
  authMiddleware,
  requireProjectRole(["owner", "editor", "admin", "viewer"]),
  getProjectItems,
);
router.post("/:projectId/thumbnail",authMiddleware,updateProjectThumbnail);

export default router;
