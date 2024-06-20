/*
  Warnings:

  - A unique constraint covering the columns `[user_id,account_id]` on the table `user_has_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_has_accounts_user_id_account_id_key" ON "user_has_accounts"("user_id", "account_id");
