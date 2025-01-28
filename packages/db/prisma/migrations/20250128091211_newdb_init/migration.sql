/*
  Warnings:

  - You are about to drop the column `roomId` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicRoomId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RoomUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_id_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomId",
ADD COLUMN     "publicRoomId" TEXT;

-- AlterTable
ALTER TABLE "RoomUsers" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_publicRoomId_key" ON "Room"("publicRoomId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
