import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/student/Login";
import StudentSignup from "./pages/student/Signup";
import InstructorLogin from "./pages/instructor/Login";
import InstructorSignup from "./pages/instructor/Signup";
import AdminLogin from "./pages/admin/Login";
import AdminSignup from "./pages/admin/Signup";
<<<<<<< HEAD
import StudentDashboard from "./pages/student/Dashboard";
=======
import ForgotPassword from "./pages/ForgotPassword";
import ContactUs from "./pages/ContactUs";   
>>>>>>> bfd75fc044ee437a9427793f4965337f65db39b8

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
<<<<<<< HEAD
        <Route path="/StudentDashboard" element={<StudentDashboard/>} />
=======
        <Route path="/:role/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactUs />} />
>>>>>>> bfd75fc044ee437a9427793f4965337f65db39b8
      </Routes>
    </BrowserRouter>
  );
}

export default App;
