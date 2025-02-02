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
    cookie: { secure: false } 
}));
app.use("/api/v0", route);

const productKey = "$2a$10$RWNjz00vZRziyPKnYsbyn.BttXkCLkgE1b2BUgHR7cN8MLMnf3VZC"
const userId = "c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd"

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const ss = new SocketServices();
ss.init(productKey, userId, httpServer);

// Start the HTTP server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



//   ss.guest("c7f0911d-ffb3-48d1-a52c-9872c2a8ddde");
// c6e7a518-42a8-4294-9ca5-a0ab27c4e1fd and productKEY: $2a$10$RWNjz00vZRziyPKnYsbyn.BttXkCLkgE1b2BUgHR7cN8MLMnf3VZC