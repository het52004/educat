import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/student/CourseDetails.css";
import "../../../styles/student/EnrollModal.css";
import { useCourseStore } from "../../../store/student/useCourseStore";
import { useAuthStore } from "../../../store/student/useAuthStore";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCourse, loading, fetchCourseById } = useCourseStore();
    const user = useAuthStore((state) => state.user);
    const enrollCourse = useAuthStore((state) => state.enrollCourse);

    const [showModal, setShowModal] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollMsg, setEnrollMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchCourseById(id);
    }, [id]);

    const isEnrolled = user?.enrolledCourses?.map(String).includes(String(id));

    const handleEnroll = async () => {
        setEnrolling(true);
        setEnrollMsg({ text: "", type: "" });
        const res = await enrollCourse(id);
        setEnrolling(false);
        if (res.success) {
            setEnrollMsg({ text: "You're enrolled! Redirecting to course...", type: "success" });
            setTimeout(() => {
                setShowModal(false);
                navigate(`/learn/${id}`);
            }, 1500);
        } else {
            setEnrollMsg({ text: res.message, type: "error" });
        }
    };

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
                <button onClick={() => navigate(-1)} className="back-btn" style={{ marginTop: "20px" }}>← Go Back</button>
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

                            {isEnrolled ? (
                                <>
                                    <div className="enrolled-badge">✓ You're enrolled</div>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate(`/learn/${id}`)}
                                    >
                                        Go to Course
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Buy Now
                                    </button>
                                    <p className="guarantee">30-Day Money-Back Guarantee</p>
                                </>
                            )}

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

            {showModal && (
                <div className="modal-overlay" onClick={() => !enrolling && setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => !enrolling && setShowModal(false)}>✕</button>

                        <div className="modal-header">
                            <img
                                src={course.thumbnail || `https://placehold.co/600x400/4f46e5/white?text=${encodeURIComponent(course.title)}`}
                                alt={course.title}
                                className="modal-course-img"
                            />
                            <div className="modal-course-info">
                                <h3>{course.title}</h3>
                                <p>by {course.addedBy?.name || "Instructor"}</p>
                            </div>
                        </div>

                        <div className="modal-divider" />

                        <div className="modal-price-row">
                            <span className="modal-label">Total</span>
                            <span className="modal-price">${course.price}</span>
                        </div>

                        <div className="modal-includes">
                            {course.duration && <span>📺 {course.duration} video</span>}
                            {course.lectures > 0 && <span>📄 {course.lectures} lectures</span>}
                            <span>🏆 Certificate</span>
                            <span>♾️ Full lifetime access</span>
                        </div>

                        {enrollMsg.text && (
                            <div className={`modal-msg ${enrollMsg.type}`}>{enrollMsg.text}</div>
                        )}

                        <button
                            className="modal-enroll-btn"
                            onClick={handleEnroll}
                            disabled={enrolling}
                        >
                            {enrolling ? "Processing..." : "Confirm Enrollment"}
                        </button>

                        <p className="modal-guarantee">🔒 30-Day Money-Back Guarantee</p>
                    </div>
                </div>
            )}
        </div>
    );
}
