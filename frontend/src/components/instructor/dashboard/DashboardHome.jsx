import { FaPlus, FaEdit, FaTrash, FaPlayCircle, FaClipboardList } from "react-icons/fa";
import "../../../styles/instructor/Dashboard.css";

function DashboardHome({ courses, instructor, onNewCourse, onEdit, onDelete, onManageLectures, onManageQuiz }) {
    return (
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
                <button className="btn-primary" onClick={onNewCourse}>
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
                                    <td>{course.lectures || 0}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon" style={{ color: "#4f46e5" }} onClick={() => onManageLectures(course)} title="Manage Lectures">
                                                <FaPlayCircle />
                                            </button>
                                            <button className="btn-icon" style={{ color: "#7c3aed" }} onClick={() => onManageQuiz(course)} title="Manage Quiz">
                                                <FaClipboardList />
                                            </button>
                                            <button className="btn-icon edit" onClick={() => onEdit(course)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon delete" onClick={() => onDelete(course._id)}>
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
}

export default DashboardHome;
