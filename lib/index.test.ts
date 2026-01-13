import { describe, it, expect } from 'vitest'
import { ngnFormatter, formatDate, generateInvoiceReference } from '@/lib/index'

describe('lib/utils', () => {
  describe('ngnFormatter', () => {
    it('should format numbers as NGN currency', () => {
      expect(ngnFormatter.format(1000)).toBe('₦1,000')
      expect(ngnFormatter.format(50000)).toBe('₦50,000')
      expect(ngnFormatter.format(1234567)).toBe('₦1,234,567')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('generateInvoiceReference', () => {
    it('should generate invoice reference with INV prefix', () => {
      const ref = generateInvoiceReference()
      expect(ref).toMatch(/^INV-\d+$/)
    })

    it('should generate unique references', async () => {
      const ref1 = generateInvoiceReference()
      // Add small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1))
      const ref2 = generateInvoiceReference()
      expect(ref1).not.toBe(ref2)
    })
  })
})
