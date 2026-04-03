import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/student/CoursePlayer.css";
import { CourseIcons } from "../../../components/student/dashboard/Icons";
import useStudentLectureStore from "../../../store/student/useStudentLectureStore";
import { useCourseStore } from "../../../store/student/useCourseStore";
import { useAuthStore } from "../../../store/student/useAuthStore";

const STREAM_BASE = "http://localhost:5000/lectures/stream";

export default function CoursePlayer() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { lectures, loading, fetchLectures } = useStudentLectureStore();
    const { selectedCourse, fetchCourseById } = useCourseStore();
    const user = useAuthStore((state) => state.user);

    const [currentLecture, setCurrentLecture] = useState(null);
    const [openSections, setOpenSections] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const videoRef = useRef(null);

    const isEnrolled = user?.enrolledCourses?.map(String).includes(String(id));

    useEffect(() => {
        if (!user) {
            navigate("/studentlogin");
            return;
        }
        if (user && !isEnrolled) {
            navigate(`/course/${id}`);
            return;
        }
        fetchCourseById(id);
        fetchLectures(id);
    }, [id, user]);

    useEffect(() => {
        if (lectures.length > 0 && !currentLecture) {
            setCurrentLecture(lectures[0]);
        }
    }, [lectures]);

    if (loading) {
        return (
            <div className="layout-container" style={{ alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--cp-text-secondary)" }}>Loading course...</p>
            </div>
        );
    }

    if (!loading && lectures.length === 0) {
        return (
            <div className="layout-container" style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
                <p style={{ color: "var(--cp-text-secondary)", fontSize: "16px" }}>
                    No lectures available yet. Check back soon!
                </p>
                <button className="back-link" onClick={() => navigate("/studentdashboard")} style={{ fontSize: "14px" }}>
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="layout-container">
            <main className="main-stage">
                <header className="player-header">
                    <button className="back-link" onClick={() => navigate("/studentdashboard")}>
                        ← Back to Dashboard
                    </button>
                    <div className="header-meta">
                        <h1>{selectedCourse?.title || "Course"}</h1>
                    </div>
                </header>

                <div className="video-container">
                    <div className="video-wrapper">
                        {currentLecture ? (
                            <video
                                ref={videoRef}
                                key={currentLecture._id}
                                className="video-element"
                                controls
                                autoPlay
                                src={`${STREAM_BASE}/${currentLecture._id}`}
                            />
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--cp-text-secondary)" }}>
                                Select a lecture to start watching
                            </div>
                        )}
                    </div>
                </div>

                <div className="tabs-container">
                    <div className="tabs-list">
                        {["Overview"].map((tab) => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === "Overview" && currentLecture && (
                        <div className="overview-content">
                            <div className="content-left">
                                <h2>{currentLecture.title}</h2>
                                {currentLecture.description && (
                                    <p>{currentLecture.description}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <aside className="playlist-sidebar">
                <div className="sidebar-header">
                    <h3>Course Content</h3>
                    <span className="progress-radial">{lectures.length} lecture{lectures.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="modules-list">
                    <div className="module-group">
                        <button
                            className={`module-btn ${openSections ? "open" : ""}`}
                            onClick={() => setOpenSections((p) => !p)}
                        >
                            All Lectures
                            <CourseIcons.ChevronDown />
                        </button>

                        {openSections && (
                            <div className="lessons-container">
                                {lectures.map((lec, index) => (
                                    <div
                                        key={lec._id}
                                        className={`lesson-row ${currentLecture?._id === lec._id ? "active" : ""}`}
                                        onClick={() => setCurrentLecture(lec)}
                                    >
                                        <div className="status-icon">
                                            {currentLecture?._id === lec._id ? (
                                                <div className="check-circle">
                                                    <CourseIcons.Play />
                                                </div>
                                            ) : (
                                                <div className="circle-outline" />
                                            )}
                                        </div>
                                        <div className="lesson-details">
                                            <span className="lesson-title">
                                                {index + 1}. {lec.title}
                                            </span>
                                            {lec.description && (
                                                <span className="lesson-time">{lec.description.slice(0, 50)}{lec.description.length > 50 ? "..." : ""}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}
