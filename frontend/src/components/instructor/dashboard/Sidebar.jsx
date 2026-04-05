import { FaHome, FaBook, FaComments, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChartBar } from "react-icons/fa";
import "../../../styles/instructor/Dashboard.css";

function Sidebar({ activeTab, isSidebarOpen, onSwitch, onToggle, onLogout }) {
    return (
        <>
            <div className="mobile-header">
                <div className="brand">EduCat Instructor</div>
                <button onClick={onToggle}>
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="brand-desktop">
                    <h2>EduCat<span>.</span></h2>
                </div>

                <nav className="nav-menu">
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => onSwitch("dashboard")}>
                        <FaHome /> Dashboard
                    </button>
                    <button className={activeTab === "analytics" ? "active" : ""} onClick={() => onSwitch("analytics")}>
                        <FaChartBar /> Analytics
                    </button>
                    <button className={activeTab === "create-course" ? "active" : ""} onClick={() => onSwitch("create-course")}>
                        <FaBook /> Create Course
                    </button>
                    <button className={activeTab === "messages" ? "active" : ""} onClick={() => onSwitch("messages")}>
                        <FaComments /> Messages
                    </button>
                    <button className={activeTab === "settings" ? "active" : ""} onClick={() => onSwitch("settings")}>
                        <FaCog /> Settings
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
