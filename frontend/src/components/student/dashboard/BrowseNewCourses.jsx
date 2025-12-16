import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import { courses } from "../../../seed/student/courses";

function BrowseNewCourses() {
  const navigate = useNavigate(); 

  return (
    <>
      <h2 className="section-title">Browse New Courses</h2>
      <div className="card-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div
              className="card-image"
              style={{ backgroundImage: `url(${course.image})` }}
            >
              <span className="rating-badge">★ {course.rating}</span>
            </div>
            <div className="card-details">
              <h3>{course.title}</h3>
              <div className="price-row">
                <span className="price">{course.price}</span>
                
                <button 
                  className="btn-outline"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  View Details
                </button>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BrowseNewCourses;