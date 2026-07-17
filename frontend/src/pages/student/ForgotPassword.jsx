import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/student/Login.css";
import "../../styles/student/ForgotPassword.css";
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
  const [submitting, setSubmitting] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setMessage("");
    setSubmitting(true);
    const success = await requestPasswordReset(trimmedEmail);
    setSubmitting(false);
    if (success) {
      setEmail(trimmedEmail);
      setMessage(`If an account exists for ${trimmedEmail}, an OTP has been sent.`);
      setStep(2);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setConfirmError("");

    if (!otp.trim()) {
      setConfirmError("Please enter the OTP sent to your email.");
      return;
    }
    if (newPassword.length < 6) {
      setConfirmError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match!");
      return;
    }

    setSubmitting(true);
    const success = await resetPassword(email, otp.trim(), newPassword);
    setSubmitting(false);
    if (success) {
      alert("Password reset successfully! Please login with your new password");
      navigate("/studentlogin");
    }
  };

  const handleResendOtp = () => {
    setStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setConfirmError("");
    setMessage("");
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

          <div
            className="button"
            onClick={step === 1 ? handleRequestOtp : handleResetPassword}
            style={submitting ? { opacity: 0.7, pointerEvents: "none" } : undefined}
          >
            <input
              type="submit"
              className="btn auth-btn"
              disabled={submitting}
              value={
                submitting
                  ? (step === 1 ? "Sending..." : "Resetting...")
                  : (step === 1 ? "Send OTP" : "Reset Password")
              }
            />
          </div>

          {message && <div className="success" style={{ color: "green", textAlign: "center", marginTop: "10px" }}>{message}</div>}
          <div className="error" style={{ color: "red" }}>
            {confirmError || (step === 1 ? forgotPasswordError : resetPasswordError)}
          </div>

          {step === 2 && (
            <div className="link">
              <a onClick={handleResendOtp} style={{ cursor: "pointer" }}>Entered wrong email? Start over</a>
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
