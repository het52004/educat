import { useState, useEffect } from "react";
import useQuizStore from "../../../store/student/useQuizStore";

function CertificateCard({ certificate, courseName }) {
    const handleDownload = () => {
        const issueDate = new Date(certificate.issueDate).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#f8f9fa; display:flex; justify-content:center; align-items:center; min-height:100vh; }
  .cert { width:900px; min-height:620px; background:white; border:2px solid #e8d5a3; position:relative; padding:60px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.15); }
  .cert::before { content:''; position:absolute; inset:12px; border:1px solid #d4af37; pointer-events:none; }
  .logo { font-size:28px; font-weight:700; color:#4f46e5; letter-spacing:2px; margin-bottom:8px; }
  .logo span { color:#f59e0b; }
  .divider { width:80px; height:3px; background:linear-gradient(90deg,#4f46e5,#f59e0b); margin:16px auto; border-radius:2px; }
  .cert-title { font-family:'Playfair Display',serif; font-size:42px; color:#1e293b; margin:20px 0 8px; }
  .cert-sub { font-size:15px; color:#64748b; letter-spacing:1px; text-transform:uppercase; margin-bottom:30px; }
  .student-name { font-family:'Playfair Display',serif; font-size:36px; color:#4f46e5; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin:0 auto 8px; display:inline-block; min-width:300px; }
  .has-completed { font-size:15px; color:#64748b; margin:16px 0; }
  .course-name { font-family:'Playfair Display',serif; font-size:26px; color:#1e293b; margin:8px 0 24px; }
  .score-badge { display:inline-block; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; padding:10px 28px; border-radius:30px; font-size:16px; font-weight:600; margin-bottom:30px; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px; }
  .footer-item { text-align:center; }
  .footer-line { width:160px; height:1px; background:#cbd5e1; margin:8px auto 4px; }
  .footer-label { font-size:12px; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; }
  .footer-value { font-size:13px; font-weight:600; color:#1e293b; }
  .watermark { position:absolute; bottom:30px; left:50%; transform:translateX(-50%); font-size:11px; color:#cbd5e1; letter-spacing:2px; }
</style>
</head>
<body>
<div class="cert">
  <div class="logo">Edu<span>Cat</span></div>
  <div class="divider"></div>
  <div class="cert-title">Certificate</div>
  <div class="cert-sub">of Completion</div>
  <div class="has-completed">This is to certify that</div>
  <div class="student-name">${certificate.student?.fullName || "Student"}</div>
  <div class="has-completed">has successfully completed the course</div>
  <div class="course-name">${courseName}</div>
  <div class="score-badge">Score: ${certificate.marks}%</div>
  <div class="footer">
    <div class="footer-item">
      <div class="footer-value">${issueDate}</div>
      <div class="footer-line"></div>
      <div class="footer-label">Issue Date</div>
    </div>
    <div class="footer-item">
      <div class="footer-value">EduCat Platform</div>
      <div class="footer-line"></div>
      <div class="footer-label">Issued By</div>
    </div>
  </div>
  <div class="watermark">EDUCAT · VERIFIED CERTIFICATE · ${new Date().getFullYear()}</div>
</div>
</body>
</html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `EduCat_Certificate_${courseName.replace(/\s+/g, "_")}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.1))", border: "1px solid rgba(79,70,229,0.3)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎓</div>
            <h3 style={{ color: "var(--cp-text-primary)", fontSize: "18px", marginBottom: "6px" }}>Certificate Earned!</h3>
            <p style={{ color: "var(--cp-text-secondary)", fontSize: "14px", marginBottom: "8px" }}>{courseName}</p>
            <div style={{ display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "20px", padding: "4px 16px", color: "#10b981", fontWeight: "700", fontSize: "15px", marginBottom: "20px" }}>
                Score: {certificate.marks}%
            </div>
            <br />
            <button
                onClick={handleDownload}
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white", border: "none", borderRadius: "8px", padding: "10px 24px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
            >
                ⬇ Download Certificate
            </button>
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
        if (Object.keys(answers).length < quiz.questions.length) {
            alert("Please answer all questions before submitting!");
            return;
        }
        setSubmitting(true);
        await submitQuiz(courseId, answers);
        setSubmitting(false);
    };

    if (loading) return <p style={{ color: "var(--cp-text-secondary)" }}>Loading quiz...</p>;

    // Already has certificate
    if (certificate) {
        return <CertificateCard certificate={certificate} courseName={courseTitle} />;
    }

    if (!quiz) {
        return (
            <div style={{ textAlign: "center", padding: "50px 20px", border: "1px dashed var(--cp-border)", borderRadius: "10px", color: "var(--cp-text-secondary)" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
                <p style={{ fontSize: "15px" }}>No quiz available for this course yet.</p>
                <p style={{ fontSize: "13px", marginTop: "6px" }}>Check back later!</p>
            </div>
        );
    }

    // Show result
    if (quizResult) {
        const { correct, total, percentage, passed } = quizResult;
        return (
            <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>{passed ? "🎉" : "😔"}</div>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "24px", marginBottom: "8px" }}>
                    {passed ? "Congratulations!" : "Better luck next time!"}
                </h2>
                <p style={{ color: "var(--cp-text-secondary)", marginBottom: "24px" }}>
                    {passed ? "You passed the quiz and earned a certificate!" : "You need 60% to pass. Try again!"}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "24px" }}>
                    {[
                        { label: "Score", value: `${percentage}%`, color: passed ? "#10b981" : "#ef4444" },
                        { label: "Correct", value: `${correct}/${total}`, color: "#f59e0b" },
                        { label: "Status", value: passed ? "PASSED" : "FAILED", color: passed ? "#10b981" : "#ef4444" },
                    ].map((s) => (
                        <div key={s.label} style={{ background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)", borderRadius: "10px", padding: "16px 24px", textAlign: "center" }}>
                            <div style={{ fontSize: "22px", fontWeight: "700", color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "12px", color: "var(--cp-text-secondary)", marginTop: "4px" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                {passed && certificate && <CertificateCard certificate={certificate} courseName={courseTitle} />}
                {!passed && (
                    <button
                        onClick={() => { resetQuiz(); setAnswers({}); setStarted(false); fetchQuiz(courseId); }}
                        style={{ background: "var(--cp-accent)", color: "white", border: "none", borderRadius: "8px", padding: "10px 28px", fontWeight: "600", cursor: "pointer" }}
                    >Try Again</button>
                )}
            </div>
        );
    }

    // Intro screen
    if (!started) {
        return (
            <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "22px", marginBottom: "8px" }}>{quiz.title}</h2>
                <p style={{ color: "var(--cp-text-secondary)", marginBottom: "24px" }}>{quiz.questions.length} questions · Pass with 60% · Earn a certificate</p>
                <div style={{ background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)", borderRadius: "10px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
                    <p style={{ color: "var(--cp-text-secondary)", fontSize: "13px" }}>⚠️ You can retake the quiz if you fail. Once you pass, your certificate will be generated automatically.</p>
                </div>
                <button
                    onClick={() => setStarted(true)}
                    style={{ background: "var(--cp-accent)", color: "white", border: "none", borderRadius: "8px", padding: "12px 36px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}
                >Start Quiz</button>
            </div>
        );
    }

    // Quiz questions
    return (
        <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ color: "var(--cp-text-primary)", fontSize: "18px" }}>{quiz.title}</h2>
                <span style={{ color: "var(--cp-text-secondary)", fontSize: "13px" }}>{Object.keys(answers).length}/{quiz.questions.length} answered</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
                {quiz.questions.map((q, idx) => (
                    <div key={q._id} style={{ background: "var(--cp-bg-card)", border: "1px solid var(--cp-border)", borderRadius: "10px", padding: "20px" }}>
                        <p style={{ color: "var(--cp-text-primary)", fontWeight: "600", marginBottom: "14px", fontSize: "15px" }}>
                            {idx + 1}. {q.questionText}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {q.options.map((opt) => {
                                const selected = answers[q._id] === opt;
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(q._id, opt)}
                                        style={{
                                            textAlign: "left", padding: "10px 14px", borderRadius: "8px",
                                            border: selected ? "2px solid var(--cp-accent)" : "1px solid var(--cp-border)",
                                            background: selected ? "rgba(59,130,246,0.12)" : "var(--cp-bg-secondary)",
                                            color: selected ? "var(--cp-accent)" : "var(--cp-text-secondary)",
                                            cursor: "pointer", fontSize: "14px", fontWeight: selected ? "600" : "400",
                                            transition: "all 0.15s",
                                        }}
                                    >{opt}</button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ background: "var(--cp-accent)", color: "white", border: "none", borderRadius: "8px", padding: "12px 32px", fontSize: "15px", fontWeight: "600", cursor: "pointer", opacity: submitting ? 0.7 : 1 }}
            >{submitting ? "Submitting..." : "Submit Quiz"}</button>
        </div>
    );
}
