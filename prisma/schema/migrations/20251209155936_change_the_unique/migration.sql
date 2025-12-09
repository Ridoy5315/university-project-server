/*
  Warnings:

  - A unique constraint covering the columns `[email,siteName,username]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "credentials_email_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_siteName_username_key" ON "credentials"("email", "siteName", "username");
