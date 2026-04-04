import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useInstructorAuthStore } from "../store/instructor/useInstructorAuthStore";

export default function InstructorProtectedRoute() {
    const checkAuth = useInstructorAuthStore((state) => state.checkAuth);
    const instructor = useInstructorAuthStore((state) => state.instructor);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAuth().finally(() => setChecking(false));
    }, []);

    if (checking) return null;
    if (!instructor) return <Navigate to="/instructorlogin" replace />;
    return <Outlet />;
}
