import { z } from "zod";

export const addMemberSchema = z.object({
    email: z.email(),
    role: z.enum(["viewer", "editor", "admin"]).optional(),
});

export const deleteProjectMemberSchema= z.object({
      memberId: z.uuid("Invalid user_id"),

})

export const updateMemberRoleSchema = z.object({
    role: z.enum(["viewer","editor","admin"]),
    user_id: z.uuid("Invalid user_id")
})