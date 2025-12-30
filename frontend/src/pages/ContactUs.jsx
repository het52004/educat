import { useState } from "react";
import "../styles/ContactUs.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill all required fields");
      return;
    }

    console.log(formData);
    setError("");
  };

  return (
    <>
      <header className="header">
        <img
          src="/assets/images/EduCat (3).png"
          alt="EduCat"
          className="logo"
        />
      </header>

      <div className="container">
        <div className="contact_cont">
          <div className="leftcon">
            <img src="/assets/images/contact_us.png" alt="Contact Us" />
          </div>

          <div className="rightcon">
            <form className="contact_form" onSubmit={handleSubmit}>
              <h2>Contact Us</h2>

              {error && <p className="error">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                className="inputcon"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                className="inputcon"
                value={formData.email}
                onChange={handleChange}
              />

              <select
                name="role"
                className="inputcon"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="visitor">Visitor</option>
              </select>

              <select
                name="subject"
                className="inputcon"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select Subject *</option>
                <option value="account">Account Issue</option>
                <option value="course">Course Related</option>
                <option value="payment">Payment / Billing</option>
                <option value="technical">Technical Issue</option>
                <option value="general">General Inquiry</option>
              </select>

              <textarea
                name="message"
                placeholder="Message *"
                className="inputcon textarea"
                value={formData.message}
                onChange={handleChange}
              />

              <button type="submit" className="btncon">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
