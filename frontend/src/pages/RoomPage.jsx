"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import io from "socket.io-client"
import { FiSend, FiUser, FiUsers, FiMessageSquare } from "react-icons/fi"

const API_URL = import.meta.env.VITE_API_URL;

const RoomPage = () => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { currentRoom } = useParams();
  const socketRef = useRef(null)
  const chatContainerRef = useRef()
  const navigate = useNavigate()
  const currentUsernameRef = useRef(null); // Use username instead of ID for more reliable comparison

  // Connect to socket and fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/user/currentuser`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch current user")
        }
        const userData = await response.json()
        setCurrentUser(userData)
        currentUsernameRef.current = userData.username; // Store username in ref for reliable comparison
        console.log("Current user set:", userData);

        // Clean up existing socket connection if any
        if (socketRef.current) {
          console.log("Cleaning up existing socket connection")
          socketRef.current.disconnect()
          socketRef.current = null
        }

        // Initialize new socket connection
        initializeSocket(userData)
      } catch (err) {
        console.error(err);
        setError("Failed to load user data. Please try again later.")
        setLoading(false)
      }
    }
      
    fetchCurrentUser()

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket from cleanup")
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [currentRoom]) // Reconnect if room changes

  const initializeSocket = (user) => {
    console.log(`Initializing new socket connection for room: ${currentRoom}`)
    
    // Connect to the socket server with room information
    socketRef.current = io(API_URL, {
      query: {
        userId: user.id,
        username: user.username,
        room: currentRoom
      },
      withCredentials: true
    })

    // Set up event listeners
    socketRef.current.on("connect", () => {
      console.log(`Connected to socket server with ID: ${socketRef.current.id}`)
      
      // Explicitly join the room after connection
      socketRef.current.emit("joinRoom", currentRoom);
      
      // Reset messages when joining a new room
      setMessages([])
      setLoading(false)
    })

    socketRef.current.on("message", (message) => {
      console.log("Received message:", message);
      console.log("Current username:", currentUsernameRef.current);
      console.log("Message username:", message.username);
      console.log("Is own message:", message.username === currentUsernameRef.current);

      setMessages((prevMessages) => [...prevMessages, message])
    })

    socketRef.current.on("onlineUsers", (users) => {
      console.log("Online users updated:", users)
      setOnlineUsers(users)
    })

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err)
      setError("Failed to connect to chat server. Please try again later.")
      setLoading(false)
    })
    
    socketRef.current.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`)
    })
  }

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!messageInput.trim() || !socketRef.current) return

    const messageData = {
      userId: currentUser.id,
      username: currentUser.username,
      text: messageInput,
      timestamp: new Date().toISOString(),
      room: currentRoom
    }

    // Send message to server
    socketRef.current.emit("sendMessage", messageData)
    console.log("Sending message:", messageData)

    setMessageInput("")
  }

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Online Users Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <FiUsers className="mr-2" /> Online Users
            <span className="ml-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {onlineUsers.length}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {onlineUsers.map((user) => (
            <div
              key={user.socketId}
              className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer mb-1"
              onClick={() => handleUserClick(user.userId)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-indigo-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
              </div>
            </div>
          ))}

          {onlineUsers.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>No users online</p>
            </div>
          )}
        </div>

        {currentUser && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <FiUser className="text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser.username}</p>
                <p className="text-xs text-gray-500">You</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
            <h1 className="text-xl font-semibold flex items-center">
                <FiMessageSquare className="mr-2" /> Chat Room: {currentRoom}
            </h1>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FiMessageSquare className="h-12 w-12 mb-2" />
              <p>No messages yet. Start the conversation in {currentRoom}!</p>
            </div>
          )}

          {messages.map((message, index) => {
            // Use username for comparison instead of userId
            const isOwnMessage = message.username === currentUsernameRef.current;
            
            return (
              <div 
                key={`${message.timestamp}-${index}`} 
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                {!isOwnMessage && (
                  <div
                    className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2 cursor-pointer"
                    onClick={() => handleUserClick(message.userId)}
                  >
                    <FiUser className="text-indigo-600 text-sm" />
                  </div>
                )}

                <div
                  className={`max-w-md ${
                    isOwnMessage
                      ? "bg-indigo-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                      : "bg-white border border-gray-200 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                  } px-4 py-2 shadow-sm`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-medium text-indigo-600 mb-1">{message.username}</p>
                  )}
                  <p>{message.text}</p>
                  <p
                    className={`text-xs ${isOwnMessage ? "text-indigo-100" : "text-gray-500"} text-right mt-1`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Type your message in ${currentRoom}...`}
              className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RoomPage