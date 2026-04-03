import { Link, useNavigate } from "react-router-dom";
import "../../styles/instructor/Signup.css";
import studyImg from "../../../assets/images/study.png";
import { useState } from "react";
import { useInstructorAuthStore } from "../../store/instructor/useInstructorAuthStore";

function EnterOtp() {
  const [otp, setOtp] = useState();
  const email = localStorage.getItem("instructorEmail");
  const enterOtp = useInstructorAuthStore((state) => state.enterOtp);
  const error = useInstructorAuthStore((state) => state.error);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await enterOtp(otp, email);
    if (success) {
      navigate("/instructorlogin");
    }
  }

  return (
    <div className="auth-container">
      <form className="login" id="signupform">
        <div className="main">
          <div className="heading">
            <h1>Enter Otp</h1>
          </div>
          <div className="inputs">
            <input
              type="text"
              className="input"
              placeholder="Enter OTP"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <div className="button" onClick={handleSubmit}>
            <input type="submit" className="btn" value="Submit" />
          </div>

          <div className="error" style={{ color: "red" }}>
            {error}
          </div>

          <div className="signup">
            Back to signup page?
            <Link to="/instructorsignup">&nbsp;Sign Up</Link>
          </div>
        </div>
      </form>

      <div className="leftimg">
        <img src={studyImg} alt="Study" />
      </div>
    </div>
  );
}

export default EnterOtp;
