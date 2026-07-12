import { useState } from "react";
import "../../../styles/admin/Dashboard.css";
import { useAdminAuthStore } from "../../../store/admin/useAdminAuthStore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/dashboard/Sidebar";
import DashboardHome from "../../../components/admin/dashboard/DashboardHome";
import ManageStudents from "../../../components/admin/dashboard/ManageStudents";
import ManageInstructors from "../../../components/admin/dashboard/ManageInstructors";
import ManageCourses from "../../../components/admin/dashboard/ManageCourses";
import ManageFeedback from "../../../components/admin/dashboard/ManageFeedback";

function AdminDashboard() {
    const navigate = useNavigate();
    const { admin, logout } = useAdminAuthStore();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const switchTab = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/adminlogin");
    };

    const initials = admin?.name
        ? admin.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "AD";

    const titles = {
        dashboard: { heading: "Admin Overview", sub: "Platform-wide stats and activity at a glance." },
        students: { heading: "Manage Students", sub: "View and remove registered students." },
        instructors: { heading: "Manage Instructors", sub: "View and remove registered instructors." },
        courses: { heading: "Manage Courses", sub: "Publish, unpublish or remove courses." },
        feedback: { heading: "Manage Feedback", sub: "Moderate reviews left by students." },
    };

    return (
        <div className="admin-dashboard-container">
            <Sidebar
                activeTab={activeTab}
                isSidebarOpen={isSidebarOpen}
                onSwitch={switchTab}
                onToggle={() => setIsSidebarOpen((prev) => !prev)}
                onLogout={handleLogout}
            />

            <main className="main-content">
                <header className="top-bar">
                    <div className="welcome-text">
                        <h1>{titles[activeTab].heading}</h1>
                        <p>{titles[activeTab].sub}</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar">{initials}</div>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === "dashboard" && <DashboardHome />}
                    {activeTab === "students" && <ManageStudents />}
                    {activeTab === "instructors" && <ManageInstructors />}
                    {activeTab === "courses" && <ManageCourses />}
                    {activeTab === "feedback" && <ManageFeedback />}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
