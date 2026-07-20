import express from "express";
import { getCurrentUser, login, register, updateName } from "../controllers/auth.controller";
import { validateMiddleware } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
router.post("/register",validateMiddleware(registerSchema),register)
router.post("/login",validateMiddleware(loginSchema),login)
router.patch("/updateName/:id",authMiddleware,updateName)
router.get("/me",authMiddleware,getCurrentUser)

export default router;