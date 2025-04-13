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
let onlineUsers = [];

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  const username = socket.handshake.query.username;
  const room = socket.handshake.query.room || 'general'; // Default to 'general' if no room specified

  console.log(`User connected: ${username} (${userId}) attempting to join room: ${room}`);

  // Join the specified room
  socket.join(room);
  console.log(`User ${username} joined room: ${room}`);

  // Handle explicit room joining (in case room changes)
  socket.on("joinRoom", (newRoom) => {
    // If the user was in a different room before, leave it first
    if (socket.currentRoom && socket.currentRoom !== newRoom) {
      socket.leave(socket.currentRoom);
      
      // Remove user from previous room in our tracking array
      onlineUsers = onlineUsers.filter(
        user => !(user.socketId === socket.id && user.room === socket.currentRoom)
      );
      
      // Notify clients in the old room
      io.to(socket.currentRoom).emit(
        "onlineUsers", 
        onlineUsers.filter(user => user.room === socket.currentRoom)
      );
    }
    
    // Join new room
    socket.join(newRoom);
    socket.currentRoom = newRoom;
    console.log(`User ${username} joined room: ${newRoom}`);
    
    // Add user to the new room in our tracking
    addUserToRoom(socket.id, userId, username, newRoom);
  });

  // Store the current room on the socket object for reference
  socket.currentRoom = room;

  // Add user to room or update if already exists
  addUserToRoom(socket.id, userId, username, room);

  socket.on("sendMessage", (message) => {
    const messageRoom = message.room || socket.currentRoom;
    console.log(`Message from ${username} in room ${messageRoom}: ${message.text}`);
    // Send the message only to users in the same room
    io.to(messageRoom).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${username} (${userId}) from room: ${socket.currentRoom}`);

    // Remove user from tracking array
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    
    // Only emit updated users for the specific room
    if (socket.currentRoom) {
      const roomUsers = onlineUsers.filter(user => user.room === socket.currentRoom);
      io.to(socket.currentRoom).emit("onlineUsers", roomUsers);
    }
  });
});

// Helper function to add or update a user in a room
function addUserToRoom(socketId, userId, username, room) {
  // Check if user is already in the room
  const existingIndex = onlineUsers.findIndex(
    user => user.userId === userId && user.room === room
  );
  
  if (existingIndex !== -1) {
    // Update existing user's socket ID
    onlineUsers[existingIndex].socketId = socketId;
    console.log(`Updated socket ID for ${username} in room ${room}`);
  } else {
    // Add new user to room
    onlineUsers.push({
      socketId,
      userId,
      username,
      room
    });
    console.log(`Added ${username} to room ${room}`);
  }
  
  // Send updated user list to everyone in the room
  const roomUsers = onlineUsers.filter(user => user.room === room);
  io.to(room).emit("onlineUsers", roomUsers);
}

try {
  server.listen(PORT, () => {
    console.log(`✅ Server running on PORT: ${PORT}`);
  });
} catch (err) {
  console.log("Error in starting the server.");
}