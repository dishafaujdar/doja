import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { roomSchema } from "../types";
import client from "@repo/db/client";
export const Hostroute = Router();

/**TODO: as for now there is only host id, make authentication strong */
Hostroute.post("/selectroom", SigninVerification ,async(req , res)=>{
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
            const response = client.room.create({
                data:{
                    roomName: parsedData.data.roomOptions,
                    hostId: hostId
                }
            });
            console.log((await response).id);
            res.status(201).json({message:`Host ${req.username} has successfully created ${parsedData.data.roomOptions} room with id ${hostId} 🎉`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
})