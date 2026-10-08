import { z } from 'zod'

// Shared schemas
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema,
  password: passwordSchema
})

export const onboardingBasicSchema = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
  blood_group: z.string().min(1, 'Blood group is required'),
  height_cm: z.string().optional(),
  weight_kg: z.string().optional()
})

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: phoneSchema
})
