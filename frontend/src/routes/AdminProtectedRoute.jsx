import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuthStore } from "../store/admin/useAdminAuthStore";

export default function AdminProtectedRoute() {
    const checkAuth = useAdminAuthStore((state) => state.checkAuth);
    const admin = useAdminAuthStore((state) => state.admin);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAuth().finally(() => setChecking(false));
    }, []);

    if (checking) return null;
    if (!admin) return <Navigate to="/adminlogin" replace />;
    return <Outlet />;
}
