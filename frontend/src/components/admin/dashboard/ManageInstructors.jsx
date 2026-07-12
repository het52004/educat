import { useEffect, useState, useMemo } from "react";
import { FaTrash, FaChalkboardTeacher } from "react-icons/fa";
import { useAdminStore } from "../../../store/admin/useAdminStore";

function ManageInstructors() {
    const { instructors, loading, fetchInstructors, deleteInstructor } = useAdminStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchInstructors();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return instructors;
        return instructors.filter(
            (i) => i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q)
        );
    }, [instructors, search]);

    const handleDelete = async (instructor) => {
        if (
            !window.confirm(
                `Delete instructor "${instructor.name}"? This will also delete all of their courses, lectures and reviews.`
            )
        )
            return;
        const res = await deleteInstructor(instructor._id);
        if (!res.success) alert(res.message || "Failed to delete instructor");
    };

    return (
        <div>
            <div className="section-header">
                <h2>Instructors ({instructors.length})</h2>
                <input
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading instructors...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <FaChalkboardTeacher />
                        <p>No instructors found.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Expertise</th>
                                <th>Courses</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((i) => (
                                <tr key={i._id}>
                                    <td className="fw-bold">{i.name}</td>
                                    <td>{i.email}</td>
                                    <td>{i.expertise?.length ? i.expertise.join(", ") : "—"}</td>
                                    <td>{i.courses?.length || 0}</td>
                                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon delete" title="Delete instructor" onClick={() => handleDelete(i)}>
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

export default ManageInstructors;
