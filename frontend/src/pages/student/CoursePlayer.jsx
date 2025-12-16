import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/student/CoursePlayer.css";

const courseData = {
  title: "Advanced React Patterns & Performance Optimization",
  progress: 35,
  instructor: {
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    avatar: "https://i.pravatar.cc/150?img=35",
    students: "12,403 Students",
    rating: "4.9/5.0",
  },
  sections: [
    {
      id: 1,
      title: "Module 1: React Internals",
      lessons: [
        {
          id: 101,
          title: "Understanding the Virtual DOM",
          time: "14:20",
          type: "video",
          completed: true,
        },
        {
          id: 102,
          title: "Reconciliation Strategy",
          time: "08:15",
          type: "video",
          completed: true,
        },
        {
          id: 103,
          title: "Fiber Architecture Explained",
          time: "22:30",
          type: "video",
          completed: false,
          active: true,
        },
      ],
    },
    {
      id: 2,
      title: "Module 2: Advanced Hooks",
      lessons: [
        {
          id: 201,
          title: "useLayoutEffect vs useEffect",
          time: "06:45",
          type: "video",
          completed: false,
        },
        {
          id: 202,
          title: "Custom Hooks for Data Fetching",
          time: "19:10",
          type: "video",
          completed: false,
        },
        {
          id: 203,
          title: "Performance Quiz",
          time: "10:00",
          type: "quiz",
          completed: false,
        },
      ],
    },
  ],
};

const Icons = {
  Play: () => (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Check: () => (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  File: () => (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Volume: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
};

export default function CoursePlayer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [openSections, setOpenSections] = useState({ 1: true, 2: false });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="layout-container">
      {/* --- Main Content Area --- */}
      <main className="main-stage">
        {/* Header */}
        <header className="player-header">
          <button className="back-link" onClick={() => navigate("/studentdashboard")}>
            &larr; Back to Dashboard
          </button>
          <div className="header-meta">
            <h1>{courseData.title}</h1>
            <span className="badge-pro">PRO COURSE</span>
          </div>
        </header>

        {/* Video Player */}
        <div className="video-container">
          <div className="video-wrapper">
            {/* Fake Video UI */}
            <div className="video-overlay">
              <div className="play-btn-large">
                <Icons.Play />
              </div>
            </div>
            {/* Fake Controls Bar */}
            <div className="video-controls">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <div className="controls-row">
                <div className="left-controls">
                  <button>
                    <Icons.Play />
                  </button>
                  <button>
                    <Icons.Volume />
                  </button>
                  <span className="time-display">04:20 / 14:20</span>
                </div>
                <div className="right-controls">
                  <button>
                    <Icons.Settings />
                  </button>
                  <button>FS</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "Overview" && (
              <div className="overview-content">
                <div className="content-left">
                  <h2>About this lesson</h2>
                  <p>
                    In this deep dive, we explore the internal architecture of
                    React's Fiber reconciliation algorithm. You will learn why
                    React is fast, how the Virtual DOM diffing works, and how to
                    optimize your components to prevent unnecessary re-renders.
                  </p>

                  <h3>Key Topics</h3>
                  <ul className="learning-points">
                    <li>Understanding the Diffing Algorithm</li>
                    <li>The role of keys in lists</li>
                    <li>Fiber Nodes and the Work Loop</li>
                  </ul>
                </div>

                <div className="content-right">
                  <div className="instructor-card">
                    <div className="instructor-head">
                      <img
                        src={courseData.instructor.avatar}
                        alt="Instructor"
                      />
                      <div>
                        <h4>{courseData.instructor.name}</h4>
                        <span>{courseData.instructor.role}</span>
                      </div>
                    </div>
                    <div className="instructor-stats">
                      <div className="stat">
                        <strong>{courseData.instructor.students}</strong>{" "}
                        Students
                      </div>
                      <div className="stat">
                        <strong>{courseData.instructor.rating}</strong> Rating
                      </div>
                    </div>
                    <button className="btn-outline-small">View Profile</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="resources-list">
                <div className="resource-item">
                  <div className="icon-box">
                    <Icons.File />
                  </div>
                  <div className="res-info">
                    <h4>Source Code - Starting Point</h4>
                    <span>ZIP File • 2.4 MB</span>
                  </div>
                  <button className="btn-download">Download</button>
                </div>
                <div className="resource-item">
                  <div className="icon-box">
                    <Icons.File />
                  </div>
                  <div className="res-info">
                    <h4>Fiber Architecture PDF Slides</h4>
                    <span>PDF File • 5.1 MB</span>
                  </div>
                  <button className="btn-download">Download</button>
                </div>
              </div>
            )}

            {/* Add placeholders for other tabs if needed */}
            {(activeTab === "Q&A" || activeTab === "Reviews") && (
              <div className="empty-state">
                Content coming soon for this demo.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- Sidebar Playlist --- */}
      <aside className="playlist-sidebar">
        <div className="sidebar-header">
          <h3>Course Content</h3>
          <div className="progress-radial">35%</div>
        </div>

        <div className="modules-list">
          {courseData.sections.map((section) => (
            <div key={section.id} className="module-group">
              <button
                className={`module-btn ${
                  openSections[section.id] ? "open" : ""
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.title}</span>
                <span
                  className={`chevron ${
                    openSections[section.id] ? "rotate" : ""
                  }`}
                >
                  <Icons.ChevronDown />
                </span>
              </button>

              {openSections[section.id] && (
                <div className="lessons-container">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`lesson-row ${lesson.active ? "active" : ""} ${
                        lesson.completed ? "completed" : ""
                      }`}
                    >
                      <div className="status-icon">
                        {lesson.completed ? (
                          <div className="check-circle">
                            <Icons.Check />
                          </div>
                        ) : (
                          <div className="circle-outline" />
                        )}
                      </div>
                      <div className="lesson-details">
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-time">
                          {lesson.type === "video" ? "Video" : "Quiz"} •{" "}
                          {lesson.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
