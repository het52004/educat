import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaArrowLeft, FaCheck } from "react-icons/fa";
import useInstructorQuizStore from "../../../store/instructor/useInstructorQuizStore";

const emptyQuestion = () => ({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
});

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
                    options: q.options.length === 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill("")],
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
            opts[oIdx] = value;
            updated[qIdx] = { ...updated[qIdx], options: opts };
            return updated;
        });
    };

    const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
    const removeQuestion = (idx) => setQuestions((prev) => prev.filter((_, i) => i !== idx));

    const handleSave = async () => {
        if (!title.trim()) { setMsg({ text: "Please enter a quiz title!", type: "error" }); return; }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) { setMsg({ text: `Question ${i + 1}: Please enter question text.`, type: "error" }); return; }
            if (q.options.some((o) => !o.trim())) { setMsg({ text: `Question ${i + 1}: All 4 options are required.`, type: "error" }); return; }
            if (!q.correctAnswer) { setMsg({ text: `Question ${i + 1}: Please select the correct answer.`, type: "error" }); return; }
            if (!q.options.includes(q.correctAnswer)) { setMsg({ text: `Question ${i + 1}: Correct answer must match one of the options.`, type: "error" }); return; }
        }

        setSaving(true);
        const res = await createQuiz(course._id, { title, questions, marks: 100 });
        setSaving(false);
        if (res.success) {
            setMsg({ text: "Quiz saved successfully!", type: "success" });
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
        <div style={{ fontFamily: "Poppins, sans-serif", maxWidth: "820px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                    <FaArrowLeft /> Back
                </button>
                <div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#1e293b" }}>Quiz Builder</h2>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{course.title}</p>
                </div>
                {quiz && (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        style={{ marginLeft: "auto", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                        <FaTrash /> Delete Quiz
                    </button>
                )}
            </div>

            {confirmDelete && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>Are you sure? This will delete the quiz and all student results.</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setConfirmDelete(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                        <button onClick={handleDelete} style={{ background: "#ef4444", border: "none", borderRadius: "6px", padding: "6px 14px", color: "white", cursor: "pointer", fontSize: "13px" }}>Yes, Delete</button>
                    </div>
                </div>
            )}

            {/* Quiz title */}
            <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Quiz Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Final Assessment"
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                />
            </div>

            {/* Questions */}
            {questions.map((q, qIdx) => (
                <div key={qIdx} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <span style={{ fontWeight: "600", color: "#4f46e5", fontSize: "14px" }}>Question {qIdx + 1}</span>
                        {questions.length > 1 && (
                            <button onClick={() => removeQuestion(qIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <FaTrash /> Remove
                            </button>
                        )}
                    </div>

                    <input
                        value={q.questionText}
                        onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                        placeholder="Enter your question..."
                        style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", marginBottom: "14px", fontFamily: "inherit" }}
                    />

                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" }}>OPTIONS (click ✓ to mark correct answer)</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {q.options.map((opt, oIdx) => (
                            <div key={oIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <input
                                    value={opt}
                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                    placeholder={`Option ${oIdx + 1}`}
                                    style={{
                                        flex: 1, border: `1px solid ${q.correctAnswer === opt && opt ? "#10b981" : "#e2e8f0"}`,
                                        borderRadius: "8px", padding: "8px 12px", fontSize: "13px",
                                        background: q.correctAnswer === opt && opt ? "rgba(16,185,129,0.06)" : "white",
                                        fontFamily: "inherit",
                                    }}
                                />
                                <button
                                    onClick={() => opt && updateQuestion(qIdx, "correctAnswer", opt)}
                                    title="Mark as correct"
                                    style={{
                                        width: "30px", height: "30px", borderRadius: "50%", border: "1px solid",
                                        borderColor: q.correctAnswer === opt && opt ? "#10b981" : "#e2e8f0",
                                        background: q.correctAnswer === opt && opt ? "#10b981" : "white",
                                        color: q.correctAnswer === opt && opt ? "white" : "#94a3b8",
                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px",
                                        flexShrink: 0,
                                    }}
                                ><FaCheck /></button>
                            </div>
                        ))}
                    </div>
                    {q.correctAnswer && (
                        <p style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>✓ Correct: {q.correctAnswer}</p>
                    )}
                </div>
            ))}

            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <button
                    onClick={addQuestion}
                    style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "2px dashed #4f46e5", color: "#4f46e5", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                >
                    <FaPlus /> Add Question
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: "10px", padding: "10px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: saving ? 0.7 : 1, fontFamily: "inherit" }}
                >
                    {saving ? "Saving..." : quiz ? "Update Quiz" : "Save Quiz"}
                </button>
                {msg.text && (
                    <span style={{ fontSize: "13px", color: msg.type === "error" ? "#ef4444" : "#10b981", fontWeight: "500" }}>
                        {msg.type === "success" ? "✓ " : "✗ "}{msg.text}
                    </span>
                )}
            </div>
        </div>
    );
}
