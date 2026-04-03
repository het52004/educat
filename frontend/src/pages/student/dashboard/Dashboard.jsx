import "../../../styles/student/Dashboard.css";
import useDashboardStore from "../../../store/student/useDashboardStore";
import Sidebar from "../../../components/student/dashboard/Sidebar";
import Home from "../../../components/student/dashboard/Home";
import BrowseNewCourses from "../../../components/student/dashboard/BrowseNewCourses";
import Messages from "../../../components/student/dashboard/Messages";
import Header from "../../../components/student/dashboard/Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/student/useAuthStore";

export default function Dashboard() {
  const { activeTab, isSidebarOpen, closeSidebar } = useDashboardStore();
  const navigate = useNavigate();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    async function verifyAuth() {
      const res = await checkAuth();
      if (!res) {
        navigate("/studentlogin");
      }
    }
    verifyAuth();
  }, []);

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
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
}
