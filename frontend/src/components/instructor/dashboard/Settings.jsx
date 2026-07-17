import { useState } from "react";
import "../../../styles/instructor/Dashboard.css";
import { useInstructorAuthStore } from "../../../store/instructor/useInstructorAuthStore";

function Settings({ instructor }) {
    const updateProfile = useInstructorAuthStore((state) => state.updateProfile);

    const [formData, setFormData] = useState({
        name: instructor?.name || "",
        bio: instructor?.bio || "",
        expertise: instructor?.expertise?.join(", ") || "",
        currentPassword: "",
        newPassword: "",
    });
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");
        setSaving(true);
        const res = await updateProfile(formData);
        setSaving(false);
        if (!res.success) {
            setFormError(res.message);
            return;
        }
        setFormSuccess(res.message);
        setFormData((f) => ({ ...f, currentPassword: "", newPassword: "" }));
    };

    return (
        <div className="form-wrapper">
            <h2>Instructor Profile</h2>
            <form className="course-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Display Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea rows="3" name="bio" value={formData.bio} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={instructor?.email || ""} disabled />
                </div>
                {/* <div className="form-group">
                    <label>Expertise</label>
                    <input type="text" name="expertise" placeholder="e.g. Web Development, Design" value={formData.expertise} onChange={handleChange} />
                </div> */}

                <div className="form-row">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" name="currentPassword" placeholder="Only needed to change password" value={formData.currentPassword} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" placeholder="Leave blank to keep current password" value={formData.newPassword} onChange={handleChange} />
                    </div>
                </div>

                {formError && <p style={{ color: "red", marginBottom: "10px" }}>{formError}</p>}
                {formSuccess && <p style={{ color: "green", marginBottom: "10px" }}>{formSuccess}</p>}

                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default Settings;
