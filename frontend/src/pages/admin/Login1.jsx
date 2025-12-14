import { useNavigate } from "react-router-dom";
import "../../styles/admin/Login1.css";

// ✅ correct relative path to assets folder
import studyImg from "../../../assets/images/study.png";

function Login1() {
  const navigate = useNavigate(); // kept, no functionality removed

  return (
    <div className="container">
      <div className="leftimg">
        <img src={studyImg} alt="Study" />
      </div>

      <form
        action="includes/scripts/signmein.php"
        method="post"
        className="login"
      >
        <div className="main">
          <div className="heading">
            <h1>Sign In</h1>
          </div>

          {/* message placeholder */}
          <h4></h4>

          <div className="inputs">
            <input
              type="email"
              name="educat_login_email"
              className="input"
              placeholder="Email"
              autoFocus
              required
            />

            <input
              type="password"
              name="educat_login_password"
              className="input"
              placeholder="Password"
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
              required
            />
          </div>

          <div className="link">
            <a href="forgot-password.php">Forgot password?</a>
          </div>

          <div className="button">
            <input type="submit" className="btn" value="Sign In" />
          </div>

          <div className="signup">
            Don't have an account?
            <a href="sign-up.php">&nbsp;Sign Up</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login1;
