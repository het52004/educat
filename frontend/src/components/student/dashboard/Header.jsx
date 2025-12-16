import useDashboardStore from '../../../store/student/useDashboardStore';
import '../../../styles/student/Dashboard.css';
import { Icon } from "./Icons";

function Header() {
  const { toggleSidebar } = useDashboardStore();

  return (
    <header className="top-bar">
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <Icon name="menu" />
      </button>

      <div className="search-bar">
        <Icon name="search" />
        <input type="text" placeholder="Search for courses..." />
      </div>

      <div className="user-actions">
        <button className="icon-btn">
          <Icon name="bell" />
        </button>
        <img
          src="https://i.pravatar.cc/100?img=33"
          alt="User"
          className="user-avatar"
        />
      </div>
    </header>
  );
}

export default Header;
