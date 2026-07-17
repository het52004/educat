import { useEffect, useState, useMemo } from "react";
import { FaTrash, FaUserGraduate } from "react-icons/fa";
import { useAdminStore } from "../../../store/admin/useAdminStore";

function ManageStudents() {
    const { students, loading, fetchStudents, deleteStudent } = useAdminStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return students;
        return students.filter(
            (s) => s.fullName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
        );
    }, [students, search]);

    const handleDelete = async (student) => {
        if (!window.confirm(`Delete student "${student.fullName}"? This will also remove their reviews.`)) return;
        const res = await deleteStudent(student._id);
        if (!res.success) alert(res.message || "Failed to delete student");
    };

    return (
        <div>
            <div className="section-header">
                <h2>Students ({students.length})</h2>
                <input
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">Loading students...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <FaUserGraduate />
                        <p>No students found.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Enrolled Courses</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s._id}>
                                    <td data-label="Name" className="fw-bold">{s.fullName}</td>
                                    <td data-label="Email">{s.email}</td>
                                    <td data-label="Contact">{s.contactNumber}</td>
                                    <td data-label="Enrolled Courses">{s.enrolledCount ?? s.enrolledCourses?.length ?? 0}</td>
                                    <td data-label="Joined">{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td data-label="Actions" className="cell-actions">
                                        <div className="action-buttons">
                                            <button className="btn-icon delete" title="Delete student" onClick={() => handleDelete(s)}>
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

export default ManageStudents;
