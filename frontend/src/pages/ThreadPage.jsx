"use client"

import DOMPurify from "dompurify";
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Trash2, Edit, Flag } from "lucide-react"; 

const API_URL = import.meta.env.VITE_API_URL

export default function ThreadPage() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [voteLoading, setVoteLoading] = useState(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [posting, setPosting] = useState(false)
  const [threadVotes, setThreadVotes] = useState(0)
  const [replyVotes, setReplyVotes] = useState({})

  async function fetchVoteCounts() {
    try {
      const threadVoteResponse = await fetch(`${API_URL}/forum/vote/thread/${id}`)
      const threadVoteData = await threadVoteResponse.json()
      setThreadVotes(threadVoteData.net_votes)

      const votesMapping = {}
      await Promise.all(
        replies.map(async (reply) => {
          const replyVoteResponse = await fetch(`${API_URL}/forum/vote/reply/${reply.id}`)
          const replyVoteData = await replyVoteResponse.json()
          votesMapping[reply.id] = replyVoteData.net_votes
        }),
      )
      setReplyVotes(votesMapping)
    } catch (error) {
      console.error("Error fetching votes:", error)
    }
  }

  useEffect(() => {
    async function fetchThreadAndReplies() {
      try {
        const response = await fetch(`${API_URL}/forum/thread/${id}`)
        const data = await response.json()
        if (response.ok) {
          setThread(data.thread)
          setReplies(data.replies)
        } else {
          console.error("Error fetching thread:", data.error)
        }
      } catch (error) {
        console.error("Error fetching thread:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchThreadAndReplies()
  }, [id])

  useEffect(() => {
    if (thread && replies.length > 0) {
      fetchVoteCounts()
    }
  }, [thread, replies])

  async function handleVote(contentId, contentType, voteType) {
    if (voteLoading) return; // Prevent multiple clicks while request is pending
    setVoteLoading(true); // Lock voting temporarily
  
    try {
      // Optimistically update the UI
      if (contentType === "thread") {
        setThreadVotes((prevVotes) => Number(prevVotes) + voteType);
      } else if (contentType === "reply") {
        setReplyVotes((prevVotes) => ({
          ...prevVotes,
          [contentId]: Number(prevVotes[contentId] || 0) + voteType,
        }));
      }
  
      // Send vote request to backend
      const response = await fetch(`${API_URL}/forum/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          thread_id: contentType === "thread" ? contentId : null,
          reply_id: contentType === "reply" ? contentId : null,
          vote_type: voteType,
        }),
      });
  
      if (!response.ok) {
        console.error("Vote failed");
        fetchVoteCounts(); // Re-fetch correct values from backend if request fails
      } else {
        fetchVoteCounts(); // Fetch correct values after a successful vote
      }
    } catch (error) {
      console.error("Vote error:", error);
      fetchVoteCounts(); // Fetch correct values in case of an error
    } finally {
      setVoteLoading(false); // Unlock voting after request completes
    }
  }
  async function handleSubmitReply(e) {
    e.preventDefault()
    if (!replyContent.trim()) return

    setPosting(true)
    try {
      const response = await fetch(`${API_URL}/forum/reply/thread/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          thread_id: id,
          content: replyContent,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReplies([...replies, data.reply])
        setReplyContent("")
        setShowReplyBox(false)
        window.location.reload();
      } else {
        console.error("Failed to post reply")
      }
    } catch (error) {
      console.error("Error posting reply:", error)
    } finally {
      setPosting(false)
    }
  }

  async function handleDeleteReply(e) {
    e.preventDefault();
  }

  async function handleEditReply(e) {
    e.preventDefault();
  }

  async function handleDeleteThread(e) {
    e.preventDefault();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading thread...</p>
        </div>
      </div>
    )
  }

  if (!thread) {
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
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Thread Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The thread you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <Link
          to={`/forum/${thread.subforum}/all`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to {thread.subforum} forum
        </Link>

        {/* Thread */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {thread.title}
              </h1>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleReportThread()}
                  className="p-2 text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-md shadow-sm flex items-center space-x-1"
                >
                  <Flag size={18} />
                </button>
                <button
                  onClick={() => handleEditThread()}
                  className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md shadow-sm flex items-center space-x-1"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={handleDeleteThread}
                  className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-md shadow-sm flex items-center space-x-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col items-center ml-4">
                <button
                  onClick={() => handleVote(thread.id, "thread", 1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Upvote"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-green-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span
                  className={`font-bold text-lg ${
                    threadVotes > 0
                      ? "text-green-500"
                      : threadVotes < 0
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {threadVotes}
                </span>
                <button
                  onClick={() => handleVote(thread.id, "thread", -1)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Downvote"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500 hover:text-red-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {thread.username
                    ? thread.username.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <span className="ml-2 font-medium">{thread.username}</span>
              </div>
              <span className="mx-2">•</span>
              <time dateTime={thread.created_at}>
                {new Date(thread.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>

            <div className="mt-6 prose prose-indigo dark:prose-invert max-w-none">
              <div
                className="text-gray-800 dark:text-gray-200 whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(thread.content),
                }}
              />
            </div>
          </div>
        </div>

        {/* Reply button */}
        <div className="mb-8">
          <button
            onClick={() => setShowReplyBox(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reply to Thread
          </button>
        </div>

        {/* Reply form */}
        {showReplyBox && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-8 p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Post a Reply
            </h3>
            {/* PENDING WORK: ADD THE QUILL TEXT EDITOR HERE AS WELL */}
            <form onSubmit={handleSubmitReply}>
              <div className="mb-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="Write your reply here..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyBox(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting || !replyContent.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  {posting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    "Post Reply"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Replies */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Replies
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({replies.length})
            </span>
          </h2>

          {replies.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center border border-gray-200 dark:border-gray-700">
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No replies yet. Be the first to reply!
              </p>
              <button
                onClick={() => setShowReplyBox(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
              >
                Post the First Reply
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 ${
                    index === 0 ? "border-l-4 border-l-indigo-500" : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {reply.username
                              ? reply.username.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <div className="ml-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {reply.username}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              <time dateTime={reply.created_at}>
                                {new Date(reply.created_at).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </time>
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-3 text-gray-800 dark:text-gray-200 whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(reply.content),
                          }}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleReportThread()}
                            className="p-1 text-yellow-600 bg-yellow-100 hover:bg-yellow-200 rounded-md shadow-sm flex items-center space-x-1"
                          >
                            <Flag size={18} />
                          </button>
                          <button
                            onClick={() => handleEditThread()}
                            className="p-1 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md shadow-sm flex items-center space-x-1"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={handleDeleteThread}
                            className="p-1 text-red-600 bg-red-100 hover:bg-red-200 rounded-md shadow-sm flex items-center space-x-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center ml-4">
                        <button
                          onClick={() => handleVote(reply.id, "reply", 1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Upvote"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 hover:text-green-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <span
                          className={`font-medium text-sm ${
                            (replyVotes[reply.id] || 0) > 0
                              ? "text-green-500"
                              : (replyVotes[reply.id] || 0) < 0
                              ? "text-red-500"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {replyVotes[reply.id] || 0}
                        </span>
                        <button
                          onClick={() => handleVote(reply.id, "reply", -1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Downvote"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 hover:text-red-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

