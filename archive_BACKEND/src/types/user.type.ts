import { z } from "zod";

// Zod schemas validate the request body on the backend too (never trust the client).
export const RegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Infer TS types straight from the schemas so they never drift apart.
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

// JWT payload shape.
export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
