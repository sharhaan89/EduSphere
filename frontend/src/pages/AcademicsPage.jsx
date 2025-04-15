"use client"

import { Link } from "react-router-dom"

export default function AcademicsPage() {
  const semesters = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Semester ${i + 1}`,
    slug: `Academics-Sem${i + 1}`,
    description: `Discussions, resources, and questions about Semester ${i + 1} courses and materials.`
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Academics
              </span>
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Browse academic discussions by semester, or start a new conversation
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {semesters.map((semester) => (
            <Link 
              to={`/forum/${semester.slug}/all`} 
              key={semester.id} 
              className="block transition-all duration-200"
            >
              <div className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg p-5 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{semester.name}</h2>
                  <div className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Academic Forum
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {semester.description}
                </p>
                <div className="mt-4 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-indigo-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Browse discussions
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}