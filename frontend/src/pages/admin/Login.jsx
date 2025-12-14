import { useNavigate } from "react-router-dom";
import "../../styles/admin/Login.css"

function Login() {
  const navigate = useNavigate();
  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h1 className="auth-form-title">Admin Login</h1>
        <form className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="auth-form-button">
            Login
          </button>
        </form>
        <div className="auth-form-toggle">
          <p>
            Don't have an account? <a onClick={() => navigate("/adminsignup")}>Sign Up</a>
          </p>
          <p>
            Forgot Password? <a onClick={() => navigate("/admin/forgot-password")}>Reset Password</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
