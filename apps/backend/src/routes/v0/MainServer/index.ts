import { Server, Socket } from "socket.io";
import { createServer, Server as HttpServer } from "http";

class SocketServices {
    private _io: Server | null = null;
    private users: Map<string, string> = new Map(); // Store userId → socketId mapping

    constructor() {
        console.log("Socket service ready, but not initialized.");
    }

    init(productKey: string, userId: string, httpServer: HttpServer) {
        if (!productKey || !userId) {
            throw new Error("Invalid productKey or userId.");
        }

        if (this._io) {
            console.log("Socket.io is already initialized.");
            return;
        }

        // const httpServer = createServer();
        this._io = new Server(httpServer, {
            cors: { origin: "*" },
        });

        this._io.emit("register",userId)

        this._io.on("connection", (socket: Socket) => { 
            console.log(`User connected: ${socket.id}`);

            socket.on("register", (userId: string) => {
                this.users.set(userId, socket.id);
                console.log(`User registered: ${userId} with socket ID ${socket.id}`);
            });

            socket.on("message", ({ sender, receiver, text }) => {
                const receiverSocketId = this.users.get(receiver);
                if (receiverSocketId) {
                    this._io?.to(receiverSocketId).emit("message", { sender, text });
                    console.log(`Message from ${sender} to ${receiver}: ${text}`);
                } else {
                    console.log(`User ${receiver} not connected.`);
                }
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
                [...this.users.entries()].forEach(([userId, socketId]) => {
                    if (socketId === socket.id) {
                        // this.users.delete(userId);
                        console.log(`User ${userId} removed.`);
                    }
                });
            });
        });

        console.log("Socket.io initialized.");
    }
    get io() {
        if (!this._io) {
            throw new Error("Socket.io is not initialized. Call init() first.");
        }
        return this._io;
    }
}

export default SocketServices;
