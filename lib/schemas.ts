import { z } from 'zod'

export const RegisterFormSchema = z
  .object({
    // User details
    fullName: z.string().min(2, {
      message: 'Full name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email.',
    }),
    phoneNumber: z.string().min(7, {
      message: 'Please enter a valid phone number.',
    }),
    address: z.string().min(10, {
      message: 'Address must be at least 10 characters.',
    }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      }),
    confirmPassword: z.string(),

    // Business details
    businessName: z.string().min(2, {
      message: 'Business name must be at least 2 characters long.',
    }),
    businessAddress: z.string().min(10, {
      message: 'Business address must be at least 10 characters long.',
    }),
    rcNumber: z.string().min(2, {
      message: 'Registration number must be at least 2 characters long.',
    }),
    businessDescription: z
      .string()
      .optional()
      .transform((val) => val ?? ''),
    industry: z.string(),
    acceptPolicy: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions to continue.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  rememberLogin: z.boolean().optional(),
})

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>
export type LoginFormValues = z.infer<typeof LoginFormSchema>
