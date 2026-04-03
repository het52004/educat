import { useState, useEffect, useRef } from "react";
import { FaTrash, FaArrowLeft, FaCloudUploadAlt, FaPlay } from "react-icons/fa";
import useLectureStore from "../../../store/instructor/useLectureStore";
import "../../../styles/instructor/ManageLectures.css";

function ManageLectures({ course, onBack }) {
    const { lectures, loading, uploading, uploadProgress, fetchLectures, uploadLecture, deleteLecture } = useLectureStore();

    const [form, setForm] = useState({ title: "", description: "" });
    const [videoFile, setVideoFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchLectures(course._id);
    }, [course._id]);

    const handleFileSelect = (file) => {
        if (!file) return;
        const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
        if (!allowed.includes(file.type)) {
            setMsg({ text: "Only video files (mp4, webm, ogg, mov) are allowed!", type: "error" });
            return;
        }
        setVideoFile(file);
        setMsg({ text: "", type: "" });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            setMsg({ text: "Please select a video file!", type: "error" });
            return;
        }
        if (!form.title.trim()) {
            setMsg({ text: "Please enter a lecture title!", type: "error" });
            return;
        }

        const data = new FormData();
        data.append("video", videoFile);
        data.append("courseId", course._id);
        data.append("title", form.title);
        data.append("description", form.description);
        data.append("order", lectures.length);

        setMsg({ text: "", type: "" });
        const res = await uploadLecture(course._id, data);

        if (res.success) {
            setForm({ title: "", description: "" });
            setVideoFile(null);
            setMsg({ text: "Lecture uploaded successfully!", type: "success" });
        } else {
            setMsg({ text: res.message || "Upload failed!", type: "error" });
        }
    };

    const handleDelete = async (lectureId) => {
        if (!window.confirm("Delete this lecture? This cannot be undone.")) return;
        const res = await deleteLecture(lectureId);
        if (!res.success) setMsg({ text: res.message, type: "error" });
    };

    return (
        <div className="manage-lectures">
            <div className="ml-header">
                <button className="ml-back-btn" onClick={onBack}>
                    <FaArrowLeft /> Back to Courses
                </button>
                <div>
                    <h2>{course.title}</h2>
                    <span className="ml-count">{lectures.length} lecture{lectures.length !== 1 ? "s" : ""}</span>
                </div>
            </div>

            <div className="ml-layout">
                <div className="ml-upload-panel">
                    <h3 className="ml-section-title">Add New Lecture</h3>

                    <form className="ml-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Lecture Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Introduction to Variables"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description (optional)</label>
                            <textarea
                                rows="3"
                                placeholder="What will students learn in this lecture?"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div
                            className={`ml-dropzone ${dragOver ? "drag-over" : ""} ${videoFile ? "has-file" : ""}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                style={{ display: "none" }}
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                            />
                            {videoFile ? (
                                <div className="ml-file-selected">
                                    <FaPlay className="ml-file-icon" />
                                    <span className="ml-file-name">{videoFile.name}</span>
                                    <span className="ml-file-size">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                                    <button
                                        type="button"
                                        className="ml-remove-file"
                                        onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="ml-dropzone-inner">
                                    <FaCloudUploadAlt className="ml-upload-icon" />
                                    <p>Drag & drop your video here</p>
                                    <span>or click to browse</span>
                                    <small>MP4, WebM, OGG, MOV · Max 500MB</small>
                                </div>
                            )}
                        </div>

                        {uploading && (
                            <div className="ml-progress-wrap">
                                <div className="ml-progress-bar">
                                    <div className="ml-progress-fill" style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <span className="ml-progress-text">Uploading... {uploadProgress}%</span>
                            </div>
                        )}

                        {msg.text && (
                            <div className={`ml-msg ${msg.type}`}>{msg.text}</div>
                        )}

                        <button type="submit" className="btn-primary" disabled={uploading}>
                            {uploading ? `Uploading ${uploadProgress}%...` : "Upload Lecture"}
                        </button>
                    </form>
                </div>

                <div className="ml-list-panel">
                    <h3 className="ml-section-title">Lectures</h3>

                    {loading ? (
                        <p className="ml-empty">Loading lectures...</p>
                    ) : lectures.length === 0 ? (
                        <p className="ml-empty">No lectures yet. Upload your first one!</p>
                    ) : (
                        <div className="ml-lecture-list">
                            {lectures.map((lec, index) => (
                                <div key={lec._id} className="ml-lecture-item">
                                    <div className="ml-lecture-num">{index + 1}</div>
                                    <div className="ml-lecture-info">
                                        <h4>{lec.title}</h4>
                                        {lec.description && <p>{lec.description}</p>}
                                        <span className="ml-lecture-date">
                                            {new Date(lec.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="ml-delete-btn"
                                        onClick={() => handleDelete(lec._id)}
                                        title="Delete lecture"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageLectures;
