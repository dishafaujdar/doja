import express from "express";
import { route } from "./routes/v0";
import session from 'express-session';
import http from "http";
import SocketServices from "./routes/v0/MainServer"; 

const app = express();
app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `true` if using HTTPS
}));
app.use("/api/v0", route);

const httpServer = http.createServer(app);

const ss = new SocketServices();
ss.init(
    "$2a$10$RWNjz00vZRziyPKnYsbyn.BttXkCLkgE1b2BUgHR7cN8MLMnf3", 
    "c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd",
    httpServer 
);

ss.io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
});

// Start the HTTP server
const PORT = 3000;
httpServer.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd and productKEY: $2a$10$RWNjz00vZRziyPKnYsbyn.BttXkCLkgE1b2BUgHR7cN8MLMnf3VZC