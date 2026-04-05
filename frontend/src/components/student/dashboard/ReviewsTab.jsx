import { useState, useEffect } from "react";
import useFeedbackStore from "../../../store/student/useFeedbackStore";
import { useAuthStore } from "../../../store/student/useAuthStore";

function StarRating({ value, onChange, readOnly = false, size = 22 }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    style={{
                        fontSize: `${size}px`,
                        cursor: readOnly ? "default" : "pointer",
                        color: (hover || value) >= star ? "#f59e0b" : "#4b5563",
                        transition: "color 0.15s",
                        userSelect: "none",
                    }}
                >★</span>
            ))}
        </div>
    );
}

export default function ReviewsTab({ courseId }) {
    const { feedbacks, myFeedback, loading, fetchFeedbacks, fetchMyFeedback, submitFeedback, deleteFeedback } = useFeedbackStore();
    const user = useAuthStore((s) => s.user);
    const [rating, setRating] = useState(5);
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchFeedbacks(courseId);
        fetchMyFeedback(courseId);
    }, [courseId]);

    const handleSubmit = async () => {
        if (!description.trim()) { setMsg({ text: "Please write a review!", type: "error" }); return; }
        setSubmitting(true);
        const res = await submitFeedback(courseId, rating, description.trim());
        setSubmitting(false);
        if (res.success) {
            setDescription("");
            setMsg({ text: "Review submitted!", type: "success" });
        } else {
            setMsg({ text: res.message, type: "error" });
        }
    };

    const handleDelete = async () => {
        if (!myFeedback) return;
        await deleteFeedback(myFeedback._id, courseId);
        setMsg({ text: "Review deleted.", type: "success" });
    };

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        : null;

    return (
        <div style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Summary */}
            {avgRating && (
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px", padding: "20px", background: "var(--cp-bg-card)", borderRadius: "10px", border: "1px solid var(--cp-border)" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "48px", fontWeight: "700", color: "#f59e0b", lineHeight: 1 }}>{avgRating}</div>
                        <StarRating value={Math.round(avgRating)} readOnly size={18} />
                        <div style={{ fontSize: "12px", color: "var(--cp-text-secondary)", marginTop: "4px" }}>{feedbacks.length} review{feedbacks.length !== 1 ? "s" : ""}</div>
                    </div>
                </div>
            )}

            {/* Write a review */}
            {!myFeedback ? (
                <div style={{ background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)", borderRadius: "10px", padding: "20px", marginBottom: "28px" }}>
                    <h3 style={{ color: "var(--cp-text-primary)", marginBottom: "16px", fontSize: "16px" }}>Write a Review</h3>
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ color: "var(--cp-text-secondary)", fontSize: "13px", display: "block", marginBottom: "8px" }}>Your Rating</label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share your experience with this course..."
                        rows={4}
                        style={{ width: "100%", background: "var(--cp-bg-secondary)", border: "1px solid var(--cp-border)", borderRadius: "8px", padding: "12px", color: "var(--cp-text-primary)", fontSize: "14px", resize: "vertical", fontFamily: "inherit", marginBottom: "12px" }}
                    />
                    {msg.text && (
                        <p style={{ color: msg.type === "error" ? "#ef4444" : "#10b981", fontSize: "13px", marginBottom: "10px" }}>{msg.text}</p>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ background: "var(--cp-accent)", color: "white", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            ) : (
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "16px", marginBottom: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <p style={{ color: "#10b981", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>✓ Your Review</p>
                            <StarRating value={myFeedback.rating} readOnly size={16} />
                            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", marginTop: "8px" }}>{myFeedback.description}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}
                        >Delete</button>
                    </div>
                    {msg.text && <p style={{ color: msg.type === "error" ? "#ef4444" : "#10b981", fontSize: "13px", marginTop: "8px" }}>{msg.text}</p>}
                </div>
            )}

            {/* All reviews */}
            <h3 style={{ color: "var(--cp-text-primary)", marginBottom: "16px", fontSize: "16px" }}>
                All Reviews {feedbacks.length > 0 && `(${feedbacks.length})`}
            </h3>
            {loading ? (
                <p style={{ color: "var(--cp-text-secondary)" }}>Loading reviews...</p>
            ) : feedbacks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--cp-border)", borderRadius: "10px", color: "var(--cp-text-secondary)" }}>
                    No reviews yet. Be the first to review this course!
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {feedbacks.map((f) => (
                        <div key={f._id} style={{ background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)", borderRadius: "10px", padding: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--cp-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>
                                        {f.addedBy?.fullName?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p style={{ color: "var(--cp-text-primary)", fontWeight: "600", fontSize: "14px", margin: 0 }}>{f.addedBy?.fullName || "Student"}</p>
                                        <StarRating value={f.rating} readOnly size={13} />
                                    </div>
                                </div>
                                <span style={{ color: "var(--cp-text-secondary)", fontSize: "12px" }}>
                                    {new Date(f.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{f.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
