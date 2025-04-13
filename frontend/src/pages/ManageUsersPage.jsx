"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiUser, FiLock, FiUnlock } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

const ManageUsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBanned, setFilterBanned] = useState("all") // "all", "banned", "unbanned"
  const [actionLoading, setActionLoading] = useState(null) // to track which user is being updated

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/user/all`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  useEffect(() => {
    // Apply filters and search
    let result = [...users]

    // Filter by banned status
    if (filterBanned === "banned") {
      result = result.filter((user) => user.banned)
    } else if (filterBanned === "unbanned") {
      result = result.filter((user) => !user.banned)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term) ||
          user.roll_number.toLowerCase().includes(term),
      )
    }

    setFilteredUsers(result)
  }, [users, filterBanned, searchTerm])

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  const handleBanUnban = async (e, userId, isBanned) => {
    e.stopPropagation() // Prevent navigation to user details
    setActionLoading(userId)
    
    try {
      const endpoint = isBanned ? `${API_URL}/acp/unban/${userId}` : `${API_URL}/acp/ban/${userId}`
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isBanned ? 'unban' : 'ban'} user`)
      }

      // Update the local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, banned: !isBanned } : user
      ))
    } catch (err) {
      setError(`Action failed: ${err.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Users</h2>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name, username or roll number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterBanned}
            onChange={(e) => setFilterBanned(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="banned">Banned Users</option>
            <option value="unbanned">Active Users</option>
          </select>
        </div>
      </div>

      {/* User Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredUsers.length} of {users.length} users
      </p>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-full p-3 mr-3">
                <FiUser className="h-6 w-6 text-gray-600" />
              </div>
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => handleUserClick(user.id)}
              >
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-500">Roll: {user.roll_number}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {user.banned ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <FiLock className="mr-1 h-3 w-3" />
                    Banned
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiUnlock className="mr-1 h-3 w-3" />
                    Active
                  </span>
                )}
                
                <button
                  onClick={(e) => handleBanUnban(e, user.id, user.banned)}
                  disabled={actionLoading === user.id}
                  className={`mt-2 px-3 py-1 text-xs font-medium rounded-md ${
                    user.banned
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    user.banned ? "focus:ring-green-500" : "focus:ring-red-500"
                  }`}
                >
                  {actionLoading === user.id ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : user.banned ? (
                    "Unban User"
                  ) : (
                    "Ban User"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage