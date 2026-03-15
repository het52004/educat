import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/student/Signup.css";
import studyImg from "../../../assets/images/study.png";
import { useAuthStore } from "../../store/student/useAuthStore";

function Signup() {
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const requestOtpError = useAuthStore((state) => state.requestOtpError);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await requestOtp(formData);

    if (success) {
      navigate("/enterotp");
    }
    setFormData({ fullname: "", email: "", password: "", contact: "" });
  };

  return (
    <div className="container">
      <form className="login" id="signupform">
        <div className="main">
          <div className="heading">
            <h1>Sign up</h1>
          </div>

          <div className="inputs">
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              className="input"
              placeholder="Email"
              id="emailID"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <span id="emailError" className="error"></span>

            <input
              type="password"
              className="input"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              className="input"
              placeholder="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button" onClick={handleSubmit}>
            <input type="submit" className="btn" value="Sign Up" />
          </div>

          <div className="error" style={{ color: "red" }}>
            {requestOtpError}
          </div>

          <div className="signup">
            Have an account?
            <Link to="/studentlogin">&nbsp;Sign In</Link>
            &nbsp;&nbsp;&nbsp; Already have OTP?
            <a href="/enterotp">&nbsp;Enter Otp</a>
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
