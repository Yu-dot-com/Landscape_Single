import {z} from "zod";

export const createProjectSchema = z.object({
        name: z.string().min(2,"Project name is required").max(100).optional(),
        description: z.string().max(1000).optional(),
})

export const updateProjectNameSchema = z.object({
        name: z.string().min(1,"Project name is required").max(100),
})

// export const deleteProjectSchema = z.object({
//     params: z.object({
//         id: z.uuid("Invalid project id")
//     })
// })