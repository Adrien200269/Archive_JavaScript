import { z } from 'zod'

// Login form validation
export const LoginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

// Register form validation — note the .refine() to confirm passwords match
export const RegisterSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    dob: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof LoginSchema>
export type RegisterValues = z.infer<typeof RegisterSchema>

// Shape of the user returned by the API
export interface User {
  id: string
  fullName: string
  email: string
  avatar?: string
  role?: string
  createdAt: string
}
