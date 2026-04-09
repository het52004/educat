import { useState, useEffect } from "react";
import useFeedbackStore from "../../../store/student/useFeedbackStore";

function StarRating({ value, onChange, readOnly = false, size = 24 }) {
    const [hover, setHover] = useState(0);
    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readOnly && onChange && onChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    style={{
                        fontSize: `${size}px`,
                        cursor: readOnly ? "default" : "pointer",
                        color: (hover || value) >= star ? "#f59e0b" : "rgba(255,255,255,0.15)",
                        transition: "color 0.15s, transform 0.1s",
                        transform: !readOnly && hover === star ? "scale(1.2)" : "scale(1)",
                        display: "inline-block",
                        userSelect: "none",
                        lineHeight: 1,
                    }}
                >★</span>
            ))}
        </div>
    );
}

function RatingBar({ stars, count, total }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "var(--cp-text-secondary)", width: "10px" }}>{stars}</span>
            <span style={{ fontSize: "12px", color: "#f59e0b" }}>★</span>
            <div style={{ flex: 1, height: "6px", background: "var(--cp-bg-card)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: "3px", transition: "width 0.6s ease" }} />
            </div>
            <span style={{ fontSize: "12px", color: "var(--cp-text-secondary)", width: "24px", textAlign: "right" }}>{count}</span>
        </div>
    );
}

export default function ReviewsTab({ courseId }) {
    const { feedbacks, myFeedback, loading, fetchFeedbacks, fetchMyFeedback, submitFeedback, deleteFeedback } = useFeedbackStore();
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
        setMsg({ text: "", type: "" });
        const res = await submitFeedback(courseId, rating, description.trim());
        setSubmitting(false);
        if (res.success) {
            setDescription("");
            setMsg({ text: "Review submitted successfully!", type: "success" });
        } else {
            setMsg({ text: res.message, type: "error" });
        }
    };

    const handleDelete = async () => {
        if (!myFeedback) return;
        const res = await deleteFeedback(myFeedback._id, courseId);
        if (res.success) setMsg({ text: "Review deleted.", type: "success" });
    };

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        : null;

    const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
        stars: s,
        count: feedbacks.filter((f) => f.rating === s).length,
    }));

    return (
        <div style={{ fontFamily: "Inter, sans-serif", maxWidth: "860px" }}>

            {/* Rating Summary */}
            {feedbacks.length > 0 && (
                <div style={{
                    display: "flex", gap: "32px", alignItems: "center",
                    background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)",
                    borderRadius: "14px", padding: "24px", marginBottom: "24px",
                    flexWrap: "wrap",
                }}>
                    <div style={{ textAlign: "center", minWidth: "100px" }}>
                        <div style={{ fontSize: "56px", fontWeight: "800", color: "#f59e0b", lineHeight: 1 }}>{avgRating}</div>
                        <div style={{ marginTop: "6px" }}><StarRating value={Math.round(avgRating)} readOnly size={16} /></div>
                        <div style={{ fontSize: "12px", color: "var(--cp-text-secondary)", marginTop: "6px" }}>
                            {feedbacks.length} review{feedbacks.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        {ratingCounts.map((r) => (
                            <RatingBar key={r.stars} stars={r.stars} count={r.count} total={feedbacks.length} />
                        ))}
                    </div>
                </div>
            )}

            {/* Write / View My Review */}
            {!myFeedback ? (
                <div style={{
                    background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)",
                    borderRadius: "14px", padding: "24px", marginBottom: "28px",
                }}>
                    <h3 style={{ color: "var(--cp-text-primary)", marginBottom: "18px", fontSize: "16px", fontWeight: "600" }}>
                        ✍️ Write a Review
                    </h3>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ color: "var(--cp-text-secondary)", fontSize: "13px", display: "block", marginBottom: "10px", fontWeight: "500" }}>
                            Your Rating
                        </label>
                        <StarRating value={rating} onChange={setRating} size={32} />
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share what you liked, what could be better, and who you'd recommend this course to..."
                        rows={4}
                        style={{
                            width: "100%", background: "var(--cp-bg-secondary)",
                            border: "1px solid var(--cp-border)", borderRadius: "10px",
                            padding: "14px", color: "var(--cp-text-primary)", fontSize: "14px",
                            resize: "vertical", fontFamily: "inherit", marginBottom: "14px",
                            lineHeight: "1.6", outline: "none",
                        }}
                    />
                    {msg.text && (
                        <p style={{
                            color: msg.type === "error" ? "#ef4444" : "#10b981",
                            fontSize: "13px", marginBottom: "12px", fontWeight: "500",
                        }}>{msg.type === "success" ? "✓ " : "✗ "}{msg.text}</p>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{
                            background: submitting ? "rgba(59,130,246,0.5)" : "var(--cp-accent)",
                            color: "white", border: "none", borderRadius: "8px",
                            padding: "10px 28px", fontSize: "14px", fontWeight: "600",
                            cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.2s",
                        }}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            ) : (
                <div style={{
                    background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: "14px", padding: "20px", marginBottom: "28px",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: "#10b981", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
                                ✓ Your Review
                            </p>
                            <StarRating value={myFeedback.rating} readOnly size={16} />
                            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", marginTop: "10px", lineHeight: "1.6" }}>
                                {myFeedback.description}
                            </p>
                        </div>
                        <button
                            onClick={handleDelete}
                            style={{
                                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                                color: "#ef4444", borderRadius: "8px", padding: "6px 14px",
                                fontSize: "12px", cursor: "pointer", fontWeight: "500", whiteSpace: "nowrap",
                            }}
                        >Delete</button>
                    </div>
                    {msg.text && (
                        <p style={{ color: msg.type === "error" ? "#ef4444" : "#10b981", fontSize: "13px", marginTop: "10px", fontWeight: "500" }}>
                            {msg.text}
                        </p>
                    )}
                </div>
            )}

            {/* All Reviews */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ color: "var(--cp-text-primary)", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                    All Reviews {feedbacks.length > 0 && <span style={{ color: "var(--cp-text-secondary)", fontWeight: "400", fontSize: "14px" }}>({feedbacks.length})</span>}
                </h3>
            </div>

            {loading ? (
                <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px" }}>Loading reviews...</p>
            ) : feedbacks.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "50px 20px",
                    border: "1px dashed var(--cp-border)", borderRadius: "14px",
                    color: "var(--cp-text-secondary)",
                }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>💬</div>
                    <p style={{ fontSize: "15px", fontWeight: "500" }}>No reviews yet</p>
                    <p style={{ fontSize: "13px", marginTop: "6px" }}>Be the first to share your experience!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {feedbacks.map((f) => (
                        <div key={f._id} style={{
                            background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)",
                            borderRadius: "12px", padding: "18px",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{
                                        width: "40px", height: "40px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--cp-accent), #7c3aed)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontWeight: "700", fontSize: "15px", flexShrink: 0,
                                    }}>
                                        {f.addedBy?.fullName?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p style={{ color: "var(--cp-text-primary)", fontWeight: "600", fontSize: "14px", margin: "0 0 4px" }}>
                                            {f.addedBy?.fullName || "Student"}
                                        </p>
                                        <StarRating value={f.rating} readOnly size={14} />
                                    </div>
                                </div>
                                <span style={{ color: "var(--cp-text-secondary)", fontSize: "12px", flexShrink: 0 }}>
                                    {new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            </div>
                            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", lineHeight: "1.65", margin: 0 }}>
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
