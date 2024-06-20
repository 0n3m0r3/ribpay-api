/*
  Warnings:

  - You are about to drop the column `contract_subscription_id` on the `contracts` table. All the data in the column will be lost.
  - Added the required column `terminal_subscription_id` to the `terminals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminal_subscription_type` to the `terminals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "contract_subscription_id";

-- AlterTable
ALTER TABLE "terminals" ADD COLUMN     "terminal_subscription_id" VARCHAR(255) NOT NULL,
ADD COLUMN     "terminal_subscription_type" VARCHAR(255) NOT NULL;
