import { useState, useEffect } from "react";
import "../../../styles/instructor/Dashboard.css";
import { useInstructorAuthStore } from "../../../store/instructor/useInstructorAuthStore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/instructor/dashboard/Sidebar";
import DashboardHome from "../../../components/instructor/dashboard/DashboardHome";
import CourseForm from "../../../components/instructor/dashboard/CourseForm";
import InstructorMessages from "../../../components/instructor/dashboard/InstructorMessages";
import Settings from "../../../components/instructor/dashboard/Settings";
import ManageLectures from "../../../components/instructor/dashboard/ManageLectures";

function InstructorDashboard() {
    const navigate = useNavigate();
    const { instructor, courses, logout, fetchInstructorCourses, createCourse, deleteCourse, updateCourse } = useInstructorAuthStore();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [managingCourse, setManagingCourse] = useState(null);

    useEffect(() => {
        fetchInstructorCourses();
    }, []);

    const switchTab = (tab) => {
        if (tab !== "create-course") setEditingCourse(null);
        if (tab !== "manage-lectures") setManagingCourse(null);
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/instructorlogin");
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setActiveTab("create-course");
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(courseId);
        }
    };

    const handleManageLectures = (course) => {
        setManagingCourse(course);
        setActiveTab("manage-lectures");
    };

    const handleCourseSubmit = async (formData) => {
        if (editingCourse) {
            const res = await updateCourse(editingCourse._id, formData);
            if (res.success) {
                setEditingCourse(null);
                setActiveTab("dashboard");
            }
            return res;
        } else {
            const res = await createCourse(formData);
            if (res.success) setActiveTab("dashboard");
            return res;
        }
    };

    const initials = instructor?.name
        ? instructor.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "IN";

    return (
        <div className="instructor-dashboard-container">
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
                        <h1>Welcome back, {instructor?.name?.split(" ")[0] || "Instructor"}! 👋</h1>
                        <p>Here is what's happening with your courses today.</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar">{initials}</div>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === "dashboard" && (
                        <DashboardHome
                            courses={courses}
                            instructor={instructor}
                            onNewCourse={() => switchTab("create-course")}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onManageLectures={handleManageLectures}
                        />
                    )}
                    {activeTab === "create-course" && (
                        <CourseForm
                            editingCourse={editingCourse}
                            onSubmit={handleCourseSubmit}
                            onCancel={() => switchTab("dashboard")}
                        />
                    )}
                    {activeTab === "manage-lectures" && managingCourse && (
                        <ManageLectures
                            course={managingCourse}
                            onBack={() => switchTab("dashboard")}
                        />
                    )}
                    {activeTab === "messages" && (
                        <InstructorMessages instructor={instructor} />
                    )}
                    {activeTab === "settings" && (
                        <Settings instructor={instructor} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboard;
