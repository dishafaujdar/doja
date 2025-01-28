/*
  Warnings:

  - You are about to drop the column `guestId` on the `RoomUsers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_guestId_fkey";

-- AlterTable
ALTER TABLE "RoomUsers" DROP COLUMN "guestId";

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
