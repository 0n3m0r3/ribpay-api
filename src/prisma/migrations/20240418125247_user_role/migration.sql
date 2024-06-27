/*
  Warnings:

  - You are about to drop the column `user_role` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_role` to the `user_has_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_has_accounts" ADD COLUMN     "user_role" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_role";
