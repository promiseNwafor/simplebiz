import { describe, it, expect } from 'vitest'
import { PartialPaymentSchema } from '@/schemas'

describe('PartialPaymentSchema', () => {
  it('should validate correct partial payment data', () => {
    const validData = {
      invoiceId: 'test-invoice-id',
      amount: 1000,
      paymentMethod: 'ONLINE',
      notes: 'Test payment',
    }

    const result = PartialPaymentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject negative amounts', () => {
    const invalidData = {
      invoiceId: 'test-invoice-id',
      amount: -100,
    }

    const result = PartialPaymentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject missing invoiceId', () => {
    const invalidData = {
      amount: 1000,
    }

    const result = PartialPaymentSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should accept optional fields', () => {
    const validData = {
      invoiceId: 'test-invoice-id',
      amount: 1000,
    }

    const result = PartialPaymentSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
