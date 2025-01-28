import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { roomSchema, userCheckSchema } from "../types";
import client from "@repo/db/client";
import { v4 as uuidv4, v4 } from 'uuid';
export const Hostroute = Router();

declare global{
    namespace Express{
        export interface Request{
            hostId? : string;
            roomName? : string
        }
    }
}

/**TODO: as for now there is only host id, make authentication strong */
Hostroute.post("/hostId", SigninVerification || SignupVerification, async(req , res)=>{
    try {
        const parsedData = roomSchema.safeParse(req.body);
        if(parsedData.error){
            const error = JSON.stringify({parsedData}) 
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({error});
            return;
        }
        if(parsedData.success){
            const hostId = v4.toString();
            const RoomId = Math.floor(Math.random()*10000000000).toString();

            const response = client.room.create({
                data:{
                    roomName: parsedData.data.roomOptions,
                    hostId: "32d8ef0d-e0ab-42b3-b9f4-238b2c089064",
                    publicRoomId: RoomId
                }
            });
            console.log((await response).id);
            res.status(201).json({message:`Host has successfully created ${parsedData.data.roomOptions} room with hostId ${hostId} and roomId ${RoomId} 🎉`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
});

Hostroute.post("/guestId", SigninVerification || SignupVerification, async (req, res) => {
    
    const parsedData = userCheckSchema.safeParse(req.body);
    const dbkiRoomUserId = "9839jfksnk";

    if (parsedData.error) {
        const error = JSON.stringify({ parsedData });
        res.status(401).json({ error });
        console.log("Validation Error:", error);
        return;
    }

    // Check if the guest already exists in the room
    const existingGuest = await client.roomUsers.findFirst({
        where: {
            id: dbkiRoomUserId,
            roomId: parsedData.data.roomId,
        },
    });

    if (!existingGuest) {
        // Check if the room exists in the Room table
        const existingRoom = await client.room.findUnique({
            where: { id: parsedData.data.roomId }, // Validate roomId
        });

        if (!existingRoom) {
            res.status(400).json({ message: "The room does not exist. Please check the room ID." });
            return;
        }

        // Create a new guest entry in RoomUsers
        const createGuest = await client.roomUsers.create({
            data: {
                id: dbkiRoomUserId, // Use the guest's unique ID
                roomId: parsedData.data.roomId,
                joinedAt: new Date(), // Optional: Add a timestamp
            },
        });

        console.log(`${createGuest.id} creatorId`);
        res.status(201).json({ message: `Take permission from the host to enter the room`});
        return;
    }

    res.status(200).json({ message: "Guest already exists in the room."});
});
