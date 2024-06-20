/*
  Warnings:

  - Added the required column `creator_id` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "creator_id" VARCHAR(255) NOT NULL;
