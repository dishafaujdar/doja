/*
  Warnings:

  - You are about to drop the column `appId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[RoomKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_appId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "appId",
ADD COLUMN     "RoomKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_RoomKey_key" ON "User"("RoomKey");
