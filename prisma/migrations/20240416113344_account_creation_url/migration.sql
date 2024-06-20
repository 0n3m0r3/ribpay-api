/*
  Warnings:

  - Added the required column `account_creation_url` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "account_creation_url" VARCHAR(255) NOT NULL;
