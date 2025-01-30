import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { HostVerification } from "../middlewares/EntrytoAgora";
import { AgoraEntrySchema } from "../types";
import {v4 as v4} from "uuid";
import client from "@repo/db/client";
export const Agoraroute = Router();
import bcrypt from "bcryptjs";

// user'll be validate productKey and serviceKey jiske through he'll use the sdk for his code 
Agoraroute.post("/server", SigninVerification || SignupVerification, HostVerification, async(req , res)=>{
    try {
        console.log(req.session.ProductKey);
    
        const parsedData = AgoraEntrySchema.safeParse(req.body);
    
        if (parsedData.error) {
            const error = JSON.stringify({ parsedData });
            res.status(401).json({ error });
            console.log("Validation Error:", error);
            return;
        }

        const response = await client.room.findFirst({
            where:{ProductKey: req.session.ProductKey}
        });

        console.log(req.session.ProductKey);
        
        if(response){
            res.status(200).json({message:`Congratulations ${parsedData.data.HostName} now you can use download our sdk 🎉.`});
            return;
        }else{
            res.status(404).json({message:`The provided keys are incorrect ❌.`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
});
