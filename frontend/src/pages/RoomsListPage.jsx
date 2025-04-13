import { Link } from "react-router-dom"

const roomCategories = {
  Academics: ["Doubt Room", "Exam Prep", "Projects"],
  Life: ["Random Talks", "Mental Health", "Foodies"],
  Sports: ["Cricket", "Football", "Fitness"],
}

export default function RoomsListPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Join a Chat Room
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {Object.entries(roomCategories).map(([category, rooms]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 shadow rounded-2xl p-5"
          >
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
              {category}
            </h2>
            <ul className="space-y-3">
              {rooms.map((room) => (
                <li key={room}>
                  <Link
                    to={`/chat/${encodeURIComponent(room)}`}
                    className="block px-4 py-2 bg-indigo-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600 text-indigo-700 dark:text-white rounded-lg font-medium transition"
                  >
                    {room}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
