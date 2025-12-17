import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/student/CoursePlayer.css";
import { courseData } from "../../../seed/student/courseData";
import { CourseIcons } from "../../../components/student/dashboard/Icons";

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
  const { id } = useParams();
  const videoRef = useRef(null);

  const course = courseData.find((c) => c.id === parseInt(id));

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
    course.sections &&
      course.sections.length > 0 &&
      course.sections[0].lessons.length > 0
      ? course.sections[0].lessons[0]
      : null
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current && currentLesson) {
      videoRef.current.load();
      if (isPlaying) videoRef.current.play();
    }
  }, [currentLesson]);

  const toggleSection = (secId) => {
    setOpenSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
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

  if (!currentLesson)
    return <div style={{ color: "white" }}>No lessons available</div>;

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
            <h1>{course.title}</h1>
            <span className="badge-pro">PRO COURSE</span>
          </div>
        </header>

        <div className="video-container">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="video-element"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!isPlaying && (
              <div className="video-overlay" onClick={togglePlay}>
                <div className="play-btn-large">
                  <CourseIcons.Play />
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
                    {isPlaying ? <CourseIcons.Pause /> : <CourseIcons.Play />}
                  </button>
                  <button onClick={toggleMute}>
                    {isMuted ? <CourseIcons.Mute /> : <CourseIcons.Volume />}
                  </button>
                  <span className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="right-controls">
                  <button>
                    <CourseIcons.Settings />
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
                  <p>In this deep dive, we explore {currentLesson.title}.</p>
                  <h3>Key Topics</h3>
                  <ul className="learning-points">
                    <li>Core Concepts</li>
                    <li>Practical Application</li>
                  </ul>
                </div>
                <div className="content-right">
                  <div className="instructor-card">
                    <div className="instructor-head">
                      <img src={course.instructor.avatar} alt="Instructor" />
                      <div>
                        <h4>{course.instructor.name}</h4>
                        <span>{course.instructor.role}</span>
                      </div>
                    </div>
                    <div className="instructor-stats">
                      <div className="stat">
                        <strong>{course.instructor.students}</strong> Students
                      </div>
                      <div className="stat">
                        <strong>{course.instructor.rating}</strong> Rating
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
                    <CourseIcons.File />
                  </div>
                  <div className="res-info">
                    <h4>Source Code</h4>
                    <span>ZIP File</span>
                  </div>
                  <button className="btn-download">Download</button>
                </div>
              </div>
            )}
          </div>
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
                <span>{section.title}</span>
                <span
                  className={`chevron ${
                    openSections[section.id] ? "rotate" : ""
                  }`}
                >
                  <CourseIcons.ChevronDown />
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
                            <CourseIcons.Check />
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
