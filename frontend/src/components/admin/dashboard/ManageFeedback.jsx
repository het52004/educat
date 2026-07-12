import { useEffect, useState, useMemo } from "react";
import { FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import { useAdminStore } from "../../../store/admin/useAdminStore";

function Stars({ rating }) {
    return (
        <span className="rating-stars">
            {Array.from({ length: 5 }).map((_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
        </span>
    );
}

function ManageFeedback() {
    const { feedbacks, loading, fetchFeedback, deleteFeedback } = useAdminStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchFeedback();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return feedbacks;
        return feedbacks.filter(
            (f) =>
                f.course?.title?.toLowerCase().includes(q) ||
                f.addedBy?.fullName?.toLowerCase().includes(q) ||
                f.description?.toLowerCase().includes(q)
        );
    }, [feedbacks, search]);

    const handleDelete = async (feedback) => {
        if (!window.confirm("Delete this review? This action cannot be undone.")) return;
        const res = await deleteFeedback(feedback._id);
        if (!res.success) alert(res.message || "Failed to delete review");
    };

    return (
        <div>
            <div className="section-header">
                <h2>Feedback & Reviews ({feedbacks.length})</h2>
                <input
                    className="search-input"
                    placeholder="Search by course, student or text..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading feedback...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <FaStar />
                        <p>No feedback found.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Student</th>
                                <th>Rating</th>
                                <th>Review</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((f) => (
                                <tr key={f._id}>
                                    <td className="fw-bold">{f.course?.title || "Deleted course"}</td>
                                    <td>{f.addedBy?.fullName || "Deleted user"}</td>
                                    <td><Stars rating={f.rating} /></td>
                                    <td className="feedback-desc" title={f.description}>{f.description}</td>
                                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon delete" title="Delete review" onClick={() => handleDelete(f)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ManageFeedback;
