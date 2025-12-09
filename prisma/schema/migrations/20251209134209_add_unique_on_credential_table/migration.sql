/*
  Warnings:

  - A unique constraint covering the columns `[email,username]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_username_key" ON "credentials"("email", "username");
