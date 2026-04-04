import axios from "axios";

const instructorApi = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

instructorApi.interceptors.response.use(
    (response) => {
        if (response.data?.tokenExpired) {
            import("../store/instructor/useInstructorAuthStore").then(({ useInstructorAuthStore }) => {
                useInstructorAuthStore.getState().forceLogout();
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            import("../store/instructor/useInstructorAuthStore").then(({ useInstructorAuthStore }) => {
                useInstructorAuthStore.getState().forceLogout();
            });
        }
        return Promise.reject(error);
    }
);

export default instructorApi;
