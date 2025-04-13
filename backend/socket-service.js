// This is an optional utility file to handle socket connections
// You can use this to centralize your socket logic if you have multiple components that need socket access

import io from "socket.io-client"

let socket = null;
let currentRoom = null;

export const initializeSocket = (userId, username, room = 'general') => {
  // Close any existing connection
  if (socket) {
    console.log("Closing existing socket connection");
    socket.disconnect();
    socket = null;
  }

  // Create new connection with user info and room
  socket = io(process.env.API_URL, {
    query: {
      userId,
      username,
      room
    },
    withCredentials: true
  });

  currentRoom = room;
  console.log(`Socket initialized for user ${username} in room ${room}`);

  // Set up some standard event handlers
  socket.on("connect", () => {
    console.log(`Socket connected with ID: ${socket.id}`);
    socket.emit("joinRoom", room);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }

  return socket;
};

export const joinRoom = (room) => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }

  socket.emit("joinRoom", room);
  currentRoom = room;
  console.log(`Joined room: ${room}`);
};

export const leaveRoom = () => {
  if (!socket || !currentRoom) return;
  
  socket.emit("leaveRoom", currentRoom);
  currentRoom = null;
};

export const getCurrentRoom = () => {
  return currentRoom;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentRoom = null;
    console.log("Socket disconnected");
  }
};

export const sendMessage = (message) => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }

  if (!currentRoom) {
    throw new Error("Not in any room. Join a room first.");
  }

  // Make sure the message has the current room
  const messageWithRoom = {
    ...message,
    room: message.room || currentRoom
  };

  socket.emit("sendMessage", messageWithRoom);
  console.log(`Message sent to room ${messageWithRoom.room}: ${messageWithRoom.text}`);
};