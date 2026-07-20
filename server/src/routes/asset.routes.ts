import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addAsset, getAsset, getCategory } from "../controllers/asset.controller";

const router = express.Router();

router.get("/assets",authMiddleware,getCategory)
router.post("/add",authMiddleware,addAsset)
router.get("/get",authMiddleware,getAsset)

export default router;