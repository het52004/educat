import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/student/courseDetails.css";
import { courses } from "../../../seed/student/courses";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === parseInt(id));

  if (!course) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
        <h2>Course not found!</h2>
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
          style={{ marginTop: "20px" }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="course-header">
        <div className="header-content">
          <h1 style={{ color: "white" }}>{course.title}</h1>
          <p className="subtitle">{course.description}</p>
          <div className="meta-info">
            <span className="rating">★ {course.rating}</span>
            <span>Created by {course.instructor.name}</span>
          </div>
        </div>
      </div>

      <div className="details-layout">
        <div className="left-column">
          <div className="learning-section">
            <h3>What you'll learn</h3>
            <ul className="learn-list">
              <li>✓ Master the basics of {course.title}</li>
              <li>✓ Build real-world projects</li>
              <li>✓ Understand core concepts deeply</li>
            </ul>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>
              {course.description} This course is designed for beginners and
              intermediates who want to master this skill. We start from the
              very basics.
            </p>
          </div>
        </div>

        <div className="right-column">
          <div className="buy-card">
            <img
              src={course.image}
              alt={course.title}
              className="buy-card-img"
            />
            <div className="buy-card-body">
              <h2 className="price-tag">{course.price}</h2>
              <button className="btn-primary">Add to Cart</button>
              <button className="btn-outline">Buy Now</button>
              <p className="guarantee">30-Day Money-Back Guarantee</p>

              <div className="course-includes">
                <p>This course includes:</p>
                <ul>
                  <li>📺 {course.duration} on-demand video</li>
                  <li>📄 {course.lectures} downloadable resources</li>
                  <li>📱 Access on mobile and TV</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
