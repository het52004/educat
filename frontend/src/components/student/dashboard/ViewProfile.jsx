import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/student/Dashboard.css";
import "../../../styles/student/ViewProfile.css";
import { useAuthStore } from "../../../store/student/useAuthStore";

function ViewProfile() {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const deleteAccount = useAuthStore((state) => state.deleteAccount);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        contactNumber: user?.contactNumber || "",
        currentPassword: "",
        newPassword: "",
    });
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [saving, setSaving] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg({ text: "", type: "" });
        const res = await updateProfile(form);
        setSaving(false);
        setMsg({ text: res.message, type: res.success ? "success" : "error" });
        if (res.success) {
            setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
        }
    };

    const handleDelete = async () => {
        if (!deletePassword) {
            setMsg({ text: "Enter your password to confirm deletion", type: "error" });
            return;
        }
        setDeleting(true);
        const res = await deleteAccount(deletePassword);
        setDeleting(false);
        if (res.success) {
            navigate("/studentlogin");
        } else {
            setMsg({ text: res.message, type: "error" });
        }
    };

    return (
        <div className="profile-page">
            <h2 className="section-title" style={{ marginTop: 0 }}>My Profile</h2>

            <div className="profile-card">
                <div className="profile-avatar-big">{user?.fullName?.[0]}</div>
                <div className="profile-meta">
                    <h3>{user?.fullName}</h3>
                    <p>{user?.email}</p>
                </div>
            </div>

            <div className="profile-form-card">
                <h4 className="profile-section-label">Personal Information</h4>

                <div className="profile-field">
                    <label>Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" />
                </div>
                <div className="profile-field">
                    <label>Email</label>
                    <input value={user?.email || ""} disabled className="profile-disabled" />
                </div>
                <div className="profile-field">
                    <label>Contact Number</label>
                    <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact number" />
                </div>

                <h4 className="profile-section-label" style={{ marginTop: "24px" }}>Change Password</h4>
                <div className="profile-field">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="Enter current password" />
                </div>
                <div className="profile-field">
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Enter new password" />
                </div>

                {msg.text && (
                    <div className={`profile-msg ${msg.type}`}>{msg.text}</div>
                )}

                <button className="btn-primary" style={{ marginTop: "20px" }} onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="profile-danger-card">
                <h4 className="profile-section-label danger-label">Danger Zone</h4>
                <p className="danger-text">Deleting your account is permanent and cannot be undone.</p>

                {!showDelete ? (
                    <button className="btn-danger" onClick={() => setShowDelete(true)}>Delete Account</button>
                ) : (
                    <div className="delete-confirm">
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                        />
                        <div className="delete-actions">
                            <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button className="btn-cancel" onClick={() => { setShowDelete(false); setDeletePassword(""); }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewProfile;
