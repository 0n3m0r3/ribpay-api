/*
  Warnings:

  - Made the column `contract_created_at` on table `contracts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "contract_created_at" SET NOT NULL;
