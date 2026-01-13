# Partial Payment Support & Deposits Feature

## Overview
This feature enables clients to make partial payments on invoices, track outstanding balances, and view payment history.

## Files Created/Modified

### Database Schema
- **`prisma/schema.prisma`**: 
  - Added `PARTIALLY_PAID` to `InvoiceStatus` enum
  - Added `paidAmount` and `outstandingBalance` fields to `Invoice` model
  - Created new `PaymentRecord` model to track individual payments

### Migration
- **`prisma/migrations/add_partial_payments/migration.sql`**: SQL migration file (manual migration needed)

### Schemas
- **`schemas/partial-payment.ts`**: Validation schemas for partial payments and deposits
- **`schemas/index.ts`**: Exports the new schemas

### Actions (Server)
- **`actions/partial-payments.ts`**: 
  - `addPartialPayment()`: Add a partial payment to an invoice
  - `getInvoicePaymentHistory()`: Get payment history for an invoice
  - `getInvoiceWithPayments()`: Get invoice with all payment details

### Components (Client)
- **`components/invoices/PartialPaymentForm.tsx`**: Form component for adding partial payments
- **`components/invoices/PaymentHistory.tsx`**: Component to display payment history

## Implementation Steps

### 1. Database Migration
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and run migration (if using Prisma migrations)
npx prisma migrate dev --name add_partial_payments

# OR manually run the SQL migration file
# Then run: npx prisma db push
```

### 2. Update Existing Payment Action
The existing `addPayment` function in `actions/payments.ts` needs to be updated to:
- Check if payment is partial or full
- Update `paidAmount` and `outstandingBalance` fields
- Set status to `PARTIALLY_PAID` if partial, `PAID` if full
- Create `PaymentRecord` entry

### 3. Update Invoice Display
Update invoice detail pages to:
- Show paid amount and outstanding balance
- Display payment history component
- Show partial payment form for unpaid/partially paid invoices

### 4. Update Invoice PDF
Update `lib/index.ts` `generateInvoice` function to show:
- Paid amount
- Outstanding balance
- Payment progress

## Testing Checklist

- [ ] Create an invoice
- [ ] Make a partial payment (less than invoice amount)
- [ ] Verify invoice status changes to `PARTIALLY_PAID`
- [ ] Verify `paidAmount` and `outstandingBalance` are updated correctly
- [ ] Make another partial payment
- [ ] Make final payment to complete invoice
- [ ] Verify invoice status changes to `PAID` when fully paid
- [ ] Verify payment history shows all payments
- [ ] Test payment amount validation (cannot exceed outstanding balance)
- [ ] Test wallet balance updates correctly
- [ ] Test invoice PDF shows payment information

## Next Steps

1. Run database migration
2. Update `actions/payments.ts` to use new partial payment logic
3. Integrate `PartialPaymentForm` into invoice detail page
4. Integrate `PaymentHistory` component into invoice detail page
5. Update invoice PDF generation
6. Test thoroughly

## Notes

- The migration SQL file is provided but needs to be run manually or converted to Prisma migration
- The `outstandingBalance` field is calculated as `amount - paidAmount` in application logic
- Payment records are linked to both Invoice and Payment models for complete tracking
