import { z } from "zod";

// =============================
// REGISTER (CREATE USER)
// =============================
export const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string({ required_error: "Name is required" }),
  avatar: z.string().url().optional(),
  Auto_Match: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  loggedIn: z.boolean(),
  Auto_Match: z.boolean(),
  isOnline: z.boolean(),
  avatar: z.string().url().optional(),
});

// =============================
// LOGIN
// =============================
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginUserInput = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

// =============================
// USER RESPONSE (GENERAL)
// =============================
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  loggedIn: z.boolean(),
  Auto_Match: z.boolean(),
  isOnline: z.boolean(),
  avatar: z.string().url().optional(),
});

