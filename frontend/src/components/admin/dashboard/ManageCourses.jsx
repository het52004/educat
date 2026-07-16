import { useEffect, useState, useMemo } from "react";
import { FaTrash, FaBook, FaCheckCircle, FaBan } from "react-icons/fa";
import { useAdminStore } from "../../../store/admin/useAdminStore";

function ManageCourses() {
    const { courses, loading, fetchCourses, deleteCourse, toggleCoursePublish } = useAdminStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return courses;
        return courses.filter(
            (c) =>
                c.title?.toLowerCase().includes(q) ||
                c.category?.toLowerCase().includes(q) ||
                c.addedBy?.name?.toLowerCase().includes(q)
        );
    }, [courses, search]);

    const handleDelete = async (course) => {
        if (!window.confirm(`Delete course "${course.title}"? This will also delete its lectures and reviews.`)) return;
        const res = await deleteCourse(course._id);
        if (!res.success) alert(res.message || "Failed to delete course");
    };

    const handleTogglePublish = async (course) => {
        const res = await toggleCoursePublish(course._id);
        if (!res.success) alert(res.message || "Failed to update course");
    };

    return (
        <div>
            <div className="section-header">
                <h2>Courses ({courses.length})</h2>
                <input
                    className="search-input"
                    placeholder="Search by title, category or instructor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading courses...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <FaBook />
                        <p>No courses found.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Instructor</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => {
                                const avgRating = c.ratings?.length
                                    ? (c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length).toFixed(1)
                                    : "N/A";
                                return (
                                    <tr key={c._id}>
                                        <td data-label="Title" className="fw-bold">{c.title}</td>
                                        <td data-label="Instructor">{c.addedBy?.name || "Unknown"}</td>
                                        <td data-label="Category">{c.category}</td>
                                        <td data-label="Price">₹{c.price}</td>
                                        <td data-label="Rating">{avgRating}{avgRating !== "N/A" ? ` (${c.ratings.length})` : ""}</td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${c.isPublished ? "active" : "draft"}`}>
                                                {c.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td data-label="Actions" className="cell-actions">
                                            <div className="action-buttons">
                                                <button
                                                    className={`btn-icon ${c.isPublished ? "unpublish" : "publish"}`}
                                                    title={c.isPublished ? "Unpublish course" : "Publish course"}
                                                    onClick={() => handleTogglePublish(c)}
                                                >
                                                    {c.isPublished ? <FaBan /> : <FaCheckCircle />}
                                                </button>
                                                <button className="btn-icon delete" title="Delete course" onClick={() => handleDelete(c)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ManageCourses;
