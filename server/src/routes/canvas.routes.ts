import { Router } from "express";
import { getCanvas, saveCanvas } from "../controllers/canvas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireProjectRole } from "../middlewares/requireProjectRole";

const router = Router();

router.post("/save/:projectId", authMiddleware,requireProjectRole(["viewer","editor","admin"]),saveCanvas);
router.get("/getCanvas/:projectId",authMiddleware,getCanvas);

export default router;
