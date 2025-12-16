import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/student/CoursePlayer.css";
import { courseData } from "../../seed/student/courseData";

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
  Mute: () => (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
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

const formatTime = (time) => {
  if (!time) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

export default function CoursePlayer() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Overview");
  const [openSections, setOpenSections] = useState({ 1: true, 2: false });
  const [currentLesson, setCurrentLesson] = useState(
    courseData.sections[0].lessons[0]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonChange = (lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (isPlaying) videoRef.current.play();
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const clickPercentage = clickPosition / rect.width;
      const newTime = clickPercentage * videoRef.current.duration;

      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="layout-container">
      <main className="main-stage">
        <header className="player-header">
          <button
            className="back-link"
            onClick={() => navigate("/studentdashboard")}
          >
            &larr; Back to Dashboard
          </button>
          <div className="header-meta">
            <h1 style={{ color: "white" }}>{courseData.title}</h1>
            <span className="badge-pro">PRO COURSE</span>
          </div>
        </header>

        <div className="video-container">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              className="video-element"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            />

            {!isPlaying && (
              <div className="video-overlay" onClick={togglePlay}>
                <div className="play-btn-large">
                  <Icons.Play />
                </div>
              </div>
            )}

            <div className="video-controls">
              <div className="progress-bar-bg" onClick={handleSeek}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>

              <div className="controls-row">
                <div className="left-controls">
                  <button onClick={togglePlay}>
                    {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                  </button>
                  <button onClick={toggleMute}>
                    {isMuted ? <Icons.Mute /> : <Icons.Volume />}
                  </button>
                  <span className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="right-controls">
                  <button>
                    <Icons.Settings />
                  </button>
                  <button onClick={toggleFullScreen}>FS</button>
                </div>
              </div>
            </div>
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

          <div className="tab-content">
            {activeTab === "Overview" && (
              <div className="overview-content">
                <div className="content-left">
                  <h2>{currentLesson.title}</h2>
                  <p>
                    In this deep dive, we explore the internal architecture of
                    React's Fiber reconciliation algorithm. You will learn why
                    React is fast, how the Virtual DOM diffing works.
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
              </div>
            )}

            {(activeTab === "Q&A" || activeTab === "Reviews") && (
              <div className="empty-state">
                Content coming soon for this demo.
              </div>
            )}
          </div>
        </div>
      </main>

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
                      onClick={() => handleLessonChange(lesson)}
                      className={`lesson-row ${
                        currentLesson.id === lesson.id ? "active" : ""
                      } ${lesson.completed ? "completed" : ""}`}
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
