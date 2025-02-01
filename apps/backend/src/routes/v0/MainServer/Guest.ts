import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// ✅ Register as a guest
const guestId = "c7f0911d-ffb3-48d1-a52c-9872c2a8ddde"; // Unique guest ID

socket.on("connect", () => {
    console.log(`✅ Guest connected: ${socket.id}`);
    socket.emit("register", guestId);
});

// ✅ Listen for messages
socket.on("message", (data) => {
    console.log(`📩 New message from ${data.sender}: ${data.text}`);
});

// ✅ Send a message to the host
function sendMessage(text: string) {
    const hostId = "c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd"; // Known host ID
    socket.emit("message", { sender: guestId, receiver: hostId, text });
}

// ✅ Example usage: Send a message after 7 seconds
setTimeout(() => {
    sendMessage("Hello host! This is the guest.");
}, 7000);
