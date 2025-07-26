"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaSearch, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa"

const API_URL = import.meta.env.VITE_API_URL

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Forums", path: "/forum" },
    { name: "Academics", path: "/forum/academics/all" },
    { name: "Campus Life", path: "/forum/campus/all" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Chat Rooms", path: "/chats" },
    { name: "Search", path: "/forum/search" },
  ]

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    // Navigate to search results page
    // history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }

  // Check if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false)
      //setNotificationsOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        const response = await fetch(`${API_URL}/user/currentuser`, {
          method: "GET",
          credentials: "include", // Ensures cookies are sent
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        const modifiedData = { ...data, unreadNotifications: 3 }; //MODIFY THIS WHEN ADDED NOTIFICATIONS SYSTEMS
        setUser(modifiedData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    handleGetUser();
  }, []);

  const currentUser = user;

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-2">
                E
              </div>
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                EduSphere
              </span>
            </Link>
        </div>

{/* Desktop Navigation */}
<div className="hidden md:ml-8 md:flex md:space-x-4">
  {navLinks.map((link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
        location.pathname === link.path
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
      }`}
    >
      {link.name === "Search" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      )}
      {link.name}
    </Link>
  ))}

  {currentUser && ["admin", "developer"].includes(currentUser?.role) && (
    <Link
      to="/acp"
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
        location.pathname === "/acp"
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 3v1.5m4.5-1.5V4.5m-9 4.5H3v11.25A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5V9H18m-3-4.5v4.5M9 4.5v4.5m0 3h6"
        />
      </svg>
      ACP
    </Link>
  )}
</div>



          {/* Search, notifications, and profile */}
          <div className="flex items-center">

            {/* Profile dropdown - only show if user is logged in */}
            {currentUser && (
              <div className="ml-4 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                    //setNotificationsOpen(false)
                  }}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                >
                  <span className="sr-only">Open user menu</span>
                  {currentUser.avatar ? (
                    <img className="h-8 w-8 rounded-full" src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {getInitials(currentUser.name)}
                    </div>
                  )}
                  <span className="hidden md:flex md:items-center ml-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser.username}</span>
                    <svg
                      className="ml-1 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                {/* Profile dropdown menu */}
                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <Link
                        to={`/user/${currentUser.userid}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaUserCircle className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaCog className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Settings
                      </Link>
                      <button
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={async () => {
                              try {
                              const response = await fetch(`${API_URL}/user/logout`, {
                                  method: "POST",
                                  credentials: "include", // Important for sending cookies
                              });

                              if (!response.ok) throw new Error("Failed to sign out");

                              console.log("Signed out successfully");
                              navigate("/")
                              window.location.reload(); // Refresh the page
                              } catch (error) {
                              console.error("Error signing out:", error);
                              }
                          }}
                          >
                          <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Sign out
                        </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-800"
                    : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile search */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search forums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400">
                  <FaSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}