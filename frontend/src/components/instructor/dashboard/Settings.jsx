import "../../../styles/instructor/Dashboard.css";

function Settings({ instructor }) {
    return (
        <div className="form-wrapper">
            <h2>Instructor Profile</h2>
            <form className="course-form">
                <div className="form-group">
                    <label>Display Name</label>
                    <input type="text" defaultValue={instructor?.name || ""} disabled />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea rows="3" defaultValue={instructor?.bio || ""} disabled></textarea>
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue={instructor?.email || ""} disabled />
                </div>
                <div className="form-group">
                    <label>Expertise</label>
                    <input type="text" defaultValue={instructor?.expertise?.join(", ") || ""} disabled />
                </div>
            </form>
        </div>
    );
}

export default Settings;
