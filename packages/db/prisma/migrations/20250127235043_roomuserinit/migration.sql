-- DropForeignKey
ALTER TABLE "RoomUsers" DROP CONSTRAINT "RoomUsers_roomId_fkey";

-- AddForeignKey
ALTER TABLE "RoomUsers" ADD CONSTRAINT "RoomUsers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
