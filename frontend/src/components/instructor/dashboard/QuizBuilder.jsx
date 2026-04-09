import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaArrowLeft, FaCheck, FaClipboardList } from "react-icons/fa";
import useInstructorQuizStore from "../../../store/instructor/useInstructorQuizStore";

const emptyQuestion = () => ({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
});

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizBuilder({ course, onBack }) {
    const { quiz, loading, fetchQuiz, createQuiz, deleteQuiz } = useInstructorQuizStore();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        fetchQuiz(course._id);
    }, [course._id]);

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title);
            setQuestions(
                quiz.questions.map((q) => ({
                    questionText: q.questionText,
                    options: q.options.length >= 4 ? q.options.slice(0, 4) : [...q.options, ...Array(4 - q.options.length).fill("")],
                    correctAnswer: q.correctAnswer,
                }))
            );
        }
    }, [quiz]);

    const updateQuestion = (idx, field, value) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    const updateOption = (qIdx, oIdx, value) => {
        setQuestions((prev) => {
            const updated = [...prev];
            const opts = [...updated[qIdx].options];
            // If this option was the correct answer and we're changing it, clear correctAnswer
            const wasCorrect = opts[oIdx] === updated[qIdx].correctAnswer;
            opts[oIdx] = value;
            updated[qIdx] = {
                ...updated[qIdx],
                options: opts,
                correctAnswer: wasCorrect ? "" : updated[qIdx].correctAnswer,
            };
            return updated;
        });
    };

    const addQuestion = () => {
        setQuestions((prev) => [...prev, emptyQuestion()]);
        // Scroll to bottom after render
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
    };
    const removeQuestion = (idx) => setQuestions((prev) => prev.filter((_, i) => i !== idx));

    const handleSave = async () => {
        setMsg({ text: "", type: "" });
        if (!title.trim()) { setMsg({ text: "Please enter a quiz title!", type: "error" }); return; }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) { setMsg({ text: `Q${i + 1}: Please enter question text.`, type: "error" }); return; }
            if (q.options.some((o) => !o.trim())) { setMsg({ text: `Q${i + 1}: All 4 options are required.`, type: "error" }); return; }
            if (!q.correctAnswer) { setMsg({ text: `Q${i + 1}: Please mark the correct answer.`, type: "error" }); return; }
        }
        setSaving(true);
        const res = await createQuiz(course._id, { title, questions, marks: 100 });
        setSaving(false);
        if (res.success) {
            setMsg({ text: quiz ? "Quiz updated successfully!" : "Quiz created successfully!", type: "success" });
        } else {
            setMsg({ text: res.message || "Failed to save quiz.", type: "error" });
        }
    };

    const handleDelete = async () => {
        const res = await deleteQuiz(course._id);
        if (res.success) {
            setTitle("");
            setQuestions([emptyQuestion()]);
            setMsg({ text: "Quiz deleted.", type: "success" });
            setConfirmDelete(false);
        }
    };

    return (
        <div style={{ fontFamily: "Poppins, sans-serif", maxWidth: "780px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px", flexWrap: "wrap" }}>
                <button
                    onClick={onBack}
                    style={{
                        background: "#f1f5f9", border: "none", color: "#475569",
                        cursor: "pointer", display: "flex", alignItems: "center",
                        gap: "6px", fontSize: "14px", padding: "8px 14px", borderRadius: "8px",
                        fontFamily: "inherit", fontWeight: "500",
                    }}
                >
                    <FaArrowLeft size={12} /> Back
                </button>
                <div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaClipboardList color="#4f46e5" /> Quiz Builder
                    </h2>
                    <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748b" }}>{course.title}</p>
                </div>
                {quiz && (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        style={{
                            marginLeft: "auto", background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626",
                            borderRadius: "8px", padding: "8px 16px", fontSize: "13px",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            gap: "6px", fontFamily: "inherit", fontWeight: "500",
                        }}
                    ><FaTrash size={11} /> Delete Quiz</button>
                )}
            </div>

            {/* Delete confirm */}
            {confirmDelete && (
                <div style={{
                    background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "12px", padding: "16px 20px", marginBottom: "20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    flexWrap: "wrap",
                }}>
                    <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
                        ⚠️ Are you sure? This will delete the quiz and all student results.
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}
                        >Cancel</button>
                        <button
                            onClick={handleDelete}
                            style={{ background: "#dc2626", border: "none", borderRadius: "8px", padding: "7px 16px", color: "white", cursor: "pointer", fontSize: "13px", fontFamily: "inherit", fontWeight: "600" }}
                        >Yes, Delete</button>
                    </div>
                </div>
            )}

            {/* Status message */}
            {msg.text && (
                <div style={{
                    padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
                    background: msg.type === "error" ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                    border: `1px solid ${msg.type === "error" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
                    color: msg.type === "error" ? "#dc2626" : "#059669",
                    fontSize: "14px", fontWeight: "500",
                }}>
                    {msg.type === "success" ? "✓ " : "✗ "}{msg.text}
                </div>
            )}

            {/* Quiz title */}
            <div style={{
                background: "white", border: "1px solid #e2e8f0",
                borderRadius: "14px", padding: "22px", marginBottom: "18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "10px" }}>
                    Quiz Title *
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Final Assessment Quiz"
                    style={{
                        width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px",
                        padding: "10px 14px", fontSize: "14px", outline: "none",
                        fontFamily: "inherit", color: "#1e293b", background: "#f8fafc",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.target.style.borderColor = "#4f46e5"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
            </div>

            {/* Questions */}
            {questions.map((q, qIdx) => (
                <div key={qIdx} style={{
                    background: "white", border: "1px solid #e2e8f0",
                    borderRadius: "14px", padding: "22px", marginBottom: "14px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{
                                background: "#4f46e5", color: "white", borderRadius: "50%",
                                width: "26px", height: "26px", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0,
                            }}>{qIdx + 1}</span>
                            <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>Question {qIdx + 1}</span>
                        </div>
                        {questions.length > 1 && (
                            <button
                                onClick={() => removeQuestion(qIdx)}
                                style={{
                                    background: "rgba(239,68,68,0.08)", border: "none",
                                    color: "#dc2626", cursor: "pointer", fontSize: "12px",
                                    display: "flex", alignItems: "center", gap: "4px",
                                    padding: "5px 10px", borderRadius: "6px", fontFamily: "inherit",
                                }}
                            ><FaTrash size={10} /> Remove</button>
                        )}
                    </div>

                    <textarea
                        value={q.questionText}
                        onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                        placeholder="Enter your question here..."
                        rows={2}
                        style={{
                            width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px",
                            padding: "10px 14px", fontSize: "14px", marginBottom: "16px",
                            fontFamily: "inherit", resize: "vertical", color: "#1e293b",
                            background: "#f8fafc", lineHeight: "1.5",
                        }}
                    />

                    <p style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        Options — click ✓ to mark correct answer
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctAnswer === opt && opt.trim();
                            return (
                                <div key={oIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <span style={{
                                        width: "24px", height: "24px", borderRadius: "50%",
                                        background: "#f1f5f9", color: "#64748b",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "11px", fontWeight: "700", flexShrink: 0,
                                    }}>{OPTION_LABELS[oIdx]}</span>
                                    <input
                                        value={opt}
                                        onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                        placeholder={`Option ${OPTION_LABELS[oIdx]}`}
                                        style={{
                                            flex: 1, border: `1.5px solid ${isCorrect ? "#10b981" : "#e2e8f0"}`,
                                            borderRadius: "8px", padding: "8px 12px", fontSize: "13px",
                                            background: isCorrect ? "rgba(16,185,129,0.06)" : "#f8fafc",
                                            fontFamily: "inherit", color: "#1e293b", outline: "none",
                                            transition: "border-color 0.2s",
                                        }}
                                    />
                                    <button
                                        onClick={() => opt.trim() && updateQuestion(qIdx, "correctAnswer", opt)}
                                        title="Mark as correct answer"
                                        style={{
                                            width: "32px", height: "32px", borderRadius: "50%",
                                            border: `2px solid ${isCorrect ? "#10b981" : "#e2e8f0"}`,
                                            background: isCorrect ? "#10b981" : "white",
                                            color: isCorrect ? "white" : "#94a3b8",
                                            cursor: opt.trim() ? "pointer" : "default",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "11px", flexShrink: 0, transition: "all 0.2s",
                                        }}
                                    ><FaCheck /></button>
                                </div>
                            );
                        })}
                    </div>

                    {q.correctAnswer && (
                        <p style={{ fontSize: "12px", color: "#10b981", marginTop: "10px", fontWeight: "600" }}>
                            ✓ Correct answer: {q.correctAnswer}
                        </p>
                    )}
                </div>
            ))}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
                <button
                    onClick={addQuestion}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: "white", border: "2px dashed #4f46e5",
                        color: "#4f46e5", borderRadius: "10px", padding: "11px 20px",
                        fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#eef2ff"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                    <FaPlus size={12} /> Add Question
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: saving ? "rgba(79,70,229,0.6)" : "#4f46e5",
                        color: "white", border: "none", borderRadius: "10px",
                        padding: "11px 28px", fontSize: "14px", fontWeight: "600",
                        cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit",
                        transition: "background 0.2s",
                    }}
                >
                    {saving ? "Saving..." : quiz ? `Update Quiz (${questions.length} Q)` : `Save Quiz (${questions.length} Q)`}
                </button>
            </div>
        </div>
    );
}
