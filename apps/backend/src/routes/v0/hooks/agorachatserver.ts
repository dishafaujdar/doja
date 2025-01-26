/** MAIN AGORA CHAT SERVER : 
Create a server where host using the hostId can control the users, chats, etc. . Here user can join with userId , if permitted by the host.
 */

import { Router } from "express";
import { SigninVerification } from "../middlewares/Signin";
import { SignupVerification } from "../middlewares/Signup";
import { userCheckSchema } from "../types";
import client from "@repo/db/client";
export const ServerRoute = Router();

// first will check wheather the user is host or guest
