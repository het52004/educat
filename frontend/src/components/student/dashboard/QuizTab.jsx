import { useState, useEffect } from "react";
import useQuizStore from "../../../store/student/useQuizStore";
import { downloadCertificate } from "./MyCertificates";

function CertificateCard({ certificate, courseName }) {
    return (
        <div style={{
            background: "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))",
            border: "1px solid rgba(79,70,229,0.25)", borderRadius: "16px",
            padding: "32px 24px", textAlign: "center",
        }}>
            <div style={{ fontSize: "56px", marginBottom: "14px" }}>🎓</div>
            <h3 style={{ color: "var(--cp-text-primary)", fontSize: "20px", marginBottom: "6px", fontWeight: "700" }}>
                Certificate Earned!
            </h3>
            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                {courseName}
            </p>
            <div style={{
                display: "inline-block",
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "24px", padding: "6px 20px",
                color: "#10b981", fontWeight: "700", fontSize: "16px", marginBottom: "24px",
            }}>
                🏆 Score: {certificate?.marks}%
            </div>
            <br />
            <button
                onClick={() => downloadCertificate(certificate)}
                style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    color: "white", border: "none", borderRadius: "10px",
                    padding: "12px 32px", fontWeight: "700", fontSize: "14px",
                    cursor: "pointer", letterSpacing: "0.3px",
                }}
            >⬇ Download Certificate</button>
        </div>
    );
}

