import axios from "axios";

const adminApi = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

adminApi.interceptors.response.use(
    (response) => {
        if (response.data?.tokenExpired) {
            import("../store/admin/useAdminAuthStore").then(({ useAdminAuthStore }) => {
                useAdminAuthStore.getState().forceLogout();
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            import("../store/admin/useAdminAuthStore").then(({ useAdminAuthStore }) => {
                useAdminAuthStore.getState().forceLogout();
            });
        }
        return Promise.reject(error);
    }
);

export default adminApi;
