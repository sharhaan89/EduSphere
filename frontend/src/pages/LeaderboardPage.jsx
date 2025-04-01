"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTrophy, FaMedal, FaAward, FaCrown, FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa"

const API_URL = import.meta.env.VITE_API_URL

const LeaderboardPage = () => {
  const [weeklyLeaders, setWeeklyLeaders] = useState([])
  const [lifetimeLeaders, setLifetimeLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("weekly")
  const [animateIn, setAnimateIn] = useState(true)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    setLoading(true)
    try {
      const [weeklyResponse, lifetimeResponse] = await Promise.all([
        fetch(`${API_URL}/leaderboard/weekly`),
        fetch(`${API_URL}/leaderboard/lifetime`),
      ])

      if (!weeklyResponse.ok || !lifetimeResponse.ok) throw new Error("Failed to fetch leaderboard data")

      const weeklyData = await weeklyResponse.json()
      const lifetimeData = await lifetimeResponse.json()

      setWeeklyLeaders(weeklyData)
      setLifetimeLeaders(lifetimeData)
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    if (tab === activeTab) return

    setAnimateIn(false)
    setTimeout(() => {
      setActiveTab(tab)
      setAnimateIn(true)
    }, 300)
  }

  const getInitials = (username) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-500" />
      case 1:
        return <FaMedal className="text-gray-400" />
      case 2:
        return <FaMedal className="text-amber-700" />
      default:
        return <FaAward className="text-indigo-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Leaderboard
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Recognizing our top contributors and most active community members
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
            <button
              onClick={() => handleTabChange("weekly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "weekly"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Weekly Top 10
            </button>
            <button
              onClick={() => handleTabChange("lifetime")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "lifetime"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Lifetime Top 10
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className={`transition-all duration-300 ${animateIn ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"}`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading leaderboard data...</p>
            </div>
          ) : (
            <>
              {/* Current Leaders */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaCrown className="text-yellow-500 mr-2" />
                  {activeTab === "weekly" ? "This Week's Champions" : "All-Time Champions"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(activeTab === "weekly" ? weeklyLeaders : lifetimeLeaders).slice(0, 3).map((user, index) => (
                    <div
                      key={user.id}
                      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        index === 0 ? "ring-2 ring-yellow-400 dark:ring-yellow-600" : ""
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 transform rotate-45 translate-x-6 translate-y-3 shadow-sm">
                            #1
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : index === 1
                                  ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                  : "bg-gradient-to-br from-amber-600 to-amber-800"
                            }`}
                          >
                            {getInitials(user.username)}
                          </div>
                          <div className="ml-4">
                            <Link
                              to={`/user/${user.username}`}
                              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {user.username}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.roll_number}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            {getRankIcon(index)}
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze"}
                            </span>
                          </div>
                          <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full px-3 py-1">
                            <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                              {user.points} points
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h3 className="text-lg font-semibold text-white">
                    {activeTab === "weekly" ? "Weekly Top 10" : "Lifetime Top 10"}
                  </h3>
                </div>

                {(activeTab === "weekly" ? weeklyLeaders : lifetimeLeaders).length === 0 ? (
                  <div className="p-8 text-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No leaderboard data available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Roll Number
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {(activeTab === "weekly" ? weeklyLeaders : lifetimeLeaders).map((user, index) => (
                          <tr
                            key={user.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                              index < 3 ? "bg-gray-50/50 dark:bg-gray-700/20" : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2">
                                  {getRankIcon(index)}
                                </span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">#{index + 1}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                  {getInitials(user.username)}
                                </div>
                                <div className="ml-3">
                                  <Link
                                    to={`/user/${user.username}`}
                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                  >
                                    {user.username}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {user.roll_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                                {user.points} points
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination (for future use) */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                    <FaChevronLeft className="mr-2 h-3 w-3" />
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                    Next
                    <FaChevronRight className="ml-2 h-3 w-3" />
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                      <span className="font-medium">10</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700">
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-3 w-3" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700">
                        <span className="sr-only">Next</span>
                        <FaChevronRight className="h-3 w-3" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How Points are Calculated</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Points are calculated based on your contributions to the community. Create valuable threads, post
                helpful replies, and receive upvotes to increase your score.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                    +
                  </span>
                  <span>Creating a thread: 5 points</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                    +
                  </span>
                  <span>Posting a reply: 2 points</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                    +
                  </span>
                  <span>Receiving an upvote: 1 point</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Leaderboard Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Top performers on our leaderboard receive special recognition and exclusive benefits within the
                community.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-2">
                    <FaTrophy className="h-3 w-3" />
                  </span>
                  <span>Special profile badges</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-2">
                    <FaTrophy className="h-3 w-3" />
                  </span>
                  <span>Featured on the homepage</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-2">
                    <FaTrophy className="h-3 w-3" />
                  </span>
                  <span>Access to exclusive community events</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage

