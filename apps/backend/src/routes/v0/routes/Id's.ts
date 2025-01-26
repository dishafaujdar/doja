import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { roomSchema, userCheckSchema } from "../types";
import client from "@repo/db/client";
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
            const hostId = Math.floor(Math.random()*100000000).toString();
            const RoomId = Math.floor(Math.random()*10000000000).toString();

            const response = client.room.create({
                data:{
                    roomName: parsedData.data.roomOptions,
                    hostId: hostId,
                    roomId: RoomId
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

Hostroute.post("/guestId", SigninVerification || SignupVerification , async(req,res) =>{
    console.log(req.hostId);

    const parsedDatadata = userCheckSchema.safeParse(req.body);
    if(parsedDatadata.success){
        res.status(201).json({message:`${parsedDatadata.data.name} is user`})
        console.log(`${parsedDatadata.data.name}`);
    }

    const GuestId = Math.floor(Math.random()*10000000000).toString();


    const dbkiRoomUserId = "9839jfksnk"

    // pehle tho dekhega ki old guest tho nahi hai agr nahi hai tho create new guest
    const existingGuest = await client.roomUsers.findUnique({
        where:{
            id: dbkiRoomUserId,
            guestId: parsedDatadata.data?.guestId,
        }
    });

    // agar already guest nahi h tho guestId dede na, or ek mssg ki you will be entered into the room after the host's permission
    // guest ko ek roomId bhi dedo or ek roomId host k pass hogi, host will vrify the guest's roomId {uskaa login likh dena} after that the guest will be allowed.

    const GuestRoomId = "jisjfn239289437rhfjwn";

    if(!existingGuest){
        const createGuest = await client.roomUsers.create({
            data:{
                guestId: GuestId,
                roomId: GuestRoomId
            }
        });
        console.log(`${createGuest.id}`);
        res.status(201).json({message: `Take permission from the host to enter the room`});
        return;
    }
});