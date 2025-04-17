import {createServer} from "http";
import {Server } from "socket.io"
import log from "../utils/logHandler.js";
import express from "express";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.SOCKET_PORT || 3000;



const io = new Server(httpServer, {
    cors: { 
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true,
    } 
});

httpServer.listen(PORT, () => {
    log.info(`Socket.io server running on port ${PORT}`);
});

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
        log.warn("User ID missing in handshake query. Disconnecting socket.");
        socket.disconnect();
        return;
    }

    socket.join(userId); 
    log.info(`User ${userId} connected and joined room ${userId}`);

    socket.on("disconnect", () => {
        log.info(`User ${userId} disconnected`);
    });
});

export default io;