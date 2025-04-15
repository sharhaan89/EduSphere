import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";

import ThreadPage from "./pages/ThreadPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import SubforumPage from "./pages/SubforumPage.jsx";
import ThreadCreatePage from "./pages/ThreadCreatePage.jsx";
import ThreadEditPage from "./pages/ThreadEditPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SearchEnginePage from "./pages/SearchEnginePage.jsx";
import ReportCreatePage from "./pages/ReportCreatePage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ManageUsersPage from "./pages/ManageUsersPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ReportsListPage from "./pages/ReportsListPage.jsx";
import RoomPage from "./pages/RoomPage.jsx";
import RoomsListPage from "./pages/RoomsListPage.jsx";
import AcademicsPage from "./pages/AcademicsPage.jsx";
import ClubsPage from "./pages/ClubsPage.jsx";
import InternshipsPage from "./pages/InternshipsPage.jsx";

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <NavBar />
            <div style={{ marginTop: "60px" }}> 
                <Routes>
                    <Route path="/forum/academics/all" element={<AcademicsPage />} />
                    <Route path="/forum/clubs/all" element={<ClubsPage />} />
                    <Route path="/forum/internships/all" element={<InternshipsPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/user/login" element={<LoginPage />} />
                    <Route path="/user/register" element={<RegisterPage />} />
                    <Route path="/forum/:subforum/all" element={<SubforumPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/team" element={<TeamPage />} />

                    <Route path="/chats" element={<RoomsListPage />} />
                    <Route path="/chat/:currentRoom" element={<RoomPage />} />
                    <Route path="/acp" element={<AdminPage />} />
                    <Route path="/acp/users" element={<ManageUsersPage />} />
                    <Route path="/acp/reports" element={<ReportsListPage />} />
                    <Route path="/acp/report/:id" element={<ReportPage />} />
                    <Route path="/forum/search" element={<SearchEnginePage />} />
                    <Route path="/report/:reportee_id" element={<ReportCreatePage />} />
                    <Route path="/forum/thread/:id" element={<ThreadPage />} />
                    <Route path="/forum/thread/edit/:id" element={<ThreadEditPage />} />
                    <Route path="/forum/thread/:subforum/create" element={<ThreadCreatePage />} />
                    <Route path="/user/:userid" element={<UserProfilePage />} />
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}
