import "../../styles/student/Dashboard.css";

import Sidebar from "../../components/student/Sidebar";
import Home from "../../components/student/Home";
import BrowseNewCourses from "../../components/student/BrowseNewCourses";
import Messages from "../../components/student/Messages";
import useDashboardStore from "../../store/student/useDashboardStore";
import Header from "../../components/student/Header";

export default function StudentDashboard() {
  const { activeTab, isSidebarOpen, closeSidebar } = useDashboardStore();

  return (
    <div className="app-container">
      <Sidebar /> 

      <main className="main-content">
        <Header />
        <div className="content-area">
          {activeTab === "home" && <Home />}
          {activeTab === "browse-courses" && <BrowseNewCourses />}
          {activeTab === "messages" && <Messages />}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="overlay" onClick={closeSidebar}></div>
      )}
    </div>
  );
}