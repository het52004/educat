import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/admin/login.css";

export default function ForgotPassword() {
  const { role } = useParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      setMessage("");
      return;
    }
    setError("");
    setMessage(`OTP will be sent to ${email} for ${role} account (backend pending)`);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-card">
        <h1 className="auth-form-title">{role?.toUpperCase()} Reset Password</h1>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <input
              type="email"
              className="input"
              placeholder={`Enter ${role} email`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-form-button">Submit</button>
        </form>

        <div className="auth-form-toggle">
          <Link to={`/${role}/login`}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
