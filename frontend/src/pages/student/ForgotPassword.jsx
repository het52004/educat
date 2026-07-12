import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/student/Login.css";
import studyImg from "../../../assets/images/study.png";
import { useAuthStore } from "../../store/student/useAuthStore";

function ForgotPassword() {
  const navigate = useNavigate();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const forgotPasswordError = useAuthStore((state) => state.forgotPasswordError);
  const resetPasswordError = useAuthStore((state) => state.resetPasswordError);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    const success = await requestPasswordReset(email);
    if (success) {
      setMessage(`If an account exists for ${email}, an OTP has been sent.`);
      setStep(2);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setConfirmError("");
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match!");
      return;
    }
    const success = await resetPassword(email, otp, newPassword);
    if (success) {
      alert("Password reset successfully! Please login with your new password");
      navigate("/studentlogin");
    }
  };

  return (
    <div className="container">
      <div className="leftimg">
        <img src={studyImg} alt="Study" />
      </div>

      <form className="login">
        <div className="main">
          <div className="heading">
            <h1>Reset Password</h1>
          </div>

          {step === 1 && (
            <div className="inputs">
              <input
                type="email"
                className="input"
                placeholder="Enter your email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="inputs">
              <input
                type="text"
                className="input"
                placeholder="Enter OTP"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="button" onClick={step === 1 ? handleRequestOtp : handleResetPassword}>
            <input type="submit" className="btn" value={step === 1 ? "Send OTP" : "Reset Password"} />
          </div>

          {message && <div className="success" style={{ color: "green", textAlign: "center", marginTop: "10px" }}>{message}</div>}
          <div className="error" style={{ color: "red" }}>
            {confirmError || (step === 1 ? forgotPasswordError : resetPasswordError)}
          </div>

          {step === 2 && (
            <div className="link">
              <a onClick={() => setStep(1)} style={{ cursor: "pointer" }}>Resend OTP</a>
            </div>
          )}

          <div className="signup">
            Remembered your password?
            <Link to="/studentlogin">&nbsp;Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
