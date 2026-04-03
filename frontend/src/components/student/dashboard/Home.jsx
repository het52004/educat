import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import { useAuthStore } from "../../../store/student/useAuthStore";
import { courseData } from "../../../seed/student/courseData";

function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const enrolledCourses = courseData.filter((course) =>
    user?.enrolledCourses?.includes(course.id)
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

      {enrolledCourses.length === 0 ? (
        <p style={{ color: "var(--text-gray)", marginTop: "10px" }}>
          You haven't enrolled in any courses yet. Browse courses to get started!
        </p>
      ) : (
        <div className="card-grid">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div
                className="card-image"
                style={{ backgroundImage: `url(${course.image})` }}
              >
                <span className="badge">Enrolled</span>
              </div>
              <div className="card-details">
                <h3>{course.title}</h3>
                <div className="progress-wrapper">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{course.progress}%</span>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/learn/${course.id}`)}
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
