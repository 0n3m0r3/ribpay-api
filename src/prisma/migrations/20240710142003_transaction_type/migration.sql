/*
  Warnings:

  - Added the required column `transaction_type` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transaction_type" VARCHAR(255) NOT NULL;
