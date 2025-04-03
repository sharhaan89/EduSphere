"use client"

import DOMPurify from "dompurify";
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { AlertCircle, ArrowLeft, Flag, User, MessageSquare, Send } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const ReportCreatePage = () => {
  const { reportee_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Get query parameters from URL
  const queryParams = new URLSearchParams(location.search)
  const reply_id = queryParams.get("reply_id")
  const thread_id = queryParams.get("thread_id")

  const [reportee, setReportee] = useState(null)
  const [thread, setThread] = useState(null)
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  // Predefined reason options
  const reasonOptions = ["Harassment", "Disrespect", "Spam", "Inappropriate Content", "Misinformation", "Other"]

  useEffect(() => {
    const fetchReportee = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${reportee_id}`)
        if (!response.ok) throw new Error("Failed to fetch reportee details")

        const data = await response.json()
        setReportee(data.user)
      } catch (error) {
        console.error("Error fetching reportee:", error)
      }
    }

    const fetchThread = async () => {
      try {
        const response = await fetch(`${API_URL}/forum/thread/${thread_id}`)
        if (!response.ok) throw new Error("Failed to fetch thread details")

        const data = await response.json()
        setThread(data.thread)
      } catch (error) {
        console.error("Error fetching thread:", error)
      }
    }

    const fetchReply = async () => {
      try {
        const response = await fetch(`${API_URL}/forum/reply/getreply/${reply_id}`)
        if (!response.ok) throw new Error("Failed to fetch reply details")

        const data = await response.json()
        setReply(data.reply)
      } catch (error) {
        console.error("Error fetching reply:", error)
      }
    }

    const fetchData = async () => {
      setLoading(true)
      if (reportee_id) await fetchReportee()

      // Only fetch one of these, never both as per requirements
      if (thread_id) await fetchThread()
      else if (reply_id) await fetchReply()

      setLoading(false)
    }

    fetchData()
  }, [reportee_id, thread_id, reply_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reportee_id,
          thread_id: thread_id || null,
          reply_id: reply_id || null,
          reason,
          details,
        }),
      })
      if (!response.ok) throw new Error("Failed to submit report")

      // Show success message
      const successElement = document.getElementById("success-message")
      if (successElement) {
        successElement.classList.remove("hidden")
        setTimeout(() => {
          navigate("/forum")
        }, 2000)
      } else {
        alert("Report submitted successfully!")
        navigate("/forum")
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      setSubmitting(false)
    }
  }

  const handleContentClick = () => {
    if (thread_id) {
      navigate(`/forum/thread/${thread_id}`)
    } else if (reply_id && reply?.thread_id) {
      navigate(`/forum/thread/${reply.thread_id}`)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Success message (hidden by default) */}
        <div
          id="success-message"
          className="hidden fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center text-green-500 mb-4">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Report Submitted</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Thank you for helping keep our community safe.
            </p>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Flag className="h-5 w-5" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Submit a Report</h1>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading details...</p>
              </div>
            ) : (
              <>
                {/* User Information */}
                {reportee && (
                  <div className="mb-6 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-300 mr-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">User Information</h3>
                    </div>
                    <div className="ml-7 space-y-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Name:</span> {reportee.name || "N/A"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Roll Number:</span> {reportee.roll_number || "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Thread/Reply Content Preview */}
                {(thread || reply) && (
                  <div
                    className="mb-6 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={handleContentClick}
                  >
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-300 mr-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {thread ? "Thread Content" : "Reply Content"}
                      </h3>
                    </div>
                    {thread && (
                        <div className="ml-7">
                            <p className="font-medium text-lg text-gray-900 dark:text-white">
                            {thread.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(thread.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            </p>
                            <div
                            className="mt-2 text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(thread.content) }}
                            />
                        </div>
                    )}

                    {reply && (
                      <div className="ml-7">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(reply.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">{reply.content}</p>
                      </div>
                    )}

                    <p className="mt-2 text-purple-600 dark:text-purple-300 text-sm ml-7 flex items-center">
                      Click to view full content
                      <svg
                        className="h-4 w-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </p>
                  </div>
                )}

                {/* Report Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-300 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Reports are taken seriously and help maintain a respectful community. Please provide accurate
                      information.
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900 dark:text-white">
                      Reason for reporting:
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select a reason</option>
                      {reasonOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900 dark:text-white">
                      Additional details (optional):
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-900 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[150px] resize-none"
                      placeholder="Please provide more details about your report..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportCreatePage