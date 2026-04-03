import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../../../styles/student/CourseDetails.css";
import { useCourseStore } from "../../../store/student/useCourseStore";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCourse, loading, fetchCourseById } = useCourseStore();

    useEffect(() => {
        fetchCourseById(id);
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
                <p>Loading course details...</p>
            </div>
        );
    }

    if (!selectedCourse) {
        return (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: "Poppins, sans-serif" }}>
                <h2>Course not found!</h2>
                <button onClick={() => navigate(-1)} className="back-btn" style={{ marginTop: "20px" }}>
                    ← Go Back
                </button>
            </div>
        );
    }

    const course = selectedCourse;
    const avgRating = course.ratings?.length
        ? (course.ratings.reduce((a, b) => a + b, 0) / course.ratings.length).toFixed(1)
        : "New";

    return (
        <div className="course-details-container">
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

            <div className="course-header">
                <div className="header-content">
                    <h1 style={{ color: "white" }}>{course.title}</h1>
                    <p className="subtitle">{course.description}</p>
                    <div className="meta-info">
                        <span className="rating">★ {avgRating}</span>
                        <span>Created by {course.addedBy?.name || "Instructor"}</span>
                        <span>{course.category}</span>
                    </div>
                </div>
            </div>

            <div className="details-layout">
                <div className="left-column">
                    <div className="learning-section">
                        <h3>What you'll learn</h3>
                        <ul className="learn-list">
                            <li>✓ Master the fundamentals of {course.title}</li>
                            <li>✓ Build real-world projects</li>
                            <li>✓ Understand core concepts deeply</li>
                            <li>✓ Get hands-on practice with exercises</li>
                        </ul>
                    </div>

                    <div className="description-section">
                        <h3>Description</h3>
                        <p>{course.description}</p>
                    </div>
                </div>

                <div className="right-column">
                    <div className="buy-card">
                        <img
                            src={course.thumbnail || `https://placehold.co/600x400/4f46e5/white?text=${encodeURIComponent(course.title)}`}
                            alt={course.title}
                            className="buy-card-img"
                        />
                        <div className="buy-card-body">
                            <h2 className="price-tag">${course.price}</h2>
                            <button className="btn-primary">Add to Cart</button>
                            <button className="btn-outline">Buy Now</button>
                            <p className="guarantee">30-Day Money-Back Guarantee</p>

                            <div className="course-includes">
                                <p>This course includes:</p>
                                <ul>
                                    {course.duration && <li>📺 {course.duration} on-demand video</li>}
                                    {course.lectures > 0 && <li>📄 {course.lectures} lectures</li>}
                                    <li>📱 Access on mobile and desktop</li>
                                    <li>🏆 Certificate of completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
