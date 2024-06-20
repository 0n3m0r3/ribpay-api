/*
  Warnings:

  - Added the required column `notification_url` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "notification_url" VARCHAR(255) NOT NULL;
