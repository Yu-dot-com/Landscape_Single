import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["viewer","editor","admin"],"role is required"),
});

export type addMemberFormValues = z.infer<typeof addMemberSchema>;