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
    isTwoFactorEnabled: z.optional(z.boolean()),
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

export const ProductSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  price: z.coerce.number().multipleOf(0.01).nonnegative(),
  purchasePrice: z.coerce.number().multipleOf(0.01).nonnegative(),
  type: z.enum([
    ProductType.PHYSICAL,
    ProductType.SERVICE,
    ProductType.DIGITAL,
    ProductType.OTHER,
  ]),
  imageURL: z.any(),
  quantity: z.number().int().nonnegative(),
})

export type ProductSchemaValues = z.infer<typeof ProductSchema>

export const InvoiceSchema = z.object({
  selectedProducts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      total: z.number(),
    })
  ),
  client: z.string(),
  dueDate: z.string(),
  message: z.string().optional(),
})

export type InvoiceSchemaValues = z.infer<typeof InvoiceSchema>

export const PaymentAccountSchema = z.object({
  bankName: z
    .string()
    .min(2, { message: 'Bank name must be at least 2 characters long' })
    .max(20, { message: 'Bank name must be at most 20 characters long' })
    .regex(/^[a-zA-Z\s]*$/, {
      message: 'Bank name can only contain letters and spaces',
    }),
  accountNumber: z
    .string()
    .min(8, { message: 'Enter a valid account number' })
    .max(12, { message: 'Enter a valid account number' })
    .regex(/^\d+$/, { message: 'Account number can only contain digits' }),
  accountName: z
    .string()
    .min(2, { message: 'Account name must be at least 2 characters long' })
    .max(50, { message: 'Account name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]*$/, {
      message: 'Account name can only contain letters and spaces',
    }),
})

export type PaymentAccountSchemaValues = z.infer<typeof PaymentAccountSchema>

export const PaymentWithdrawalSchema = z.object({
  amount: z.number().min(1, { message: 'Amount must be at least 1' }),

  paymentDetailId: z.string(),
})

export type PaymentWithdrawalSchemaValues = z.infer<
  typeof PaymentWithdrawalSchema
>

export const UserProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email.',
  }),
  phoneNumber: z.string().min(7, {
    message: 'Please enter a valid phone number.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  isTwoFactorEnabled: z.optional(z.boolean()),
})

export type UserProfileFormValues = z.infer<typeof UserProfileFormSchema>

export const BusinessFormSchema = z.object({
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
})

export type BusinessFormValues = z.infer<typeof BusinessFormSchema>

export const RemindersFormSchema = z.object({
  enableReminders: z.boolean(),
})

export type RemindersFormValues = z.infer<typeof RemindersFormSchema>
