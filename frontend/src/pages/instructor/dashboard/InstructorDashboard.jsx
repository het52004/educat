import { useState, useEffect } from "react";
import "../../../styles/instructor/Dashboard.css";
import {
    FaHome, FaBook, FaPlus, FaCog, FaSignOutAlt,
    FaBars, FaTimes, FaEdit, FaTrash,
} from "react-icons/fa";
import { useInstructorAuthStore } from "../../../store/instructor/useInstructorAuthStore";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Web Development", "Data Science", "Design", "AI / ML", "Photography", "Finance", "Other"];

const emptyForm = { title: "", description: "", price: "", category: "Web Development", thumbnail: "", duration: "", lectures: "" };

function InstructorDashboard() {
    const navigate = useNavigate();
    const { instructor, courses, checkAuth, logout, fetchInstructorCourses, createCourse, deleteCourse, updateCourse } = useInstructorAuthStore();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        async function init() {
            const ok = await checkAuth();
            if (!ok) {
                navigate("/instructorlogin");
                return;
            }
            fetchInstructorCourses();
        }
        init();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        if (editingCourse) {
            const res = await updateCourse(editingCourse._id, formData);
            if (!res.success) {
                setFormError(res.message);
            } else {
                setFormData(emptyForm);
                setEditingCourse(null);
                setActiveTab("dashboard");
            }
        } else {
            const res = await createCourse(formData);
            if (!res.success) {
                setFormError(res.message);
            } else {
                setFormData(emptyForm);
                setActiveTab("dashboard");
            }
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            category: course.category,
            thumbnail: course.thumbnail || "",
            duration: course.duration || "",
            lectures: course.lectures || "",
        });
        setActiveTab("create-course");
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(courseId);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/instructorlogin");
    };

    const switchTab = (tab) => {
        if (tab !== "create-course") {
            setEditingCourse(null);
            setFormData(emptyForm);
            setFormError("");
        }
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const initials = instructor?.name
        ? instructor.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "IN";

    const renderDashboard = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: "#e0e7ff", color: "#4338ca" }}>📚</div>
                    <div className="stat-info">
                        <h3>{courses.length}</h3>
                        <p>Published Courses</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>⭐</div>
                    <div className="stat-info">
                        <h3>{instructor?.expertise?.join(", ") || "—"}</h3>
                        <p>Expertise</p>
                    </div>
                </div>
            </div>

            <div className="section-header">
                <h2>My Courses</h2>
                <button className="btn-primary" onClick={() => switchTab("create-course")}>
                    <FaPlus /> New Course
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Lectures</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "var(--text-gray)", padding: "30px" }}>
                                    No courses published yet. Click "New Course" to get started.
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course._id}>
                                    <td className="fw-bold">{course.title}</td>
                                    <td>{course.category}</td>
                                    <td>${course.price}</td>
                                    <td>{course.lectures || "—"}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon edit" onClick={() => handleEdit(course)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDelete(course._id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderCreateCourse = () => (
        <div className="form-wrapper">
            <div className="section-header">
                <h2>{editingCourse ? "Edit Course" : "Publish New Course"}</h2>
                <button className="btn-outline" onClick={() => switchTab("dashboard")}>Cancel</button>
            </div>

            <form className="course-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Course Title</label>
                    <input type="text" name="title" placeholder="e.g. Master Python in 30 Days" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price ($)</label>
                        <input type="number" name="price" placeholder="49.99" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Duration (e.g. 4.5 hours)</label>
                        <input type="text" name="duration" placeholder="4.5 hours" value={formData.duration} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Number of Lectures</label>
                        <input type="number" name="lectures" placeholder="12" value={formData.lectures} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input type="text" name="thumbnail" placeholder="https://..." value={formData.thumbnail} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="5" name="description" placeholder="What will students learn?" value={formData.description} onChange={handleChange} required></textarea>
                </div>

                {formError && <p style={{ color: "red", marginBottom: "10px" }}>{formError}</p>}

                <button type="submit" className="btn-primary">
                    {editingCourse ? "Save Changes" : "Publish Course"}
                </button>
            </form>
        </div>
    );

    const renderSettings = () => (
        <div className="form-wrapper">
            <h2>Instructor Profile</h2>
            <form className="course-form">
                <div className="form-group">
                    <label>Display Name</label>
                    <input type="text" defaultValue={instructor?.name || ""} disabled />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea rows="3" defaultValue={instructor?.bio || ""} disabled></textarea>
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={instructor?.email || ""} disabled />
                </div>
                <div className="form-group">
                    <label>Expertise</label>
                    <input type="text" defaultValue={instructor?.expertise?.join(", ") || ""} disabled />
                </div>
            </form>
        </div>
    );

    return (
        <div className="instructor-dashboard-container">
            <div className="mobile-header">
                <div className="brand">EduCat Instructor</div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="brand-desktop">
                    <h2>EduCat<span>.</span></h2>
                </div>

                <nav className="nav-menu">
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => switchTab("dashboard")}>
                        <FaHome /> Dashboard
                    </button>
                    <button className={activeTab === "create-course" ? "active" : ""} onClick={() => switchTab("create-course")}>
                        <FaBook /> Create Course
                    </button>
                    <button className={activeTab === "settings" ? "active" : ""} onClick={() => switchTab("settings")}>
                        <FaCog /> Settings
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

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
                    {activeTab === "dashboard" && renderDashboard()}
                    {activeTab === "create-course" && renderCreateCourse()}
                    {activeTab === "settings" && renderSettings()}
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboard;