export default function QuizTab({ courseId, courseTitle }) {
    const { quiz, quizResult, certificate, loading, fetchQuiz, fetchCertificate, submitQuiz, resetQuiz } = useQuizStore();
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        fetchQuiz(courseId);
        fetchCertificate(courseId);
        return () => resetQuiz();
    }, [courseId]);

    const handleSelect = (qId, option) => {
        setAnswers((prev) => ({ ...prev, [qId]: option }));
    };

    const handleSubmit = async () => {
        const unanswered = quiz.questions.length - Object.keys(answers).length;
        if (unanswered > 0) {
            alert(`Please answer all questions! (${unanswered} remaining)`);
            return;
        }
        setSubmitting(true);
        await submitQuiz(courseId, answers);
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--cp-text-secondary)" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
                <p>Loading quiz...</p>
            </div>
        );
    }

    // Already has certificate
    if (certificate) {
        return <CertificateCard certificate={certificate} courseName={courseTitle} />;
    }

    if (!quiz) {
        return (
            <div style={{
                textAlign: "center", padding: "60px 20px",
                border: "1px dashed var(--cp-border)", borderRadius: "14px",
                color: "var(--cp-text-secondary)",
            }}>
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>📝</div>
                <p style={{ fontSize: "16px", fontWeight: "500", marginBottom: "6px", color: "var(--cp-text-primary)" }}>
                    No quiz yet
                </p>
                <p style={{ fontSize: "13px" }}>The instructor hasn't added a quiz for this course yet.</p>
            </div>
        );
    }

    // Show result
    if (quizResult) {
        const { correct, total, percentage, passed } = quizResult;
        return (
            <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "72px", marginBottom: "20px", lineHeight: 1 }}>
                    {passed ? "🎉" : "😔"}
                </div>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "26px", marginBottom: "10px", fontWeight: "700" }}>
                    {passed ? "You Passed!" : "Better Luck Next Time"}
                </h2>
                <p style={{ color: "var(--cp-text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
                    {passed
                        ? "Congratulations! Your certificate has been generated."
                        : "You need 60% to pass. Review the material and try again!"}
                </p>

                {/* Score cards */}
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
                    {[
                        { label: "Score", value: `${percentage}%`, color: passed ? "#10b981" : "#ef4444", bg: passed ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" },
                        { label: "Correct", value: `${correct}/${total}`, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                        { label: "Status", value: passed ? "PASSED" : "FAILED", color: passed ? "#10b981" : "#ef4444", bg: passed ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" },
                    ].map((s) => (
                        <div key={s.label} style={{
                            background: s.bg, border: `1px solid ${s.color}30`,
                            borderRadius: "12px", padding: "18px 28px", textAlign: "center", minWidth: "120px",
                        }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "12px", color: "var(--cp-text-secondary)", marginTop: "4px", fontWeight: "500" }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {passed && quizResult.certificate && (
                    <div style={{ marginBottom: "24px" }}>
                        <CertificateCard certificate={quizResult.certificate} courseName={courseTitle} />
                    </div>
                )}

                {!passed && (
                    <button
                        onClick={() => { resetQuiz(); setAnswers({}); setStarted(false); fetchQuiz(courseId); }}
                        style={{
                            background: "var(--cp-accent)", color: "white", border: "none",
                            borderRadius: "10px", padding: "12px 32px", fontWeight: "600",
                            fontSize: "14px", cursor: "pointer",
                        }}
                    >Try Again</button>
                )}
            </div>
        );
    }

    // Intro screen
    if (!started) {
        return (
            <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "56px", marginBottom: "18px" }}>📝</div>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "22px", marginBottom: "10px", fontWeight: "700" }}>
                    {quiz.title}
                </h2>
                <p style={{ color: "var(--cp-text-secondary)", marginBottom: "28px", fontSize: "14px" }}>
                    {quiz.questions.length} questions &nbsp;·&nbsp; Pass with 60% &nbsp;·&nbsp; Earn a certificate
                </p>

                <div style={{
                    background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)",
                    borderRadius: "12px", padding: "18px 20px", marginBottom: "28px", textAlign: "left",
                }}>
                    <p style={{ color: "var(--cp-text-secondary)", fontSize: "13px", lineHeight: "1.6" }}>
                        💡 <strong style={{ color: "var(--cp-text-primary)" }}>Tips:</strong> You can retake the quiz if you fail.
                        Once you pass, your certificate will be generated automatically and available for download.
                    </p>
                </div>

                <button
                    onClick={() => setStarted(true)}
                    style={{
                        background: "var(--cp-accent)", color: "white", border: "none",
                        borderRadius: "10px", padding: "13px 40px", fontSize: "15px",
                        fontWeight: "700", cursor: "pointer", letterSpacing: "0.3px",
                    }}
                >Start Quiz →</button>
            </div>
        );
    }

    // Quiz questions
    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / quiz.questions.length) * 100);

    return (
        <div style={{ maxWidth: "700px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "18px", fontWeight: "700", margin: 0 }}>{quiz.title}</h2>
                <span style={{ color: "var(--cp-text-secondary)", fontSize: "13px" }}>{answeredCount}/{quiz.questions.length} answered</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: "4px", background: "var(--cp-border)", borderRadius: "2px", marginBottom: "24px", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "var(--cp-accent)", borderRadius: "2px", transition: "width 0.3s ease" }} />
            </div>

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
                {quiz.questions.map((q, idx) => (
                    <div key={q._id} style={{
                        background: "var(--cp-bg-card)", border: `1px solid ${answers[q._id] ? "rgba(59,130,246,0.3)" : "var(--cp-border)"}`,
                        borderRadius: "12px", padding: "20px", transition: "border-color 0.2s",
                    }}>
                        <p style={{ color: "var(--cp-text-primary)", fontWeight: "600", marginBottom: "16px", fontSize: "15px", lineHeight: "1.5" }}>
                            <span style={{ color: "var(--cp-accent)", marginRight: "8px" }}>{idx + 1}.</span>
                            {q.questionText}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {q.options.map((opt) => {
                                const selected = answers[q._id] === opt;
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(q._id, opt)}
                                        style={{
                                            textAlign: "left", padding: "11px 16px", borderRadius: "8px",
                                            border: selected ? "2px solid var(--cp-accent)" : "1px solid var(--cp-border)",
                                            background: selected ? "rgba(59,130,246,0.1)" : "var(--cp-bg-secondary)",
                                            color: selected ? "var(--cp-accent)" : "var(--cp-text-secondary)",
                                            cursor: "pointer", fontSize: "14px",
                                            fontWeight: selected ? "600" : "400",
                                            transition: "all 0.15s", fontFamily: "inherit",
                                            display: "flex", alignItems: "center", gap: "10px",
                                        }}
                                    >
                                        <span style={{
                                            width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                                            border: selected ? "2px solid var(--cp-accent)" : "2px solid var(--cp-border)",
                                            background: selected ? "var(--cp-accent)" : "transparent",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            {selected && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />}
                                        </span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                    background: answeredCount < quiz.questions.length ? "rgba(59,130,246,0.5)" : "var(--cp-accent)",
                    color: "white", border: "none", borderRadius: "10px",
                    padding: "13px 36px", fontSize: "15px", fontWeight: "700",
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "all 0.2s", letterSpacing: "0.3px",
                }}
            >
                {submitting ? "Submitting..." : `Submit Quiz (${answeredCount}/${quiz.questions.length})`}
            </button>
        </div>
    );
}
