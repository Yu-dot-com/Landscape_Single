import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    hash_password: z.string().min(8),
});
export const loginSchema = z.object({
    email: z.email("Invalid email"),
    hash_password: z.string().min(8, "Password must be at least 8 characters"),
});
