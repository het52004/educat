import "../../styles/student/Dashboard.css";

const newCourses = [
  {
    id: 4,
    title: "3D Modeling with Blender",
    price: "$24.99",
    rating: 4.8,
    image: "https://placehold.co/300x180/FFA726/white?text=3D+Art",
  },
  {
    id: 5,
    title: "Python for Finance",
    price: "$18.99",
    rating: 4.7,
    image: "https://placehold.co/300x180/42A5F5/white?text=Finance",
  },
  {
    id: 6,
    title: "Photography Essentials",
    price: "$12.99",
    rating: 4.9,
    image: "https://placehold.co/300x180/AB47BC/white?text=Photo",
  },
];

function BrowseNewCourses() {
  return (
    <>
      <h2 className="section-title">Browse New Courses</h2>
      <div className="card-grid">
        {newCourses.map((course) => (
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
                <button className="btn-outline">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BrowseNewCourses;
