import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/instructor/Signup.css";
import studyImg from "../../../assets/images/study.png";
import { useInstructorAuthStore } from "../../store/instructor/useInstructorAuthStore";

function Signup() {
  const navigate = useNavigate();
  const requestOtp = useInstructorAuthStore((state) => state.requestOtp);
  const requestOtpError = useInstructorAuthStore((state) => state.requestOtpError);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    expertise: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpertiseChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, expertise: [...formData.expertise, value] });
    } else {
      setFormData({ ...formData, expertise: formData.expertise.filter((s) => s !== value) });
    }
  };

  const checkPasswordMatch = () => {
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      confirmPasswordRef.current.setCustomValidity("Passwords do not match");
    } else {
      confirmPasswordRef.current.setCustomValidity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await requestOtp(formData);
    if (success) {
      navigate("/instructorenterotp");
    }
    setFormData({ name: "", email: "", password: "", bio: "", expertise: [] });
  };

  return (
    <div className="auth-container">
      <form className="login" id="signupform">
        <div className="main">
          <div className="heading">
            <h1>Instructor Sign Up</h1>
          </div>

          <div className="inputs">
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              autoFocus
              required
            />

            <input
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="expertise-container">
              <label className="expertise-label">Area of Expertise</label>
              <div className="expertise-options">
                {["Web Development", "Data Science", "AI / ML", "UI / UX", "Prompt Engineering", "Other"].map((skill) => (
                  <label key={skill} className="expertise-item">
                    <input
                      type="checkbox"
                      name="expertise"
                      value={skill}
                      checked={formData.expertise.includes(skill)}
                      onChange={handleExpertiseChange}
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>

            <textarea
              name="bio"
              className="input bio-textarea"
              placeholder="Short Bio (max 150 characters)"
              maxLength="150"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              required
            ></textarea>

            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              ref={passwordRef}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              className="input"
              placeholder="Confirm password"
              ref={confirmPasswordRef}
              onInput={checkPasswordMatch}
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
            <Link to="/instructorlogin">&nbsp;Sign In</Link>
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
