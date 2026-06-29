import { z } from 'zod'

// ── Create User Schema ──
export const createUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin'], { required_error: 'Role is required' }),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

// ── Edit User Schema (all fields optional, password optional) ──
export const editUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().trim().email('Enter a valid email').optional(),
  role: z.enum(['user', 'admin']).optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional()
    .or(z.literal('')),
})

export type EditUserFormData = z.infer<typeof editUserSchema>
