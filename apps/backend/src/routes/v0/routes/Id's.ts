import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { roomSchema, userCheckSchema, GuestEntrySchema } from "../types";
import client from "@repo/db/client";
import { v4 as v4 } from 'uuid';
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
// ✅ 
Hostroute.post("/createRoom", SigninVerification || SignupVerification, async(req , res)=>{
    try {
        const parsedData = roomSchema.safeParse(req.body);
        if(parsedData.error){
            const error = JSON.stringify({parsedData}) 
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({error});
            return;
        }
        if(parsedData.success){
            // const hostId = v4.toString();
            const RoomId = Math.floor(Math.random()*10000000000).toString();

            const host = await client.user.findUnique({
                where: { id: "86f0dd53-d3f2-4963-a930" },
            });
            
            if (!host) {
                res.status(400).json({ error: "Host ID does not exist!" });
                return;
            }
            const response = client.room.create({
                data:{
                    roomName: RoomId,
                    hostId: "86f0dd53-d3f2-4963-a930-64cd8422d522"
                }
            });
            console.log(`roomid : ${(await response).id}`);
            res.status(201).json({message:`Host has successfully created ${parsedData.data.roomOptions} room with hostId ${(await response).id} and roomId ${RoomId} 🎉`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
}); 

// the guest's userId should first present in the user-model; and the roomId which guest want to join should present in the room-model
// ✅ 
Hostroute.post("/guest", SigninVerification || SignupVerification, async (req, res) => {

    const parsedData = userCheckSchema.safeParse(req.body);
    const dbkiRoomUserId = "23774732-74b2-435a-9d6c-0e5ae79eaa0b";

    // userID="32d8ef0d-e0ab-42b3-b9f4-238b2c089064"

    if (parsedData.error) {
        const error = JSON.stringify({ parsedData });
        res.status(401).json({ error });
        console.log("Validation Error:", error);
        return;
    }

    // Check if the guest already exists in the room
    const existingGuest = await client.roomUsers.findFirst({
        where: {
            id: "32d8ef0d-e0ab-42b3-b9f4-238b2c089064",
        },
    });

    if (!existingGuest) {
        // Check if the room exists in the Room table
        const existingRoom = await client.room.findUnique({
            where: { id: parsedData.data.roomId }, // Validate roomId
        });

        if (!existingRoom) {
            res.status(400).json({ message: "The room does not exist. Please check the room ID ❌." });
            return;
        }

        // Create a new guest entry in RoomUsers; guest should have roomId he want to join and regiseter as user in the & have userId
        const createGuest = await client.roomUsers.create({
            data: {
                userId: parsedData.data.userId, //enter id from user-model
                roomId: parsedData.data.roomId //enter id from the room-model
            },
        });

        if(!createGuest){
            res.status(404).json({ message: `User || room is not registered ❌.`});
            return;    
        }

        console.log(`${createGuest.id} creatorId`);
        res.status(201).json({ message: `Take permission from the host to enter the room.`});
        return;
    }

    res.status(200).json({ message: "Guest already exists in the room 👨‍⚕️."});
});

//here the host will get guestId, guestName and will permit the entry in the room ✅ 
Hostroute.post("/permitEntry",SigninVerification || SignupVerification,  async(req,res)=>{
    try {
        const parsedData = GuestEntrySchema.safeParse(req.body);
        if(parsedData.error){
            const error = JSON.stringify({parsedData}) 
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({error});
            return;
        };
    
        if(parsedData.success){
            /**1. check wheather the id's are correct;
             * 2. if user want to allowed the guest
             */
            const guest = await client.roomUsers.create({
                data:{
                    userId: parsedData.data.GuestId,
                    roomId: parsedData.data.RoomId
                }
            });
    
            if(!guest){
                res.status(404).json({ message:`Recheck your Id's 🕵️‍♂️.`});
                return;    
            }
    
            console.log(guest.id);
            res.status(201).json({ message: "Guest added successfully! 🎉", guest });
            return;
        }
    } catch (error) {
        if (error === "P2003") {
            res.status(400).json({
                message: `Invalid ID provided. Check if the error is a PrismaClientKnownRequestError.`,
            });
        } else {
            res.status(500).json({
                message: "An unexpected error occurred. Please try again later ⏲️.",
                error: `${error}`,
            });
        }
    }
});