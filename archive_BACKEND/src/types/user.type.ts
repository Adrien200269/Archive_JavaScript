import { z } from "zod";

// Zod schemas validate the request body on the backend too (never trust the client).
export const RegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  age: z.coerce.number().int().min(1, "Age is required").max(150).optional(),
});

export const LoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  code: z.string().length(6, "Code must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Infer TS types straight from the schemas so they never drift apart.
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// JWT payload shape.
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
