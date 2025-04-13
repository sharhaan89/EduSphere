// This is an optional utility file to handle socket connections
// You can use this to centralize your socket logic if you have multiple components that need socket access

import io from "socket.io-client"

let socket

export const initializeSocket = (userId, username) => {
  if (!socket) {
    socket = io(process.env.API_URL, {
      query: {
        userId,
        username,
      },
    })

    console.log("Socket initialized")
  }

  return socket
}

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.")
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    console.log("Socket disconnected")
  }
}

export const sendMessage = (message) => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.")
  }

  socket.emit("sendMessage", message)
}
