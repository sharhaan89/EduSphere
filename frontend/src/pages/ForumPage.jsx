import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaBriefcase,
  FaProjectDiagram,
  FaLaptopCode,
  FaComments,
  FaUniversity,
  FaShoppingCart,
  FaSearch,
} from "react-icons/fa";

const categories = [
  {
    name: "Academics",
    path: "/forum/academics",
    icon: <FaBook />,
    description: "Courses, exams, and academic resources",
  },
  {
    name: "Club Activities",
    path: "/forum/clubs",
    icon: <FaUsers />,
    description: "Technical and cultural clubs on campus",
  },
  {
    name: "Internships & Placements",
    path: "/forum/internships",
    icon: <FaBriefcase />,
    description: "Job opportunities and career advice",
  },
  {
    name: "Projects & Research",
    path: "/forum/projects",
    icon: <FaProjectDiagram />,
    description: "Research opportunities and project collaborations",
  },
  {
    name: "Coding & CP",
    path: "/forum/coding",
    icon: <FaLaptopCode />,
    description: "Competitive programming and coding challenges",
  },
  {
    name: "General Discussions",
    path: "/forum/general",
    icon: <FaComments />,
    description: "Talk about anything and everything",
  },
  {
    name: "Hostel & Campus Life",
    path: "/forum/campus",
    icon: <FaUniversity />,
    description: "Life in hostels and around campus",
  },
  {
    name: "Buy & Sell",
    path: "/forum/marketplace",
    icon: <FaShoppingCart />,
    description: "Campus marketplace for students",
  },
  {
    name: "Lost & Found",
    path: "/forum/lost-found",
    icon: <FaSearch />,
    description: "Help find or return lost items",
  },
];

export default function ForumPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] to-[#2a0d4a]"></div>


      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 transform transition-all duration-300 hover:scale-105">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              <span className="inline-block transform hover:rotate-3 transition-transform duration-300">
                ✪
              </span>
              <span className="mx-2">EduSphere Forums</span>
              <span className="inline-block transform hover:-rotate-3 transition-transform duration-300">
                ✪
              </span>
            </h1>
            <p className="mt-2 text-base text-indigo-100 max-w-2xl mx-auto">
              Connect, collaborate, and communicate with the campus community
            </p>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.path + "/all"}
                className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-5 h-full flex flex-col items-center justify-center text-center border border-indigo-400/30 group-hover:border-white/30 transition-all duration-300">
                  <div className="text-3xl text-white mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {category.name}
                  </h3>

                  <p className="text-xs text-indigo-100 max-h-0 group-hover:max-h-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                  </p>

                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-xs font-medium text-white">
                      Explore
                      <svg
                        className="ml-1 h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="mt-10 text-center text-white/80">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} EduSphere Forums. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
