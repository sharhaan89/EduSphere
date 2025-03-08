import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThreadPage from "./pages/ThreadPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import SubforumPage from "./pages/SubForumPage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<h1>Home Page</h1>} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/user/login" element={<LoginPage />} />
                <Route path="/user/register" element={<RegisterPage />} />
                <Route path="/forum/:subforum/all" element={<SubforumPage />} />
                <Route path="/forum/thread/:id" element={<ThreadPage />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
    );
}
