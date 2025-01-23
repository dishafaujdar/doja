import { Router } from "express";
export const Chatroute = Router();

Chatroute.get("/startChat",async(req , res)=>{
    res.json({message:"this is for chatting"})
})