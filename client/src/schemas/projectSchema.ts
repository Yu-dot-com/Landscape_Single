import { z } from "zod";

export const projectSchema = z.object({
    name: z.string().min(3,"Name must be atleast 3 characters").max(50,"Name is too long"),
    description: z.string().optional(),
    thumbnail_url: z.string().optional()
})