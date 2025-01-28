// make id schema strong
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

export const userCheckSchema = z.object({
    userId: z.string(),
    roomId: z.string(),
})

export const GuestEntrySchema = z.object({
    Name: z.string(),
    GuestId: z.string(),
    RoomId: z.string()
})