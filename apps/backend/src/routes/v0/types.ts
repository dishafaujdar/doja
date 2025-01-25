import {z} from "zod";

export const signinSchema = z.object({
    name: z.string(),
    password: z.string(),
})

export const signupSchema = z.object({
    name: z.string(),
    password: z.string(),
})

export const roomSchema = z.object({
    roomOptions: z.enum(["Video call", "Voice call", "Chat"]),
  });