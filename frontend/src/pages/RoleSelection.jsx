import { useNavigate } from "react-router-dom";
import "../styles/RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const handleRoleClick = (role) => {
    switch (role) {
      case "student":
        navigate("/studentsignup");
        break;
      case "admin":
        navigate("/adminsignup");
        break;
      case "instructor":
        navigate("/instructorsignup");
        break;
      default:
        console.log("Error no path specified");
    }
  };

  return (
    <>
      <div className="role-container">
        <h1 className="role-title">Choose Your Role</h1>
        <div className="role-options">
          <div className="role-card" onClick={() => handleRoleClick("admin")}>
            <h2>Admin</h2>
            <p>Manage the platform, users, and content.</p>
          </div>
          <div
            className="role-card"
            onClick={() => handleRoleClick("instructor")}
          >
            <h2>Instructor</h2>
            <p>Create, manage, and publish your courses.</p>
          </div>
          <div className="role-card" onClick={() => handleRoleClick("student")}>
            <h2>Student</h2>
            <p>Browse and enroll in new courses.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;
