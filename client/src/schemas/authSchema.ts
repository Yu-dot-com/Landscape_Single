import { z } from "zod";

// LOGIN
export const loginSchema = z.object({
  email: z.email("Invalid email"),
  hash_password: z.string().min(8, "Password must be at least 8 characters"),
});

// SIGNUP
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email"),
  hash_password: z.string().min(8, "Password must be at least 8 characters"),
});