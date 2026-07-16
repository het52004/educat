import { FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, FaStar, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "../../../styles/admin/Dashboard.css";

function Sidebar({ activeTab, isSidebarOpen, onSwitch, onToggle, onLogout }) {
    return (
        <>
            <div className="mobile-header">
                <div className="brand">EduCat Admin</div>
                <button onClick={onToggle}>
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="brand">
                    <div className="logo-symbol">
                        <img src="/assets/images/EduCat (4).png" alt="logo-symbol" />
                    </div>
                    <div className="logo-name">
                        <img src="/assets/images/EduCat (3).png" alt="logo-name" />
                    </div>
                </div>

                <nav className="nav-menu">
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => onSwitch("dashboard")}>
                        <FaHome /> Overview
                    </button>
                    <button className={activeTab === "students" ? "active" : ""} onClick={() => onSwitch("students")}>
                        <FaUserGraduate /> Students
                    </button>
                    <button className={activeTab === "instructors" ? "active" : ""} onClick={() => onSwitch("instructors")}>
                        <FaChalkboardTeacher /> Instructors
                    </button>
                    <button className={activeTab === "courses" ? "active" : ""} onClick={() => onSwitch("courses")}>
                        <FaBook /> Courses
                    </button>
                    <button className={activeTab === "feedback" ? "active" : ""} onClick={() => onSwitch("feedback")}>
                        <FaStar /> Feedback
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
