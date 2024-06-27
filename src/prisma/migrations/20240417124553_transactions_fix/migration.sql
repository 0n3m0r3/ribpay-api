/*
  Warnings:

  - Made the column `account_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "account_id" SET NOT NULL;
