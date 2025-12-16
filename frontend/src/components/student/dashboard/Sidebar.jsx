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
        <div className="logo-circle">E</div>
        <h2>EduCat</h2>
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
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => handleTabClick("messages")}
        >
          <Icon name="message" /> <span>Messages</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;