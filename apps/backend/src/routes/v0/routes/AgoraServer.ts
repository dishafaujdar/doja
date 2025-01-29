import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { HostVerification } from "../middlewares/EntrytoAgora";
import { AgoraEntrySchema } from "../types";
import {v4 as v4} from "uuid";
import client from "@repo/db/client";
export const Agoraroute = Router();

import bcrypt from "bcryptjs";


Agoraroute.get("/hey",async(req,res)=>{

    res.json('hey')

// Hash password
const hashedPassword = await bcrypt.hash("password123", 10);
console.log(hashedPassword);

// Verify password
const isValid = await bcrypt.compare("password123", hashedPassword);

console.log(isValid); // true

})

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

        const hasedkey = req.session.ProductKey || "";
        console.log(`hasedkey : ${hasedkey}`);
        

        const ServiceKey = await bcrypt.compare(parsedData.data.HostName,hasedkey)
        console.log(ServiceKey);
        
        if(ServiceKey){
            res.status(200).json({message:`Congratulations ${parsedData.data.ProductKey} now you can use download our sdk.`});
            return;
        }else{
            res.status(404).json({message:`The provided keys are incorrect.`});
            return;
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
});
