/*
  Warnings:

  - You are about to drop the column `transaction_log_url` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_log_url",
ADD COLUMN     "transaction_logo_url" VARCHAR(255);
