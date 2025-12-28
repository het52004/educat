import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/student/Login";
import StudentSignup from "./pages/student/Signup";
import InstructorLogin from "./pages/instructor/Login";
import InstructorSignup from "./pages/instructor/Signup";
import AdminLogin from "./pages/admin/Login";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/student/dashboard/Dashboard";
import CoursePlayer from "./pages/student/resume-course/CoursePlayer";
import CourseDetails from "./pages/student/dashboard/CourseDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/studentsignup" element={<StudentSignup />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/instructorsignup" element={<InstructorSignup />} />
        <Route path="/instructorlogin" element={<InstructorLogin />} />
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
