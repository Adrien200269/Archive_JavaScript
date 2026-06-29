// Data Transfer Objects: the shape of data coming IN from requests.
import { z } from "zod";

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Shape of the user we send back to the client (never includes the password).
export interface UserResponseDTO {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: Date;
}

// ── Admin DTOs ──────────────────────────────────────────────────────────────

// Zod schema for creating a user via the admin panel
export const AdminCreateUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
});
export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserSchema>;

// Zod schema for updating a user via the admin panel (all fields optional)
export const AdminUpdateUserSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").optional(),
  email: z.string().trim().email("Enter a valid email").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["user", "admin"]).optional(),
});
export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserSchema>;
