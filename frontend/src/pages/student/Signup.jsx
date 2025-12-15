import { useNavigate } from "react-router-dom";
import "../../styles/student/Signup.css";
import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const registeredEmail = localStorage.getItem("email");
  if (registeredEmail) {
    return (
      <div className="auth-page-container">
        <div className="auth-form-card">
          <h1 className="auth-form-title">Enter Otp</h1>
          <form className="auth-form">
            <div className="auth-input-group">
              <input type="text" id="fullname" name="otp" required placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
            </div>
            <button type="submit" className="auth-form-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="auth-page-container">
        <div className="auth-form-card">
          <h1 className="auth-form-title">Create Student Account</h1>
          <form className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" name="fullname" required onChange={e=>setUsername(e.target.value)}/>
            </div>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required onChange={e=>setPassword(e.target.value)}/>
            </div>
            <button type="submit" className="auth-form-button">
              Sign Up
            </button>
          </form>
          <div className="auth-form-toggle">
            <p onClick={() => navigate("/studentlogin")}>
              Already have an account? <a>Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
