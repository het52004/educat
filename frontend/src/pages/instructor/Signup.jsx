import { useNavigate } from "react-router-dom";
import "../../styles/instructor/Signup.css"

function Signup() {
  const navigate = useNavigate();
  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h1 className="auth-form-title">Create Instructor Account</h1>
        <form className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" id="fullname" name="fullname" required />
          </div>
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="auth-input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
            />
          </div>
          <button type="submit" className="auth-form-button">
            Sign Up
          </button>
        </form>
        <div className="auth-form-toggle">
          <p onClick={()=>navigate("/instructorlogin")}>
            Already have an account? <a>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
