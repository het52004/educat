import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import { useCourseStore } from "../../../store/student/useCourseStore";

function BrowseNewCourses() {
    const navigate = useNavigate();
    const { courses, loading, fetchPublishedCourses } = useCourseStore();

    useEffect(() => {
        fetchPublishedCourses();
    }, []);

    if (loading) {
        return <p style={{ color: "var(--text-gray)", marginTop: "20px" }}>Loading courses...</p>;
    }

    return (
        <>
            <h2 className="section-title">Browse New Courses</h2>

            {courses.length === 0 ? (
                <p style={{ color: "var(--text-gray)", marginTop: "10px" }}>
                    No courses available yet. Check back soon!
                </p>
            ) : (
                <div className="card-grid">
                    {courses.map((course) => (
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
