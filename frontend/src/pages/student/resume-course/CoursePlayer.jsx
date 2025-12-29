import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/student/CoursePlayer.css";
import { courseData } from "../../../seed/student/courseData";
import { CourseIcons } from "../../../components/student/dashboard/Icons";

export default function CoursePlayer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const course = courseData.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div style={{ color: "white", padding: "50px", textAlign: "center" }}>
        Course Not Found
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("Overview");
  const [openSections, setOpenSections] = useState({ 1: true });
  const [currentLesson, setCurrentLesson] = useState(
    course.sections[0].lessons[0]
  );

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="layout-container">
      <main className="main-stage">
        <header className="player-header">
          <button
            className="back-link"
            onClick={() => navigate("/studentdashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="header-meta">
            <h1>{course.title}</h1>
            {/* <span className="badge-pro">PRO COURSE</span> */}
          </div>
        </header>

        <div className="video-container">
          <div className="video-wrapper">
            <iframe
              className="video-element"
              src={`https://www.youtube.com/embed/${currentLesson.videoUrl}`}
              title={currentLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs-list">
            {["Overview", "Resources", "Q&A", "Reviews"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="overview-content">
              <h2>{currentLesson.title}</h2>
              <p>In this lesson, we cover {currentLesson.title}.</p>
            </div>
          )}
        </div>
      </main>

      <aside className="playlist-sidebar">
        <div className="sidebar-header">
          <h3>Course Content</h3>
          <div className="progress-radial">{course.progress}%</div>
        </div>

        <div className="modules-list">
          {course.sections.map((section) => (
            <div key={section.id} className="module-group">
              <button
                className={`module-btn ${
                  openSections[section.id] ? "open" : ""
                }`}
                onClick={() => toggleSection(section.id)}
              >
                {section.title}
                <CourseIcons.ChevronDown />
              </button>

              {openSections[section.id] &&
                section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`lesson-row ${
                      currentLesson.id === lesson.id ? "active" : ""
                    }`}
                    onClick={() => setCurrentLesson(lesson)}
                  >
                    <span>{lesson.title}</span>
                    <span>{lesson.time}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
