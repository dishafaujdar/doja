import { Request , Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
const app = express();
app.use(cors());
app.use(express.json()); 
import client from "@repo/db/client";

// only allow host to access the server


export const HostVerification = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = req.session.userId;
        const HostId = req.session.HostId;
    
        console.log(userId , HostId);
    
        const isHost = await client.user.findUnique({
            where:{
                id: "dcba6819-181e-4392-a5bd-37b0cf189b7c"
            }
        });

        if(!isHost){
            res.status(401).json({message:`you don't seem to be a host 🕵️`});
            return;
        }
    
        if(isHost){
            console.log(`Verification successful 🎉!`);
            
            next();
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
}