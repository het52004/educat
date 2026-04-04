import axios from "axios";

const studentApi = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

studentApi.interceptors.response.use(
    (response) => {
        if (response.data?.tokenExpired) {
            import("../store/student/useAuthStore").then(({ useAuthStore }) => {
                useAuthStore.getState().forceLogout();
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            import("../store/student/useAuthStore").then(({ useAuthStore }) => {
                useAuthStore.getState().forceLogout();
            });
        }
        return Promise.reject(error);
    }
);

export default studentApi;
