/*
  Warnings:

  - Added the required column `transaction_amount_calculated` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "transaction_amount_calculated" DECIMAL(65,30) NOT NULL DEFAULT 0;