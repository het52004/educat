import React from "react";
import "../../styles/Signin.css";
import ForgotImage from "../../assets/images/forgot.png";


export default function ForgotPassword() {
  return (
    <div className="container">
      <div className="leftimg">
        <img src={ForgotImage}/>
      </div>

      <form className="login" method="post">
        <div className="main">
          <div className="heading">
            <h1>Reset Password</h1>
          </div>

          <div className="inputs">
            <input
              type="email"
              name="educat_password_reset_email"
              className="input"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="button">
            <input value="Submit" name="Submit" type="submit" className="btn" />
          </div>

          <div className="signup">
            <a href="sign-in.php">Back to Login</a>
          </div>
        </div>
      </form>
    </div>
  );
}
