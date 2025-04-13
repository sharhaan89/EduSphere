import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

import userRouter from "./routes/userRoutes.js";
import voteRouter from "./routes/voteRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import replyRouter from "./routes/replyRoutes.js";
import threadRouter from "./routes/threadRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import leaderboardRouter from "./routes/leaderboardRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/forum/thread", threadRouter);
app.use("/forum/reply", replyRouter);
app.use("/forum/vote", voteRouter);
app.use("/report", reportRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/acp", adminRouter);

// API endpoint to verify current user (for testing)
app.get("/api/user/currentuser", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/user/currentuser`, {
      headers: {
        ...req.headers,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
});

// Track users by room
const rooms = new Map(); // Using Map to store room => users mapping

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  const username = socket.handshake.query.username;
  const initialRoom = socket.handshake.query.room || 'general'; // Default to 'general' if no room specified

  console.log(`User connected: ${username} (${userId}) with socket ID: ${socket.id}`);
  console.log(`Initial room request: ${initialRoom}`);

  // Store user data on socket object for easy access
  socket.userData = {
    userId,
    username,
    socketId: socket.id
  };
  
  // Set an initial room but don't join yet - wait for explicit joinRoom event
  socket.currentRoom = null;

  // Handle explicit room joining
  socket.on("joinRoom", (roomName) => {
    // If already in a room, leave it first
    if (socket.currentRoom) {
      leaveRoom(socket, socket.currentRoom);
    }
    
    joinRoom(socket, roomName);
  });

  // Send the initial joinRoom request based on connection parameters
  socket.emit("connect_confirm", { socketId: socket.id });
  
  // Automatically join the initial room after connection
  process.nextTick(() => {
    joinRoom(socket, initialRoom);
  });

  socket.on("sendMessage", (message) => {
    const room = message.room || socket.currentRoom;
    
    if (!room) {
      console.error(`Message error: User ${username} not in any room`);
      return;
    }
    
    // Make sure userId is stored as a string consistently
    const messageToSend = {
      ...message,
      userId: String(message.userId),
      room: room
    };
    
    console.log(`Message from ${username} (${messageToSend.userId}) in room ${room}: ${message.text}`);
    
    // Send the message to all users in the room (including sender for consistency)
    io.to(room).emit("message", messageToSend);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${username} (${userId}) from socket ${socket.id}`);
    
    // Remove user from their current room if any
    if (socket.currentRoom) {
      leaveRoom(socket, socket.currentRoom);
    }
  });
  
  // Helper function to join a room
  function joinRoom(socket, roomName) {
    // Join the socket.io room
    socket.join(roomName);
    socket.currentRoom = roomName;
    
    // Initialize room in our tracking Map if it doesn't exist
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Map());
    }
    
    // Add user to room Map - ensure userId is stored as string
    const roomUsers = rooms.get(roomName);
    roomUsers.set(socket.id, {
      socketId: socket.id,
      userId: String(socket.userData.userId),
      username: socket.userData.username
    });
    
    console.log(`User ${socket.userData.username} joined room: ${roomName}`);
    console.log(`Room ${roomName} now has ${roomUsers.size} users`);
    
    // Send updated user list to everyone in the room
    updateRoomUsers(roomName);
  }
  
  // Helper function to leave a room
  function leaveRoom(socket, roomName) {
    socket.leave(roomName);
    
    // Remove user from room in our tracking Map
    if (rooms.has(roomName)) {
      const roomUsers = rooms.get(roomName);
      roomUsers.delete(socket.id);
      
      console.log(`User ${socket.userData.username} left room: ${roomName}`);
      console.log(`Room ${roomName} now has ${roomUsers.size} users`);
      
      // If room is empty, remove it from our tracking
      if (roomUsers.size === 0) {
        rooms.delete(roomName);
        console.log(`Room ${roomName} removed (empty)`);
      } else {
        // Send updated user list to everyone still in the room
        updateRoomUsers(roomName);
      }
    }
    
    socket.currentRoom = null;
  }
  
  // Helper function to broadcast updated user list to a room
  function updateRoomUsers(roomName) {
    if (!rooms.has(roomName)) return;
    
    const roomUsers = rooms.get(roomName);
    const userList = Array.from(roomUsers.values());
    
    io.to(roomName).emit("onlineUsers", userList);
  }
});

try {
  server.listen(PORT, () => {
    console.log(`✅ Server running on PORT: ${PORT}`);
  });
} catch (err) {
  console.log("Error in starting the server:", err);
}