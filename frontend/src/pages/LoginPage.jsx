import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [input, setInput] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [incorrectDetails, setIncorrectDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submit button clicked");

    const requestBody = {
      emailOrUsername: input.identifier,
      password: input.password,
    };

    console.log("Sending request with body:", requestBody);

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login Successful:", data);

      console.log("Cookies after login:", document.cookie);

      window.location.href = "/home";
    } catch (error) {
      setIncorrectDetails(true);
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] to-[#2a0d4a]"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-xl border border-white/20 transform transition-all duration-300 hover:shadow-indigo-500/25">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-indigo-100">
                Email / Username
              </label>
              <input
                type="text"
                name="identifier"
                value={input.identifier}
                onChange={handleChange}
                required
                className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter your email or username"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-indigo-100">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Enter your password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white/80 hover:text-white"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {incorrectDetails && (
              <div className="bg-red-500/20 p-2 rounded-lg text-pink-200 text-sm text-center">
                Incorrect login details. Please try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-lg transition-all duration-300 font-medium border border-white/30 hover:border-white/50 hover:shadow-lg mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-indigo-100 text-sm">
              Don't have an account?
              <a
                href="/user/register"
                className="text-white font-medium hover:underline ml-1"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
