import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/student/Login";
import StudentSignup from "./pages/student/Signup";
import InstructorLogin from "./pages/instructor/Login";
import InstructorSignup from "./pages/instructor/Signup";
import AdminLogin from "./pages/admin/Login";
import AdminSignup from "./pages/admin/Signup";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/student/Dashboard";
import CourseDetails from "./pages/student/CourseDetails";
import CoursePlayer from "./pages/student/CoursePlayer";

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
        <Route path="/studentdashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/learn/:id" element={<CoursePlayer />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
