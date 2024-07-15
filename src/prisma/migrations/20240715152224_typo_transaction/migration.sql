/*
  Warnings:

  - You are about to drop the column `trasaction_token_payline` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "trasaction_token_payline",
ADD COLUMN     "transaction_token_payline" VARCHAR(255);
