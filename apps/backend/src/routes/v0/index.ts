import { Router } from "express";
import { Chatroute } from "./routes/chats";
import { signinSchema, signupSchema } from "./types";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
export const route = Router();

route.post("/signin", async(req,res)=>{
    console.log("hey from signin");
    
    try {
        const parsedData = signinSchema.safeParse(req.body);
        if(parsedData.error){
            const error = JSON.stringify({parsedData}) 
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({message:"User not found" , error});
            return;
        }
        if(parsedData.success){
            const userExists = await client.user.findUnique({
                where:{
                    username: parsedData.data.name,
                    password: parsedData.data.password
                }
            })
            if(userExists){
                const SigninToken = jwt.sign({username: parsedData.data.name , password: parsedData.data.password},"dojaserver",{expiresIn: "1h"});
                res.status(302).json({message:`Login successful, user's token ${SigninToken}.`})
            } else{
                res.status(404).json({message:"User account not found, recheck username, password or try signing up ."})
            }
        }
    } catch (error) {
        res.status(404).json({message : `Anonymous error ${error}`});
        return;
    }
});

route.post("/signup", async(req,res)=>{
    console.log("hey from signup");
    try {
        const parsedData = signupSchema.safeParse(req.body);
        if(parsedData.error){
            const error = JSON.stringify({parsedData}) 
            console.log("Validation Error:", JSON.stringify(parsedData));
            res.status(401).json({message:"Error in the parsed data" , error});
            return;
        }
        if(parsedData.success){ 
            const userExists = await client.user.findUnique({
                where:{
                    username: parsedData.data.name
                }
            })
            if(userExists){
                res.status(302).json({message:"User with this username already exist, please choose different username or do signin"});
                return;
            }
            else{
                const NewUserEntry = await client.user.create({
                    data:{
                        username: parsedData.data.name,
                        password: parsedData.data.password
                    }
                })
                console.log(JSON.stringify(NewUserEntry));
                const SignupToken = jwt.sign({username: parsedData.data.name , password: parsedData.data.password},"dojaserver",{expiresIn: "1h"});
                res.status(200).json({message:`Welcome to doja's server \n
                     Token ${SignupToken} `});
                return;
            }
        }
    } catch (error) {
        res.status(404).json({message : `Anonymous error ${error}`})
        return;
    }
});

route.use("/chat",Chatroute)