import { Request , Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
const app = express();
app.use(cors());
app.use(express.json()); 

declare global {
    namespace Express {
        export interface Request {
            username?: string;
        }
    }
}

export const SigninVerification = (req: Request, res: Response, next: NextFunction) =>{
    try {
        const header = req.headers["authorization"];
        const token = header?.split(" ")[1];
        
        if(!token){
            res.status(401).json({message:`Token is missing 👀`});
            return;
        }
    
        if(token){
            const decode = jwt.verify(token,"dojaserver") as {username: string; id: string};
            console.log(JSON.stringify({decode}));
            if(!decode){
                res.status(401).json({message:`The provided token is incorrect ❌`});
                return;
            }        

            req.username = decode.username;
            console.log("Assigned req.username:", req.username);
            next();
        }
    } catch (error) {
        res.status(404).json({error});
        return;
    }
}