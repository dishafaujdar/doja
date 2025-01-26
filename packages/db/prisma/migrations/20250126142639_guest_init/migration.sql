/*
  Warnings:

  - You are about to drop the column `userId` on the `RoomUsers` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestId` to the `RoomUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomUsers" DROP COLUMN "userId",
ADD COLUMN     "guestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
