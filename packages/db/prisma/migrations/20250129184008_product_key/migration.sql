/*
  Warnings:

  - You are about to drop the column `RoomKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `appCertificate` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ProductKey]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ProductKey` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_RoomKey_key";

-- DropIndex
DROP INDEX "User_appCertificate_key";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "ProductKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "RoomKey",
DROP COLUMN "appCertificate";

-- CreateIndex
CREATE UNIQUE INDEX "Room_ProductKey_key" ON "Room"("ProductKey");
