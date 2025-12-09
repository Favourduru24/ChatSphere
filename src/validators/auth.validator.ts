import { z } from "zod";

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .email("Please enter a valid email address")
  .min(2, "Email must be at least 2 characters long");

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(1, "Password cannot be empty");

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
  avatar: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
