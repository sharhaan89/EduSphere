import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import { useNavigate, useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";

const API_URL = import.meta.env.VITE_API_URL;

const Button = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
      disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
    } ${className}`}
  >
    {children}
  </button>
);

const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${className}`}
  />
);

export default function ThreadEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [submitting, setSubmitting] = useState(false); // Separate state for form submission
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const editorInitialized = useRef(false);

  // Fetch thread data when component mounts
  useEffect(() => {
    async function fetchThread() {
      try {
        const response = await fetch(`${API_URL}/forum/thread/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch thread data");
        }
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        setError("Error loading thread data");
      } finally {
        setLoading(false);
      }
    }
    fetchThread();
  }, [id]);

  // Initialize Quill editor after content is loaded
  useEffect(() => {
    if (quillRef.current && !editorInitialized.current && !loading) {
      const quillOptions = {
        theme: "snow",
        placeholder: "Share your thoughts...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      };

      editorRef.current = new Quill(quillRef.current, quillOptions);
      
      if (content) {
        editorRef.current.root.innerHTML = content;
      }

      editorRef.current.on("text-change", () => {
        if (editorRef.current) {
          setContent(editorRef.current.root.innerHTML);
        }
      });
      
      editorInitialized.current = true;
    }
  }, [quillRef.current, loading, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    setError("");
    setSubmitting(true); // Use submitting state for the button

    try {
      const response = await fetch(`${API_URL}/forum/thread/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update thread.");
      }

      navigate(`/forum/thread/${id}`);
    } catch (error) {
      setError("An error occurred while updating the thread.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
        <div className="bg-purple-600 p-4 text-white">
          <h2 className="text-xl font-bold">Edit Thread</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading thread data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thread Title
              </label>
              <Input
                type="text"
                placeholder="Enter an interesting title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <div className="bg-white border border-purple-200 rounded-md">
                <div ref={quillRef} className="min-h-[200px]" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                className="border border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 text-white"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}