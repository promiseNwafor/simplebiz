/*
  Warnings:

  - A unique constraint covering the columns `[invoiceRef]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceRef` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "invoices_user_id_client_id_key";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "invoiceRef" TEXT NOT NULL,
ALTER COLUMN "issue_date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceRef_key" ON "invoices"("invoiceRef");
