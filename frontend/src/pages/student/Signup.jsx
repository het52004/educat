import { Link } from "react-router-dom";
import "../../styles/student/Signup.css";
import studyImg from "../../../assets/images/study.png";

function Signup() {

  return (
    <div className="container">
      <form
        className="login"
        id="signupform"
      >
        <div className="main">
          <div className="heading">
            <h1>Sign up</h1>
          </div>
          <div className="inputs">
            <input
              type="text"
              name="educat_user_fullname"
              className="input"
              placeholder="Full Name"
              pattern="^[^0-9]+$"
              title="Please enter a valid name without numbers"
              autoFocus
              required
            />

            <input
              type="email"
              name="educat_user_email"
              className="input"
              placeholder="Email"
              id="emailID"
              required
            />

            <span id="emailError" className="error"></span>

            <input
              type="password"
              name="educat_user_password"
              className="input"
              placeholder="Password"
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
              id="password"
              required
            />

            <input
              type="text"
              name="educat_user_confirm_password"
              className="input"
              placeholder="Contact"
              required
            />
          </div>

          <div className="button">
            <input type="submit" className="btn" value="Sign Up" />
          </div>

          <div className="signup">
            Have an account?
            <Link to="/studentlogin">&nbsp;Sign In</Link>
          </div>
        </div>
      </form>

      <div className="leftimg">
        <img src={studyImg} alt="Study" />
      </div>
    </div>
  );
}

export default Signup;
