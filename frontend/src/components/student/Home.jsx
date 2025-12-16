import "../../styles/student/Dashboard.css";

const enrolledCourses = [
  {
    id: 1,
    title: "UI/UX Design Masterclass",
    progress: 75,
    category: "Design",
    image: "https://placehold.co/300x180/5C6BC0/white?text=UI+UX",
  },
  {
    id: 2,
    title: "Full Stack Web Dev",
    progress: 45,
    category: "Development",
    image: "https://placehold.co/300x180/26A69A/white?text=Web+Dev",
  },
  {
    id: 3,
    title: "Digital Marketing 101",
    progress: 10,
    category: "Marketing",
    image: "https://placehold.co/300x180/EF5350/white?text=Marketing",
  },
];

function Home() {
  return (
    <>
      <div className="welcome-banner">
        <div className="banner-text">
          <h1>Hello, Alex! 👋</h1>
          <p>You've learned 80% of your weekly goal. Keep it up!</p>
        </div>
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3428186-2902695.png"
          alt="Study"
          className="banner-img"
        />
      </div>

      <h2 className="section-title">Continue Learning</h2>
      <div className="card-grid">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="course-card">
            <div
              className="card-image"
              style={{ backgroundImage: `url(${course.image})` }}
            >
              <span className="badge">{course.category}</span>
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
              <button className="btn-primary">Resume</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
