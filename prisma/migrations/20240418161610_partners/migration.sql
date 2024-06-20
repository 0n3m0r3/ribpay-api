/*
  Warnings:

  - A unique constraint covering the columns `[creator_id]` on the table `partners` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "partners_creator_id_key" ON "partners"("creator_id");
