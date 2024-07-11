import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { ProductType } from '@/enums'

export const RegisterFormSchema = z
  .object({
    // User details
    name: z.string().min(2, {
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

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
  rememberLogin: z.boolean().optional(),
})

export type LoginFormValues = z.infer<typeof LoginFormSchema>

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
})

export type ResetSchemaValues = z.infer<typeof ResetSchema>

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
})

export type NewPasswordSchemaValues = z.infer<typeof NewPasswordSchema>

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  )

export const ClientSchema = z.object({
  name: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  phoneNumber: z.string().min(7, {
    message: 'Please enter a valid phone number.',
  }),
  billingAddress: z.string().min(10, {
    message: 'Address must be at least 10 characters.',
  }),
  businessName: z
    .string()
    .optional()
    .transform((val) => val ?? ''),
})

export type ClientSchemaValues = z.infer<typeof ClientSchema>

const fileSchema = z.instanceof(File, { message: 'Upload a valid file' })
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith('image/')
)

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const ProductSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  price: z.coerce.number().multipleOf(0.01).nonnegative(),
  type: z.enum([
    ProductType.PHYSICAL,
    ProductType.SERVICE,
    ProductType.DIGITAL,
    ProductType.OTHER,
  ]),
  // imageURL: fileSchema.refine((file) => file.size > 0, 'Required'),
  imageURL: z.any(),
  // .refine((files) => {
  //   return files?.[0]?.size <= MAX_FILE_SIZE
  // }, `Max image size is 5MB.`),
  // .refine((files) => {
  //   return {
  //     type: files?.[0]?.type,
  //     size: files?.[0]?.size,
  //     name: files?.[0]?.name,
  //   }
  // }),
  // .refine(
  //   (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
  //   'Only .jpg, .jpeg, .png and .webp formats are supported.'
  // ),
  quantity: z.number().int().nonnegative(),
})

export type ProductSchemaValues = z.infer<typeof ProductSchema>
