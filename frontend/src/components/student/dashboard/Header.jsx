import useDashboardStore from "../../../store/student/useDashboardStore";
import "../../../styles/student/Dashboard.css";
import { Icon } from "./Icons";
import { useAuthStore } from "../../../store/student/useAuthStore";
import { useNavigate } from "react-router-dom";

function Header() {
  const { toggleSidebar, searchQuery, setSearchQuery, setActiveTab } = useDashboardStore();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/studentlogin");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setActiveTab("browse-courses");
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setActiveTab("browse-courses");
    }
  };

  return (
    <header className="top-bar">
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <Icon name="menu" />
      </button>

      <div className="search-bar">
        <Icon name="search" />
        <input
          type="text"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleSearchKey}
        />
      </div>

      <div className="user-actions">
        <button className="icon-btn">
          <Icon name="bell" />
        </button>
        <span className="user-name">{user?.fullName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
