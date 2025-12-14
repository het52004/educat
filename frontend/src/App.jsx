import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/student/Login";
import StudentSignup from "./pages/student/Signup";
import InstructorLogin from "./pages/instructor/Login";
import InstructorSignup from "./pages/instructor/Signup";
import AdminLogin from "./pages/admin/Login1";
import AdminSignup from "./pages/admin/Signup";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/studentsignup" element={<StudentSignup />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/instructorsignup" element={<InstructorSignup />} />
        <Route path="/instructorlogin" element={<InstructorLogin />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/:role/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
