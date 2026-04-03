import { useState } from "react";
import "../../../styles/instructor/Dashboard.css";

const CATEGORIES = ["Web Development", "Data Science", "Design", "AI / ML", "Photography", "Finance", "Other"];

const emptyForm = { title: "", description: "", price: "", category: "Web Development", thumbnail: "", duration: "", lectures: "" };

function CourseForm({ editingCourse, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(
        editingCourse
            ? {
                title: editingCourse.title,
                description: editingCourse.description,
                price: editingCourse.price,
                category: editingCourse.category,
                thumbnail: editingCourse.thumbnail || "",
                duration: editingCourse.duration || "",
                lectures: editingCourse.lectures || "",
            }
            : emptyForm
    );
    const [formError, setFormError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        const res = await onSubmit(formData);
        if (!res.success) {
            setFormError(res.message);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="section-header">
                <h2>{editingCourse ? "Edit Course" : "Publish New Course"}</h2>
                <button className="btn-outline" onClick={onCancel}>Cancel</button>
            </div>

            <form className="course-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Course Title</label>
                    <input type="text" name="title" placeholder="e.g. Master Python in 30 Days" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Price ($)</label>
                        <input type="number" name="price" placeholder="49.99" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Duration (e.g. 4.5 hours)</label>
                        <input type="text" name="duration" placeholder="4.5 hours" value={formData.duration} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Number of Lectures</label>
                        <input type="number" name="lectures" placeholder="12" value={formData.lectures} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input type="text" name="thumbnail" placeholder="https://..." value={formData.thumbnail} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="5" name="description" placeholder="What will students learn?" value={formData.description} onChange={handleChange} required></textarea>
                </div>

                {formError && <p style={{ color: "red", marginBottom: "10px" }}>{formError}</p>}

                <button type="submit" className="btn-primary">
                    {editingCourse ? "Save Changes" : "Publish Course"}
                </button>
            </form>
        </div>
    );
}

export default CourseForm;
