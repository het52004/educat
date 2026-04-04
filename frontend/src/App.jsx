import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentProtectedRoute from "./routes/StudentProtectedRoute";
import InstructorProtectedRoute from "./routes/InstructorProtectedRoute";

import RoleSelection from "./pages/RoleSelection";
import ContactUs from "./pages/ContactUs";

import StudentLogin from "./pages/student/Login";
import StudentSignup from "./pages/student/Signup";
import StudentEnterOtp from "./pages/student/EnterOtp";
import Dashboard from "./pages/student/dashboard/Dashboard";
import CourseDetails from "./pages/student/dashboard/CourseDetails";
import CoursePlayer from "./pages/student/resume-course/CoursePlayer";

import InstructorLogin from "./pages/instructor/Login";
import InstructorSignup from "./pages/instructor/Signup";
import InstructorEnterOtp from "./pages/instructor/EnterOtp";
import InstructorDashboard from "./pages/instructor/dashboard/InstructorDashboard";

import AdminLogin from "./pages/admin/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Student public routes */}
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/studentsignup" element={<StudentSignup />} />
        <Route path="/enterotp" element={<StudentEnterOtp />} />

        {/* Student protected routes */}
        <Route element={<StudentProtectedRoute />}>
          <Route path="/studentdashboard" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/learn/:id" element={<CoursePlayer />} />
        </Route>

        {/* Instructor public routes */}
        <Route path="/instructorlogin" element={<InstructorLogin />} />
        <Route path="/instructorsignup" element={<InstructorSignup />} />
        <Route path="/instructorenterotp" element={<InstructorEnterOtp />} />

        {/* Instructor protected routes */}
        <Route element={<InstructorProtectedRoute />}>
          <Route path="/instructordashboard" element={<InstructorDashboard />} />
        </Route>

        {/* Admin routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
