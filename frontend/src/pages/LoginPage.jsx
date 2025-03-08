import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
            const response = await fetch("http://localhost:3000/user/login", {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email / Username</label>
                        <input
                            type="text"
                            name="identifier"
                            value={input.identifier}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={input.password}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span
                                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {incorrectDetails ? <p className="text-center text-sm mt-4">
                    Incorrect login details.
                </p> : ""}

                <p className="text-center text-sm mt-4">
                    Don't have an account? 
                    <Link to="/user/register" className="text-blue-500 hover:underline"> Register here</Link>
                </p>
            </div>
        </div>
    );
}
