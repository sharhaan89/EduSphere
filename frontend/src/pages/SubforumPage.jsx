"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

export default function SubforumPage() {
  let { subforum } = useParams()
  subforum = subforum.toLowerCase();
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(`${API_URL}/forum/thread/${subforum}/all`)
    fetch(`${API_URL}/forum/thread/${subforum}/all`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Threads Data:", data)
        setThreads(data)
      })
      .catch((err) => console.error("Error fetching threads:", err))
      .finally(() => setLoading(false))
  }, [subforum])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                {subforum.charAt(0).toUpperCase() + subforum.slice(1)}
              </span>{" "}
              Forum
            </h1>
            <Link
              to={`/forum/thread/${subforum}/create`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Thread
            </Link>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join the conversation or start a new discussion
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading threads...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 text-center">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No threads yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Be the first to start a discussion in this forum!</p>
            <Link
              to={`/forum/thread/${subforum}/create`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
            >
              Create Thread
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Link to={`/forum/thread/${thread.id}`} key={thread.id} className="block transition-all duration-200">
                <div className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{thread.title}</h2>
                    {/*PENDING TASK: MANAGE THE REPLIES COUNT SHOWING IN THE SUBFORUM PAGE
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {thread.repliesCount || 0} {thread.repliesCount === 1 ? "reply" : "replies"}
                    </span>
                    */}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {thread.username ? thread.username.charAt(0).toUpperCase() : "?"}
                      </div>
                      <span className="ml-2">{thread.username}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <time dateTime={thread.created_at}>
                      {new Date(thread.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <time dateTime={thread.created_at}>
                      {new Date(thread.created_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {thread.preview && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{thread.preview}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

