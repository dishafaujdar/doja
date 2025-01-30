import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class SocketServices {
    private _io: Server | null = null;
    private users : Map<string, string> =  new Map(); // Store socketId -> userId mapping

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

        console.log("Initializing Socket.io...");
        this._io = new Server(httpServer, {
            cors: { origin: "*" }, // Allow all origins
        });

        this._io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Listen for user registration (guest/host)
            socket.on("register", (userId) => {
                this.users.set(socket.id, userId);
                console.log(`User ${userId} registered with socket ${socket.id}`);
            });

            // Listen for incoming messages
            socket.on("message", ({ sender, receiver, text }) => {
                console.log(`Message from ${sender} to ${receiver}: ${text}`);

                // Find receiver's socket ID
                const receiverSocket = [...this.users.entries()]
                    .find(([_, id]) => id === receiver)?.[0];

                if (receiverSocket) {
                    this._io?.to(receiverSocket).emit("message", { sender, text });
                } else {
                    console.log(`User ${receiver} not connected.`);
                }
            });

            // Handle user disconnect
            socket.on("disconnect", () => {
                const userId = this.users.get(socket.id);
                console.log(`User ${userId} disconnected.`);
                this.users.delete(socket.id);
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
