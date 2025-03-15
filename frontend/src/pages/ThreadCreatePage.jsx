import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Quill from "quill";
//import "react-quill/dist/quill.snow.css"; // Import Quill styles

const API_URL = import.meta.env.VITE_API_URL

export default function ThreadCreatePage() {
  const { subforum } = useParams(); // Extract subforum from route
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation after thread creation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    setError("");

    try {
      // Simulating an API call to create a thread
      const response = await fetch(`${API_URL}/forum/thread/${subforum}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });      

      if (!response.ok) {
        throw new Error("Failed to create thread.");
      }

      // Navigate to the subforum page after success
      navigate(`/forum/${subforum}/all`);
    } catch (error) {
      setError("An error occurred while creating the thread.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a New Thread in {subforum}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">Thread Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter thread title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">Content</label>
            <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none"
                placeholder="Enter thread content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
        </div>


        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create Thread
        </button>
      </form>
    </div>
  );
}
