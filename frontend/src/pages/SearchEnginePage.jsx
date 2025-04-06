import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchEnginePage() {
  const [activeTab, setActiveTab] = useState("threads");
  const [threadFormData, setThreadFormData] = useState({
    username: "",
    threadid: "",
    title: "",
    keywords: "",
    subforum: "",
    date_from: "",
    date_to: "",
    sort_by: "newest",
    locked: "all",
  });
  const [replyFormData, setReplyFormData] = useState({
    username: "",
    replyid: "",
    threadid: "",
    keywords: "",
    date_from: "",
    date_to: "",
    sort_by: "newest",
  });
  const [userFormData, setUserFormData] = useState({
    userid: "",
    email: "",
    name: "",
    username: "",
    roll_number: "",
    sort_by: "newest",
  });
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleThreadChange = (e) => {
    setThreadFormData({ ...threadFormData, [e.target.name]: e.target.value });
  };

  const handleReplyChange = (e) => {
    setReplyFormData({ ...replyFormData, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleThreadSearch = async () => {
    setLoading(true);
    setError("");
    setReplies([]);
    setUsers([]);

    try {
      const params = new URLSearchParams(threadFormData);
      const response = await fetch(
        `${API_URL}/forum/thread/search?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch threads.");

      const data = await response.json();
      setThreads(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleReplySearch = async () => {
    setLoading(true);
    setError("");
    setThreads([]);
    setUsers([]);

    try {
      const params = new URLSearchParams(replyFormData);
      const response = await fetch(
        `${API_URL}/forum/reply/search?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch replies.");

      const data = await response.json();
      setReplies(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleUserSearch = async () => {
    setLoading(true);
    setError("");
    setThreads([]);
    setReplies([]);

    try {
      const params = new URLSearchParams(userFormData);
      const response = await fetch(
        `${API_URL}/user/search?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch users.");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Advanced Search</h1>
            <p className="text-indigo-100 mt-1">
              Find exactly what you're looking for in our database
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {["threads", "replies", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-medium text-sm uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? "text-indigo-600 border-b-2 border-indigo-600 font-semibold" 
                    : "text-gray-500 hover:text-indigo-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Thread Search Form */}
            {activeTab === "threads" && (
              <SearchCard title="Search for Threads">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Thread ID" 
                    name="threadid" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                  />
                  <Input 
                    label="Username" 
                    name="username" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                  />
                  <Input 
                    label="Title" 
                    name="title" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid}
                  />
                  <Input 
                    label="Keywords" 
                    name="keywords" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                  />
                  <Input 
                    label="Subforum" 
                    name="subforum" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                  />
                  <Input 
                    type="date" 
                    label="Date From" 
                    name="date_from"
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                  />
                  <Input 
                    type="date" 
                    label="Date To" 
                    name="date_to"
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                  />

                  <Select 
                    label="Sort By" 
                    name="sort_by" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid}
                    options={[
                      { value: "newest", text: "Newest" },
                      { value: "oldest", text: "Oldest" },
                      { value: "popular", text: "Most Popular" },
                    ]} 
                  />

                  <Select 
                    label="Locked" 
                    name="locked" 
                    formData={threadFormData} 
                    handleChange={handleThreadChange} 
                    disabled={threadFormData.threadid} 
                    options={[
                      { value: "all", text: "All" },
                      { value: "true", text: "Locked" },
                      { value: "false", text: "Unlocked" },
                    ]} 
                  />
                </div>

                <button 
                  onClick={handleThreadSearch} 
                  className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  Search Threads
                </button>
              </SearchCard>
            )}

            {/* Reply Search Form */}
            {activeTab === "replies" && (
              <SearchCard title="Search for Replies">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Reply ID" 
                    name="replyid" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                  />
                  <Input 
                    label="Thread ID" 
                    name="threadid" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                  />
                  <Input 
                    label="Username" 
                    name="username" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                  />
                  <Input 
                    label="Keywords" 
                    name="keywords" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                  />
                  <Input 
                    type="date" 
                    label="Date From" 
                    name="date_from" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                  />
                  <Input 
                    type="date" 
                    label="Date To" 
                    name="date_to" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                  />
                  <Select 
                    label="Sort By" 
                    name="sort_by" 
                    formData={replyFormData} 
                    handleChange={handleReplyChange} 
                    disabled={replyFormData.replyid} 
                    options={[
                      { value: "newest", text: "Newest" },
                      { value: "oldest", text: "Oldest" },
                      { value: "popular", text: "Most Popular" },
                    ]} 
                  />
                </div>

                <button 
                  onClick={handleReplySearch} 
                  className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  Search Replies
                </button>
              </SearchCard>
            )}

            {/* User Search Form */}
            {activeTab === "users" && (
              <SearchCard title="Search for Users">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="User ID" 
                    name="userid" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                  />
                  <Input 
                    label="Email" 
                    name="email" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                    disabled={userFormData.userid} 
                    type="email"
                  />
                  <Input 
                    label="Name" 
                    name="name" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                    disabled={userFormData.userid} 
                  />
                  <Input 
                    label="Username" 
                    name="username" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                    disabled={userFormData.userid} 
                  />
                  <Input 
                    label="Roll Number" 
                    name="roll_number" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                    disabled={userFormData.userid} 
                  />
                  <Select 
                    label="Sort By" 
                    name="sort_by" 
                    formData={userFormData} 
                    handleChange={handleUserChange} 
                    disabled={userFormData.userid} 
                    options={[
                      { value: "newest", text: "Newest" },
                      { value: "oldest", text: "Oldest" },
                      { value: "alphabetical", text: "Alphabetical" },
                    ]} 
                  />
                </div>

                <button 
                  onClick={handleUserSearch} 
                  className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  Search Users
                </button>
              </SearchCard>
            )}

            {/* Display Results */}
            <div className="mt-8">
              {loading && (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
              
              {/* Thread Results */}
              {threads.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Thread Results
                  </h2>
                  <div className="space-y-4">
                    {threads.map((thread) => (
                      <div 
                        key={thread.id} 
                        className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => window.location.href = `/forum/thread/${thread.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-800 transition-colors">
                            {thread.title}
                          </h3>
                          <span className={`px-3 py-1 text-xs rounded-full ${thread.locked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                            {thread.locked ? "Locked" : "Unlocked"}
                          </span>
                        </div>
                        <div className="text-gray-600 mt-2 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: thread.content }}
                        />

                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                          <p>
                            By <span className="font-medium text-indigo-600">{thread.username}</span>
                          </p>
                          <p>Created on {thread.created_at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reply Results */}
              {replies.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-800 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Reply Results
                  </h2>
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div 
                        key={reply.replyid} 
                        className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => window.location.href = `/forum/thread/${reply.thread_id}`}
                      >
                        <p className="text-gray-600 line-clamp-3">{reply.content}</p>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                          <p>
                            By <span className="font-medium text-purple-600">{reply.username}</span>
                          </p>
                          <p>Posted on {reply.created_at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* User Results */}
              {users.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      </svg>
                    </span>
                    User Results
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((user) => (
                      <div 
                        key={user.userid} 
                        className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => window.location.href = `/user/${user.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                            {user.name}
                          </h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            ID: {user.userid}
                          </span>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Username: {user.username}
                          </p>
                          <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Email: {user.email}
                          </p>
                          {user.roll_number && (
                            <p className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                              Roll Number: {user.roll_number}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ label, name, formData, handleChange, disabled = false, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
        disabled={disabled}
      />
    </div>
  );
}

// Reusable Select Component
function Select({ label, name, formData, handleChange, disabled = false, options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.text}</option>
        ))}
      </select>
    </div>
  );
}

// Reusable Card Component
function SearchCard({ title, children }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}