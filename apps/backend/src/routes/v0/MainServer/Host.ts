import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// ✅ Register as a host
const hostId = "c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd"; // Unique host ID

const connect = socket.on("connect", () => {
    console.log(`✅ Host connected: ${socket.id}`);
    socket.emit("register", hostId);
});

if(!connect){
    console.log(`something is wrong`);
}

// ✅ Listen for messages
socket.on("message", (data) => {
    console.log(`📩 New message from ${data.sender}: ${data.text}`);
});

// ✅ Send a message to the guest
function sendMessage(text: string) {
    const guestId = "c7f0911d-ffb3-48d1-a52c-9872c2a8ddde"; // Known guest ID
    socket.emit("message", { sender: hostId, receiver: guestId, text });
}

// ✅ Example usage: Send a message after 5 seconds
setTimeout(() => {
    sendMessage("Hello guest! This is the host.");
}, 5000);
