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
    roomOptions: z.string()
});

export const userCheckSchema = z.object({
    userId: z.string(),
    roomId: z.string(),
})

export const GuestEntrySchema = z.object({
    Name: z.string(),
})

export const AgoraEntrySchema = z.object({
    HostName: z.string(),
    RoomName: z.string(),
    ProductKey: z.string()
})