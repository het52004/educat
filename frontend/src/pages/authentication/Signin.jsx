import "../../styles/Signin.css";
import StudyImage from "../../assets/images/study.png";

function Signin() {
  return (
    <>
      <div className="container">
        <div className="leftimg">
          <img src={StudyImage} />
        </div>
        <form className="login">
          <div className="main">
            <div className="heading">
              <h1>Sign In</h1>
            </div>
            <div className="inputs">
              <input
                type="email"
                name="educat_login_email"
                className="input"
                placeholder="Email"
                autofocus=""
                required=""
              />
              <input
                type="password"
                name="educat_login_password"
                className="input"
                placeholder="Password"
                title="Password must be at least 8 characters long"
                required=""
              />
            </div>
            <div className="link">
              <a href="forgot-password.php">Forgot password?</a>
            </div>
            <div className="button">
              <input type="submit" className="btn" defaultValue="Sign In" />
            </div>
            <div className="signup">
              Don't have an account? <a href="sign-up.php">&nbsp;Sign Up</a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signin;
