"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

export default function ClubsPage() {
  const [activeTab, setActiveTab] = useState("exclusive")

  const exclusiveClubs = [
    {
      id: "ieee",
      name: "IEEE",
      fullName: "Institute of Electrical and Electronics Engineers",
      slug: "Clubs-IEEE",
      description: "Global professional association for advancing technology for humanity.",
      color: "from-blue-500 to-blue-700",
      icon: "🔌"
    },
    {
      id: "acm",
      name: "ACM",
      fullName: "Association for Computing Machinery",
      slug: "Clubs-ACM",
      description: "World's largest educational and scientific computing society.",
      color: "from-red-500 to-red-700",
      icon: "💻"
    },
    {
      id: "iet",
      name: "IET",
      fullName: "Institution of Engineering and Technology",
      slug: "Clubs-IET",
      description: "Professional society for the engineering and technology community.",
      color: "from-purple-500 to-purple-700",
      icon: "⚙️"
    },
    {
      id: "ie",
      name: "IE",
      fullName: "Institution of Engineers",
      slug: "Clubs-IE",
      description: "National organization of engineers across all disciplines.",
      color: "from-green-500 to-green-700",
      icon: "🛠️"
    },
    {
      id: "iste",
      name: "ISTE",
      fullName: "Indian Society for Technical Education",
      slug: "Clubs-ISTE",
      description: "Professional organization focused on technical education advancement.",
      color: "from-yellow-500 to-yellow-700",
      icon: "📚"
    }
  ]

  const nonExclusiveClubs = [
    {
      id: "rotaract",
      name: "Rotaract",
      fullName: "Rotary Action for Youth",
      slug: "Clubs-Rotaract",
      description: "Community service, leadership development, and social networking.",
      color: "from-indigo-500 to-indigo-700",
      icon: "🌍"
    },
    {
      id: "ddfc",
      name: "DDFC",
      fullName: "Debate & Discussion Forum Club",
      slug: "Clubs-DDFC",
      description: "Platform for debates, discussions and public speaking.",
      color: "from-pink-500 to-pink-700",
      icon: "🎤"
    },
    {
      id: "genesis",
      name: "Genesis",
      fullName: "Genesis Creative Club",
      slug: "Clubs-Genesis",
      description: "Fostering creativity, innovation and entrepreneurial mindset.",
      color: "from-cyan-500 to-cyan-700",
      icon: "🎨"
    },
    {
      id: "tedx",
      name: "TedX",
      fullName: "Technology, Entertainment, Design",
      slug: "Clubs-TedX",
      description: "Ideas worth spreading through powerful talks and presentations.",
      color: "from-orange-500 to-orange-700",
      icon: "🔴"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header with animated background */}
        <div className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xOGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0xOCA0YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')] animate-[spin_60s_linear_infinite]"></div>
          </div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Campus Clubs</h1>
            <p className="text-lg text-indigo-200 max-w-2xl">
              Connect with like-minded peers, develop new skills, and engage in exciting activities 
              through our diverse range of student clubs and organizations.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/60 backdrop-blur-sm p-1 rounded-xl flex space-x-2">
            <button
              onClick={() => setActiveTab("exclusive")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "exclusive"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Exclusive Clubs
            </button>
            <button
              onClick={() => setActiveTab("nonexclusive")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "nonexclusive"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Non-Exclusive Clubs
            </button>
          </div>
        </div>

        {/* Club Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "exclusive"
            ? exclusiveClubs.map((club) => (
                <Link 
                  to={`/forum/${club.slug}/all`} 
                  key={club.id}
                  className="group"
                >
                  <div className="h-full bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden relative shadow-xl hover:shadow-indigo-500/20">
                    <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${club.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                    
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{club.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{club.name}</h3>
                        <p className="text-sm text-indigo-300">{club.fullName}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-6">{club.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                      <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">Exclusive Membership</span>
                      <div className="flex items-center text-white group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-sm mr-1">Join forum</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : nonExclusiveClubs.map((club) => (
                <Link 
                  to={`/forum/${club.slug}/all`} 
                  key={club.id}
                  className="group"
                >
                  <div className="h-full bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 overflow-hidden relative shadow-xl hover:shadow-pink-500/20">
                    <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${club.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
                    
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{club.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{club.name}</h3>
                        <p className="text-sm text-pink-300">{club.fullName}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-6">{club.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/40">
                      <span className="text-xs font-medium uppercase tracking-wider text-pink-400">Open Membership</span>
                      <div className="flex items-center text-white group-hover:translate-x-1 transition-transform duration-200">
                        <span className="text-sm mr-1">Join forum</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </div>
  )
}