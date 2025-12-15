import { z } from "zod";

// data that we need from user to register
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

//exporting the type to provide to the request Body
export type CreateUserInput = z.infer<typeof createUserSchema>;

// response schema for registering user
export const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string().min(6),
});

export const updateEmailSchema = z.object({
  new_email: z.string().email(),
  password: z.string().min(6),
});

export const updatePassSchema = z.object({
  new_email: z.string().email(),
  password: z.string().min(6),
});

export type LoginUserInput = z.infer<typeof loginSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type UpdatePassInput = z.infer<typeof updatePassSchema>;
export const loginResponseSchema = z.object({
  accessToken: z.string(),
});
