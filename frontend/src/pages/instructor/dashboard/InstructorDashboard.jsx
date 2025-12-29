import React, { useState } from "react";
import "../../../styles/instructor/Dashboard.css";
import {
  FaHome,
  FaBook,
  FaPlus,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const statsData = [
  {
    title: "Total Students",
    value: "1,204",
    icon: "👨‍🎓",
    color: "#e0e7ff",
    textColor: "#4338ca",
  },
  {
    title: "Total Earnings",
    value: "$42,500",
    icon: "💰",
    color: "#dcfce7",
    textColor: "#15803d",
  },
  {
    title: "Active Courses",
    value: "12",
    icon: "📚",
    color: "#ffedd5",
    textColor: "#c2410c",
  },
  {
    title: "Course Rating",
    value: "4.8",
    icon: "⭐",
    color: "#fef3c7",
    textColor: "#b45309",
  },
];

const coursesData = [
  {
    id: 1,
    title: "Advanced React Patterns",
    students: 450,
    price: "$49",
    status: "Active",
  },
  {
    id: 2,
    title: "Node.js for Beginners",
    students: 320,
    price: "$29",
    status: "Active",
  },
  {
    id: 3,
    title: "UI/UX Masterclass",
    students: 105,
    price: "$59",
    status: "Draft",
  },
];

function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: stat.color, color: stat.textColor }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>My Courses</h2>
        <button
          className="btn-primary"
          onClick={() => setActiveTab("create-course")}
        >
          <FaPlus /> New Course
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Students</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coursesData.map((course) => (
              <tr key={course.id}>
                <td className="fw-bold">{course.title}</td>
                <td>{course.students}</td>
                <td>{course.price}</td>
                <td>
                  <span
                    className={`status-badge ${course.status.toLowerCase()}`}
                  >
                    {course.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon edit">
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderCreateCourse = () => (
    <div className="form-wrapper">
      <div className="section-header">
        <h2>Upload New Course</h2>
        <button
          className="btn-outline"
          onClick={() => setActiveTab("dashboard")}
        >
          Cancel
        </button>
      </div>

      <form className="course-form">
        <div className="form-group">
          <label>Course Title</label>
          <input type="text" placeholder="e.g. Master Python in 30 Days" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price ($)</label>
            <input type="number" placeholder="49.99" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Design</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Course Thumbnail</label>
          <div className="file-upload-box">
            <p>Drag & drop image here or click to browse</p>
            <input type="file" />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="5" placeholder="What will students learn?"></textarea>
        </div>

        <button type="submit" className="btn-primary">
          Publish Course
        </button>
      </form>
    </div>
  );

  const renderSettings = () => (
    <div className="form-wrapper">
      <h2>Instructor Settings</h2>
      <form className="course-form">
        <div className="form-group">
          <label>Display Name</label>
          <input type="text" defaultValue="John Doe" />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            rows="3"
            defaultValue="Senior Software Engineer with 10 years of experience."
          ></textarea>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" defaultValue="john@example.com" disabled />
        </div>
        <button className="btn-primary">Save Changes</button>
      </form>
    </div>
  );

  return (
    <div className="instructor-dashboard-container">
      <div className="mobile-header">
        <div className="brand">InstructorPanel</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="brand-desktop">
          <h2>
            Instructor<span>.</span>
          </h2>
        </div>

        <nav className="nav-menu">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
          >
            <FaHome /> Dashboard
          </button>
          <button
            className={activeTab === "create-course" ? "active" : ""}
            onClick={() => {
              setActiveTab("create-course");
              setIsSidebarOpen(false);
            }}
          >
            <FaBook /> Create Course
          </button>
          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
          >
            <FaCog /> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="welcome-text">
            <h1>Welcome back, John! 👋</h1>
            <p>Here is what's happening with your courses today.</p>
          </div>
          <div className="user-profile">
            <div className="avatar">JD</div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "create-course" && renderCreateCourse()}
          {activeTab === "settings" && renderSettings()}
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboard;
