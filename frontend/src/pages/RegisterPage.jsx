import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        username: "",
        roll_number: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                navigate("/user/login");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] to-[#2a0d4a]"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-xl border border-white/20 transform transition-all duration-300 hover:shadow-indigo-500/25">
                    <h2 className="text-2xl font-bold mb-4 text-center text-white">Register</h2>
                    {error && <p className="text-pink-200 text-sm text-center mb-4 bg-red-500/20 p-2 rounded-lg">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm text-indigo-100">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-indigo-100">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-indigo-100">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-indigo-100">Roll Number</label>
                            <input
                                type="text"
                                name="roll_number"
                                placeholder="Your roll number"
                                value={formData.roll_number}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-indigo-100">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2.5 bg-white/10 border border-indigo-300/30 rounded-lg text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50 pr-10"
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/80 hover:text-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-lg transition-all duration-300 font-medium border border-white/30 hover:border-white/50 hover:shadow-lg mt-6"
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-center text-indigo-100 text-sm mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-white font-medium cursor-pointer hover:underline"
                            onClick={() => navigate("/user/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
