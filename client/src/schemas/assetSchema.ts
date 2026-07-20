import { z } from "zod";

export const assetSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    category_id: z.string().nonempty(),
    subcategory_id: z.string().nonempty(),
})
