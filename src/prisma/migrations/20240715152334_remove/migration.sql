/*
  Warnings:

  - You are about to drop the column `transaction_oxlin_ttl` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_token_payline_ttl` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transaction_oxlin_ttl",
DROP COLUMN "transaction_token_payline_ttl";
