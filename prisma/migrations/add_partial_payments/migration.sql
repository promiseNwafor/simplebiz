-- Migration: Add Partial Payment Support
-- This migration adds support for partial payments, deposits, and payment tracking

-- Add new status to InvoiceStatus enum
ALTER TYPE "InvoiceStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_PAID';

-- Add fields to Invoice table for partial payment tracking
ALTER TABLE "invoices" 
ADD COLUMN IF NOT EXISTS "paid_amount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN IF NOT EXISTS "outstanding_balance" DOUBLE PRECISION;

-- Update outstanding_balance to be calculated (amount - paid_amount)
-- This will be handled in application logic, but we set default here
UPDATE "invoices" 
SET "outstanding_balance" = "amount" - COALESCE("paid_amount", 0)
WHERE "outstanding_balance" IS NULL;

-- Create PaymentRecord table to track individual payments
CREATE TABLE IF NOT EXISTS "payment_records" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "invoice_id" TEXT NOT NULL,
  "payment_id" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "payment_method" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "payment_records_invoice_id_fkey" 
    FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
  CONSTRAINT "payment_records_payment_id_fkey" 
    FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "payment_records_invoice_id_idx" ON "payment_records"("invoice_id");
CREATE INDEX IF NOT EXISTS "payment_records_payment_id_idx" ON "payment_records"("payment_id");

-- Add relation to Invoice model (will be reflected in Prisma schema)
-- Note: This is a SQL migration, Prisma schema will need to be updated separately
