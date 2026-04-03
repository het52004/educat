import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import { useCourseStore } from "../../../store/student/useCourseStore";
import useDashboardStore from "../../../store/student/useDashboardStore";

function BrowseNewCourses() {
    const navigate = useNavigate();
    const { courses, loading, fetchPublishedCourses } = useCourseStore();
    const { searchQuery } = useDashboardStore();

    useEffect(() => {
        fetchPublishedCourses();
    }, []);

    const filtered = searchQuery.trim()
        ? courses.filter(
            (c) =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.addedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : courses;

    if (loading) {
        return <p style={{ color: "var(--text-gray)", marginTop: "20px" }}>Loading courses...</p>;
    }

    return (
        <>
            <h2 className="section-title">
                {searchQuery.trim() ? `Results for "${searchQuery}"` : "Browse New Courses"}
            </h2>

            {filtered.length === 0 ? (
                <p style={{ color: "var(--text-gray)", marginTop: "10px" }}>
                    {searchQuery.trim() ? "No courses match your search." : "No courses available yet. Check back soon!"}
                </p>
            ) : (
                <div className="card-grid">
                    {filtered.map((course) => (
                        <div key={course._id} className="course-card">
                            <div
                                className="card-image"
                                style={{
                                    backgroundImage: course.thumbnail
                                        ? `url(${course.thumbnail})`
                                        : `url(https://placehold.co/600x400/4f46e5/white?text=${encodeURIComponent(course.title)})`,
                                }}
                            >
                                <span className="rating-badge">{course.category}</span>
                            </div>

                            <div className="card-details">
                                <h3>{course.title}</h3>
                                <p className="course-instructor">
                                    by {course.addedBy?.name || "Instructor"}
                                </p>
                                <div className="price-row">
                                    <span className="price">${course.price}</span>
                                    <button
                                        className="view-details-btn"
                                        onClick={() => navigate(`/course/${course._id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default BrowseNewCourses;
