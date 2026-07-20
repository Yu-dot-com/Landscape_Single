import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware"
import { addMember,getProjectMembers,deleteProjectMember, updateMemberRole } from "../controllers/member.controller";
import { requireProjectRole } from "../middlewares/requireProjectRole";
import { validateMiddleware } from "../middlewares/validate.middleware";
import { addMemberSchema, deleteProjectMemberSchema, updateMemberRoleSchema } from "../schemas/memeber.schema";

const router = express.Router({ mergeParams: true });

router.post("/invite",authMiddleware,validateMiddleware(addMemberSchema),requireProjectRole(["viewer","editor","admin"]), addMember);
router.get("/get",authMiddleware,requireProjectRole(["viewer","editor","admin"]) ,getProjectMembers);
router.delete("/delete",authMiddleware,validateMiddleware(deleteProjectMemberSchema),requireProjectRole(["admin"]) ,deleteProjectMember);
router.patch("/role",authMiddleware,validateMiddleware(updateMemberRoleSchema),requireProjectRole(["admin"]) ,updateMemberRole);



export default router;