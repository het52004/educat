import { Icon } from './Icons';
import '../../../styles/student/Dashboard.css';
import useDashboardStore from '../../../store/student/useDashboardStore';

function Sidebar() {
  const { activeTab, setActiveTab, isSidebarOpen, closeSidebar } = useDashboardStore();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    closeSidebar();
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="brand">
        <div className="logo-symbol">
          <img src="/assets/images/EduCat (4).png" alt="logo-symbol"/>
        </div>
        <div className="logo-name">
          <img src="/assets/images/EduCat (3).png" alt="logo-name"/>
        </div>
      </div>

      <nav className="nav-menu">
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => handleTabClick("home")}
        >
          <Icon name="grid" /> <span>Home</span>
        </button>
        <button
          className={activeTab === "browse-courses" ? "active" : ""}
          onClick={() => handleTabClick("browse-courses")}
        >
          <Icon name="book" /> <span>Browse Courses</span>
        </button>
        <button
          className={activeTab === "enrolled-courses" ? "active" : ""}
          onClick={() => handleTabClick("enrolled-courses")}
        >
          <Icon name="graduation" /> <span>Enrolled Courses</span>
        </button>
        <button
          className={activeTab === "certificates" ? "active" : ""}
          onClick={() => handleTabClick("certificates")}
        >
          <Icon name="certificate" /> <span>My Certificates</span>
        </button>
        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => handleTabClick("messages")}
        >
          <Icon name="message" /> <span>Messages</span>
        </button>
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => handleTabClick("profile")}
        >
          <Icon name="user" /> <span>My Profile</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
