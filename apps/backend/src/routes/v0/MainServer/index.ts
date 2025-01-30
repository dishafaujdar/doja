/**creating sdk --> chat application functions */
import { Server } from "socket.io";
import {createServer, Server as HttpServer } from "http";
import {io} from "socket.io-client";
import client from "@repo/db/client";

class SocketServices {
    private _io: Server | null = null;
    private _httpServer: HttpServer | null = null;

    constructor() {
        console.log("Socket service ready, but not initialized.");
    }

    async init(productKey: string, userId: string, httpServer: HttpServer) {

        if (!productKey || !userId) {
            throw new Error("Provide both the keys, to initialized the chat server");
        }

        const response = await client.room.findUnique({
            where:{
                id: userId,
                ProductKey: productKey
            }
        })
        if(!response){
            throw new Error('Invalid productKey or userId.');
        }

        if (this._io) {
            console.log("Socket.io is already initialized.");
            return;
        }

        console.log("Initializing Socket.io...");

        this._httpServer = createServer();
        this._io = new Server(this._httpServer, {
            cors: { origin: "*" },
        });

        this._io.on("connection", (socket) => {
            console.log(`User connected: ${socket.id}`);
        });
    }
    attach(httpServer: HttpServer) {
        if (!this._io) {
            throw new Error("Socket.io is not initialized. Call init() first.");
        }
        this._io.attach(httpServer);
        console.log("Socket.io attached to HTTP server.");
    }

    get io() {
        if (!this._io) {
            throw new Error("Socket.io is not initialized. Call init() first.");
        }
        return this._io;
    }

    shutdown() {
        if (this._io) {
            console.log("Shutting down Socket.io...");
            this._io.close();
            // this._httpServer?.close();
            // this._io = null;
            // this._httpServer = null;
        }
    }

    /** guestUser will get connect to the server and can send mssg to the server  */
    async guest(RoomUsersId: string){
        
        if(!RoomUsersId){
            throw new Error("Invalid RoomUserId.");
        }

        const response = await client.roomUsers.findUnique({where:{id: RoomUsersId}})

        if(!response){
            throw new Error('Provide both the keys, to initialized the chat server');
        }

        const _socket = io('http://localhost:3000');
        if(_socket){
            console.log('connection has been made.');
        }
    }
}
export default SocketServices;


/**
 * 
 * socket.on("message", (msg) => { console.log(`Message received : ${msg}`) });

 * // this._httpServer = createServer();
        // this._io = new Server(this._httpServer, {
        //     cors: { origin: "*" },
        // });

        // this._io.on("connection", (socket) => {
        //     console.log(`User connected: ${socket.id}`);
        // });

        // this._httpServer.listen(3000, () => {
        //     console.log("WebSocket server listening on port 3000");
        // });
 */
        