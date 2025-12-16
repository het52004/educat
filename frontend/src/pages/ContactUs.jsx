import { useState } from "react";
//import "../assets/css/style.css";
//import "../assets/css/videop.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    txt_name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.txt_name || !formData.email || !formData.message) {
      setError("Please enter all fields");
      return;
    }

    const form = new FormData();
    form.append("txt_name", formData.txt_name);
    form.append("email", formData.email);
    form.append("message", formData.message);

    try {
      const response = await fetch("http://localhost/backend/contact.php", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "error") {
        setError(data.message);
      } else {
        window.location.reload();
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        html, body { max-width: 100%; overflow-x: hidden; }
        body { font-family: Arial, sans-serif;}

        .container {
          display: flex;
          justify-content: center;
          width: 100%;
          overflow-x: hidden;
        }

        .contact_cont {
          width: 100%;
          border-radius: 25px;
          min-height: 87vh;
          background-color: rgba(223, 223, 223, 0.56);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 10px;
        }

        .leftcon, .rightcon {
          flex: 1 1 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* reduced bottom margin */
        .leftcon { margin-bottom: 5px; } 

        .contact_cont h1 {
          color: black;
          font-size: 2.5rem;
          font-family: monospace;
          margin-bottom: 2rem;
        }

        .inputcon {
          padding: 10px 20px;
          width: 90%;
          max-width: 300px;
          text-align: center;
          border-radius: 25px;
          margin: 5px;
          transition: 0.5s all ease;
          border: 2px solid grey;
        }

        .inputcon:focus {
          width: 95%;
          max-width: 300px;
          border-color: rgb(15, 162, 230);
          outline: none;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          width: 100%;
        }

        .btncon {
          cursor: pointer;
          width: 90%;
          max-width: 200px;
          padding: 10px 20px;
          border-radius: 25px;
          outline: none;
          border: 2px solid rgb(80, 80, 80);
          transition: 0.2s all ease;
          background-color: rgb(216, 216, 216);
          margin-top: 10px;
        }

        .btncon:hover {
          background-color: rgb(80, 80, 80);
          color: white;
          font-weight: bold;
        }

        .btncon:active {
          background-color: rgb(39, 39, 39);
          border: 2px solid rgb(39, 39, 39);
          color: white;
          font-weight: bold;
        }

        /* ================= IMAGE SIZES ================= */
        .leftcon img {
          width: 90%;
          max-width: 300px;
          height: auto;
          display: block;
        }

        .logo img {
          width: 100%;
          max-width: 150px;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        /* ================= DEVICE SPECIFIC ================= */
        /* iPhone 12 */
        @media only screen and (max-width: 390px){
          .contact_cont { flex-direction: column; padding: 5px; min-height: 100vh; }
          .leftcon img { max-width: 180px; }
          textarea.inputcon { height: 80px; }
          .inputcon, .inputcon:focus { max-width: 220px; }
          .btncon { max-width: 160px; }
          .logo img { max-width: 120px; }
        }

        /* iPhone 14 */
        @media only screen and (max-width: 430px) and (min-width: 391px){
          .contact_cont { flex-direction: column; padding: 8px; }
          .leftcon img { max-width: 200px; }
          textarea.inputcon { height: 100px; }
          .inputcon, .inputcon:focus { max-width: 240px; }
          .btncon { max-width: 180px; }
          .logo img { max-width: 130px; }
        }

        /* iPad */
        @media only screen and (min-width: 768px) and (max-width: 1366px){
          .contact_cont { flex-direction: row; flex-wrap: nowrap; padding: 20px; }
          .leftcon, .rightcon { width: 48%; }
          .leftcon img { max-width: 300px; }
          textarea.inputcon { height: 120px; }
          .inputcon, .inputcon:focus { max-width: 300px; }
          .btncon { max-width: 200px; }
          .logo img { max-width: 150px; }
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <header>
        <nav className="navigation" style={{ justifyContent: "center" }}>
          <div className="logo">
            <a href="/">
              <img src="/assets/images/EduCat (3).png" alt="Logo" />
            </a>
          </div>
        </nav>
      </header>

      {/* ================= MAIN ================= */}
      <div className="container">
        <div className="contact_cont">
          <div className="leftcon">
            <img src="/assets/images/contact_us.png" alt="Contact Us" />
          </div>

          <div className="rightcon">
            <div className="c_form">
              {error && (
                <div className="alert alert-danger">
                  <strong>Error.</strong> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="txt_name"
                  className="inputcon"
                  placeholder="Name"
                  value={formData.txt_name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  className="inputcon"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  rows="10"
                  className="inputcon"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                />
                <input type="submit" value="Submit" className="btncon" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
