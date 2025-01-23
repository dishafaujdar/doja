import {z} from "zod";

export const signinSchema = z.object({
    name: z.string(),
    password: z.string(),
})

export const signupSchema = z.object({
    name: z.string(),
    password: z.string(),
})