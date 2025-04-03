"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { FaGithub, FaLinkedin, FaEdit, FaCalendarAlt, FaTrophy, FaEnvelope, FaIdCard, FaHistory, FaFlag, FaComments, FaListUl } from "react-icons/fa"

const API_URL = import.meta.env.VITE_API_URL

export default function UserProfilePage() {
  const { userid } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null) // This would come from your auth context
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate getting the current user ID from auth context
    // In a real app, you'd get this from your authentication system
    setCurrentUserId("2") // Replace with actual logic

    async function fetchUser() {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/user/${userid}`)
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userid])

  // Blank functions for the new features
  const handleReportUser = () => {
    navigate(`/report/${userid}`)
    console.log("Report user clicked")
  }

  const viewAllReplies = () => {
    // Will contain functionality to view all replies by the user
    console.log("View all replies clicked")
  }

  const viewAllThreads = () => {
    // Will contain functionality to view all threads by the user
    console.log("View all threads clicked")
  }

  // Utility functions
  function getMemberSince(created_at) {
    const diff = new Date() - new Date(created_at)
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    return years > 0 ? `${years} years ago` : "Less than a year ago"
  }

  function getBadge(reputation) {
    if (reputation > 500) return { icon: "🥇", label: "FOUNDER", color: "from-orange-500 to-orange-500" }
    if (reputation > 100) return { icon: "🏆", label: "Active Member", color: "from-blue-500 to-indigo-500" }
    return { icon: "⭐", label: "New User", color: "from-green-500 to-emerald-500" }
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">User Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The user profile you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/forum"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Return to Forums
          </Link>
        </div>
      </div>
    )
  }

  const badge = getBadge(user.reputation)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          to="/forum"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Forums
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
            {userid === currentUserId && (
              <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                <FaEdit className="h-5 w-5" />
                <span className="sr-only">Edit Profile</span>
              </button>
            )}
            {/* Report Button (only visible if not looking at own profile) */}
            {userid !== currentUserId && (
              <button 
                onClick={handleReportUser}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              >
                <FaFlag className="h-5 w-5" />
                <span className="sr-only">Report User</span>
              </button>
            )}
          </div>

          <div className="px-6 py-8 md:px-8 relative">
            {/* Profile Picture */}
            <div className="absolute -top-16 left-6 md:left-8">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={`https://www.gravatar.com/avatar/${btoa(user.email)}`}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {getInitials(user.name)}
                  </div>
                )}
                <div
                  className={`absolute -bottom-2 -right-2 rounded-full px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${badge.color} shadow-md`}
                >
                  {badge.icon} {badge.label}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{user.username}</p>
                </div>

                {userid === currentUserId ? (
                  <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={handleReportUser}
                    className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    <FaFlag className="mr-2 h-4 w-4" />
                    Report User
                  </button>
                )}
              </div>

              {/* Activity Buttons Row */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={viewAllThreads}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaListUl className="mr-2 h-4 w-4 text-indigo-500" />
                  All Threads
                </button>
                
                <button
                  onClick={viewAllReplies}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaComments className="mr-2 h-4 w-4 text-indigo-500" />
                  All Replies
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <FaIdCard className="mr-2 text-indigo-500" />
                      Profile Information
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-gray-500 dark:text-gray-400">Email:</div>
                        <div className="flex-1 text-gray-900 dark:text-white flex items-center">
                          <FaEnvelope className="mr-2 text-indigo-500" />
                          {user.email}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-gray-500 dark:text-gray-400">Roll Number:</div>
                        <div className="flex-1 text-gray-900 dark:text-white">{user.roll_number}</div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-gray-500 dark:text-gray-400">Reputation:</div>
                        <div className="flex-1 text-gray-900 dark:text-white flex items-center">
                          <FaTrophy className="mr-2 text-yellow-500" />
                          {user.reputation} points
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      Member Information
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-gray-500 dark:text-gray-400">Joined:</div>
                        <div className="flex-1 text-gray-900 dark:text-white">
                          {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-24 flex-shrink-0 text-gray-500 dark:text-gray-400">Member For:</div>
                        <div className="flex-1 text-gray-900 dark:text-white">{getMemberSince(user.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(user.github || user.linkedin) && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Social Links</h2>
                      <div className="flex space-x-3">
                        {user.github && (
                          <a
                            href={user.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                          >
                            <FaGithub className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        )}
                        {user.linkedin && (
                          <a
                            href={user.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                          >
                            <FaLinkedin className="mr-2 h-4 w-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FaHistory className="mr-2 text-indigo-500" />
                    Recent Activity
                  </h2>

                  {user.recentThreads?.length > 0 ? (
                    <div className="space-y-3">
                      {user.recentThreads.slice(0, 5).map((thread) => (
                        <Link
                          key={thread.id}
                          to={`/thread/${thread.id}`}
                          className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-sm hover:shadow"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white">{thread.title}</h3>
                          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{thread.subforum}</span>
                          </div>
                        </Link>
                      ))}

                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={viewAllThreads}
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                          View all threads
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={viewAllReplies}
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                          View all replies
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}