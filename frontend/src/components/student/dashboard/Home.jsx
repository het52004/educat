import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import { useAuthStore } from "../../../store/student/useAuthStore";
import { useCourseStore } from "../../../store/student/useCourseStore";

function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { courses, loading, fetchPublishedCourses } = useCourseStore();

  useEffect(() => {
    fetchPublishedCourses();
  }, []);

  const enrolledCourses = courses.filter((c) =>
    user?.enrolledCourses?.map(String).includes(String(c._id))
  );

  return (
    <>
      <div className="welcome-banner">
        <div className="banner-text">
          <h1>Hello, {user?.fullName?.split(" ")[0] || "Student"}! 👋</h1>
          <p>Welcome back! Ready to continue learning today?</p>
        </div>
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3428186-2902695.png"
          alt="Study"
          className="banner-img"
        />
      </div>

      <h2 className="section-title">Continue Learning</h2>

      {loading ? (
        <p style={{ color: "var(--text-gray)", marginTop: "10px" }}>Loading your courses...</p>
      ) : enrolledCourses.length === 0 ? (
        <p style={{ color: "var(--text-gray)", marginTop: "10px" }}>
          You haven't enrolled in any courses yet. Browse courses to get started!
        </p>
      ) : (
        <div className="card-grid">
          {enrolledCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div
                className="card-image"
                style={{
                  backgroundImage: course.thumbnail
                    ? `url(${course.thumbnail})`
                    : `url(https://placehold.co/600x400/4f46e5/white?text=${encodeURIComponent(course.title)})`,
                }}
              >
                <span className="badge">Enrolled</span>
              </div>
              <div className="card-details">
                <h3>{course.title}</h3>
                <p className="course-instructor">by {course.addedBy?.name || "Instructor"}</p>
                <button
                  className="btn-primary"
                  style={{ marginTop: "12px" }}
                  onClick={() => navigate(`/learn/${course._id}`)}
                >
                  Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
