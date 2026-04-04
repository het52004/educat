import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/student/useAuthStore";

export default function StudentProtectedRoute() {
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const user = useAuthStore((state) => state.user);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAuth().finally(() => setChecking(false));
    }, []);

    if (checking) return null;
    if (!user) return <Navigate to="/studentlogin" replace />;
    return <Outlet />;
}
