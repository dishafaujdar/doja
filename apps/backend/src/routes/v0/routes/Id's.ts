import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { roomSchema, userCheckSchema, GuestEntrySchema } from "../types";
import client from "@repo/db/client";
import bcrypt from "bcryptjs";
export const Hostroute = Router();

declare module 'express-session' {
    export interface SessionData {
      RoomId?: string; 
      GuestId?: string;
      HostId?: string;
      ProductKey?: string
    }
  }

/**TODO: as for now there is only host id, make authentication strong */
// ✅ 
Hostroute.post("/createRoom", SigninVerification || SignupVerification, async(req , res)=>{ 

    console.log(`userid : ${req.session.userId}`);  // ✅
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
            const host = await client.user.findUnique({
                where: { id: req.session.userId }, //USERID
            });

            const ProductKey = await bcrypt.hash("agoraserver", 5); 
            console.log(ProductKey);
            req.session.ProductKey = ProductKey;
            
            if (!host) {
                res.status(400).json({ error: "Host ID does not exist!" });
                return;
            }
            const response = client.room.create({
                data:{
                    roomName: parsedData.data.roomOptions,
                    hostId: req.session.userId || "",  //USERID
                    ProductKey: (ProductKey).toString()
                }
            });
            req.session.RoomId = (await response).id;
            console.log(`roomid : ${req.session.RoomId}`);
            req.session.HostId = (await response).hostId;

            res.status(201).json({message:`Host has successfully created ${parsedData.data.roomOptions} room with hostId ${(await response).id} and roomId ${(await response).id} 🎉`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
}); 

// the guest's userId should first present in the user-model; and the roomId which guest want to join should present in the room-model
// guest's input data -> uski userid or roomid jisme entry chaaiye
// ✅ 
Hostroute.post("/guest", SigninVerification || SignupVerification, async (req, res) => {

    console.log(`userid : ${req.session.userId}`);
    
    const parsedData = userCheckSchema.safeParse(req.body);

    if (parsedData.error) {
        const error = JSON.stringify({ parsedData });
        res.status(401).json({ error });
        console.log("Validation Error:", error);
        return;
    }

    // Check if the guest already exists in the room
    const existingGuest = await client.roomUsers.findFirst({
        where: {
            id: req.session.userId,     //USERID
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
                userId: req.session.userId || "", //enter id from user-model
                roomId: parsedData.data.roomId //enter id from the room-model
            },
        });

        if(!createGuest){
            res.status(404).json({ message: `User || room is not registered ❌.`});
            return;    
        }

        req.session.GuestId = createGuest.id;
        console.log(`GuestId : ${req.session.GuestId} and roomId : ${req.session.RoomId} `);
        res.status(201).json({ message: `Take permission from the host to enter the room.`});
        return;
    }

    res.status(200).json({ message: "Guest already exists in the room 👨‍⚕️."});
});

//here the host will get guestId, guestName and will permit the entry in the room ✅ 
Hostroute.post("/permitEntry", SigninVerification || SignupVerification, async (req, res) => {
    try {
        const parsedData = GuestEntrySchema.safeParse(req.body);
        if (parsedData.error) {
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({ error: JSON.stringify(parsedData) });
            return;
        }

        if (parsedData.success) {
            // Check if session values are set
            if (!req.session.userId || !req.session.RoomId) {
                res.status(400).json({ message: "Guest ID or Room ID is missing ❌." });
                return;
            }

            // Validate Room ID
            const roomExists = await client.room.findUnique({
                where: { id: req.session.RoomId }
            });

            if (!roomExists) {
                 res.status(400).json({ message: "Invalid Room ID ❌." });
                 return;
                }

            // Validate User ID
            const userExists = await client.user.findUnique({
                where: { id: req.session.userId }
            });

            if (!userExists) {
                 res.status(400).json({ message: "Invalid User ID ❌." });
                 return;
                }

            // Insert guest entry
            const guest = await client.roomUsers.create({
                data: {
                    userId: req.session.userId || "",
                    roomId: req.session.RoomId || ""
                }
            });

            

            console.log(`Guest ${req.session.userId} added to Room ${req.session.RoomId}`);

             res.status(201).json({ message: "Guest added successfully! 🎉", guest });
             return;
            }
    } catch (error: any) {
        console.error("Error:", error);

        if (error.code === "P2003") {
             res.status(400).json({
                message: "Invalid foreign key: Check if the IDs exist before linking.",
            });
            return;
        }

        res.status(500).json({
            message: "An unexpected error occurred. Please try again later ⏲️.",
            error: error.message,
        });
        return;
    }
});
