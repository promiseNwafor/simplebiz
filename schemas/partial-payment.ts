import { z } from 'zod'

/**
 * Schema for partial payment validation
 */
export const PartialPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(1000000000, 'Amount is too large'),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})

export type PartialPaymentSchemaValues = z.infer<typeof PartialPaymentSchema>

/**
 * Schema for deposit/advance payment
 */
export const DepositPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(1000000000, 'Amount is too large'),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  isDeposit: z.boolean().default(false),
})

export type DepositPaymentSchemaValues = z.infer<typeof DepositPaymentSchema>
