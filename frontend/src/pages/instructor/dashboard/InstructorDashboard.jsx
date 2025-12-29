import React, { useState } from "react";
import "../../../styles/instructor/dashboard.css";

const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    courses: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    upload: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
    message: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
    market: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    edit: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    trash: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    ),
    plus: (
      <svg
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    menu: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    ),
  };
  return icons[name];
};

const myCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    students: 1240,
    revenue: "$62,000",
    status: "Published",
    img: "https://placehold.co/100x60/3b82f6/white?text=React",
  },
  {
    id: 2,
    title: "Node.js Microservices",
    students: 850,
    revenue: "$34,000",
    status: "Draft",
    img: "https://placehold.co/100x60/10b981/white?text=Node",
  },
];

const marketInsights = [
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Jose P.",
    rating: 4.8,
    students: "15k",
  },
  {
    id: 4,
    title: "Figma UI Mastery",
    instructor: "Angela Y.",
    rating: 4.9,
    students: "22k",
  },
];

const messages = [
  {
    id: 1,
    student: "Alex Doe",
    text: "Hey, I had a question about Module 3...",
    time: "2m ago",
  },
  {
    id: 2,
    student: "Jane Smith",
    text: "Thanks for the great course!",
    time: "1h ago",
  },
];

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("my-courses");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="instructor-layout">
      <aside className={`inst-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="inst-brand">
          <div className="inst-logo">I</div>
          <h2>Instructor</h2>
        </div>

        <nav className="inst-nav">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <Icon name="dashboard" /> <span>Overview</span>
          </button>
          <button
            className={activeTab === "my-courses" ? "active" : ""}
            onClick={() => setActiveTab("my-courses")}
          >
            <Icon name="courses" /> <span>My Courses</span>
          </button>
          <button
            className={activeTab === "create" ? "active" : ""}
            onClick={() => setActiveTab("create")}
          >
            <Icon name="upload" /> <span>Create Course</span>
          </button>
          <button
            className={activeTab === "market" ? "active" : ""}
            onClick={() => setActiveTab("market")}
          >
            <Icon name="market" /> <span>Market Insights</span>
          </button>
          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <Icon name="message" /> <span>Messages</span>
          </button>
        </nav>

        <div className="inst-profile">
          <img src="https://i.pravatar.cc/150?img=12" alt="Profile" />
          <div>
            <h4>John Doe</h4>
            <span>Senior Instructor</span>
          </div>
        </div>
      </aside>

      <main className="inst-main">
        <header className="inst-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Icon name="menu" />
          </button>
          <h1>{activeTab.replace("-", " ").toUpperCase()}</h1>
          <button className="btn-accent">Go Live</button>
        </header>

        <div className="inst-content-area">
          {activeTab === "overview" && (
            <div className="inst-overview">
              <div className="stat-grid">
                <div className="stat-card">
                  <h3>Total Revenue</h3>
                  <p>$96,000</p>
                  <span>+12% this month</span>
                </div>
                <div className="stat-card">
                  <h3>Total Students</h3>
                  <p>2,090</p>
                  <span>+54 new enrollments</span>
                </div>
                <div className="stat-card">
                  <h3>Avg. Rating</h3>
                  <p>4.8</p>
                  <span>Based on 300 reviews</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "my-courses" && (
            <div className="inst-courses-list">
              <div className="list-header">
                <h3>Your Active Courses</h3>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab("create")}
                >
                  + New Course
                </button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Students</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="course-cell">
                          <img src={course.img} alt="" />
                          <span>{course.title}</span>
                        </td>
                        <td>{course.students}</td>
                        <td>{course.revenue}</td>
                        <td>
                          <span
                            className={`status-badge ${course.status.toLowerCase()}`}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button className="icon-btn" title="Edit">
                            <Icon name="edit" size={16} />
                          </button>
                          <button className="icon-btn danger" title="Delete">
                            <Icon name="trash" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div className="create-course-form">
              <div className="form-group">
                <label>Course Title</label>
                <input type="text" placeholder="e.g. Master React in 30 Days" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" placeholder="49.99" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select>
                    <option>Development</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="4"
                  placeholder="What will students learn?"
                ></textarea>
              </div>

              <div className="upload-zone">
                <Icon name="upload" size={40} />
                <p>
                  Drag & Drop video files here or <span>Browse</span>
                </p>
                <span className="upload-hint">MP4, MOV, AVI up to 2GB</span>
              </div>

              <div className="form-actions">
                <button className="btn-outline">Save Draft</button>
                <button className="btn-primary">Publish Course</button>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="messages-panel">
              {messages.map((msg) => (
                <div key={msg.id} className="message-row">
                  <div className="msg-avatar">{msg.student.charAt(0)}</div>
                  <div className="msg-body">
                    <div className="msg-header">
                      <h4>{msg.student}</h4>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                  <button className="btn-reply">Reply</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "market" && (
            <div className="market-list">
              <h3>Top Performing Courses in Your Category</h3>
              <div className="market-grid">
                {marketInsights.map((item) => (
                  <div key={item.id} className="market-card">
                    <h4>{item.title}</h4>
                    <p>By {item.instructor}</p>
                    <div className="market-stats">
                      <span>⭐ {item.rating}</span>
                      <span>👥 {item.students} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
