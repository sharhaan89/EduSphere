import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ThreadPage from "./pages/ThreadPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import SubforumPage from "./pages/SubforumPage.jsx";
import ThreadCreatePage from "./pages/ThreadCreatePage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<ForumPage />} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/user/login" element={<LoginPage />} />
                <Route path="/user/register" element={<RegisterPage />} />
                <Route path="/forum/:subforum/all" element={<SubforumPage />} />
                <Route path="/forum/thread/:id" element={<ThreadPage />} />
                <Route path="/forum/thread/:subforum/create" element={<ThreadCreatePage />} />
                <Route path="*" element={<ForumPage />} />
            </Routes>
        </Router>
    );
}
