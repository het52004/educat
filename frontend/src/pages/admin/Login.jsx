import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/admin/Login.css";
import studyImg from "../../../assets/images/study.png";
import { useAdminAuthStore } from "../../store/admin/useAdminAuthStore";

function Login() {
  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);
  const loginError = useAdminAuthStore((state) => state.loginError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate("/admindashboard");
    }
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="container">
      <div className="leftimg">
        <img src={studyImg} alt="Study" />
      </div>

      <form className="login">
        <div className="main">
          <div className="heading">
            <h1>Admin Sign In</h1>
          </div>

          <div className="inputs">
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button" onClick={handleSubmit}>
            <input type="submit" className="btn" value="Sign In" />
          </div>

          <div className="error" style={{ color: "red" }}>
            {loginError}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
