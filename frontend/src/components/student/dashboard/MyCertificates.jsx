import { useEffect } from "react";
import useQuizStore from "../../../store/student/useQuizStore";
import "../../../styles/student/Dashboard.css";

export default function MyCertificates() {
    const { certificates, fetchMyCertificates } = useQuizStore();

    useEffect(() => {
        fetchMyCertificates();
    }, []);

    const handleDownload = (cert) => {
        const issueDate = new Date(cert.issueDate).toLocaleDateString("en-US", {
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
  <div class="student-name">${cert.student?.fullName || "Student"}</div>
  <div class="has-completed">has successfully completed the course</div>
  <div class="course-name">${cert.course?.title || "Course"}</div>
  <div class="score-badge">Score: ${cert.marks}%</div>
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
        a.download = `EduCat_Certificate_${cert.course?.title?.replace(/\s+/g, "_") || "Course"}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <h2 className="section-title">My Certificates</h2>
            {certificates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-gray)" }}>
                    <div style={{ fontSize: "52px", marginBottom: "16px" }}>🎓</div>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>No certificates yet</p>
                    <p style={{ fontSize: "13px", marginTop: "8px" }}>Complete a course quiz to earn your first certificate!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {certificates.map((cert) => (
                        <div key={cert._id} style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                            <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "28px 20px", textAlign: "center" }}>
                                <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏆</div>
                                <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>{cert.course?.title}</h3>
                            </div>
                            <div style={{ padding: "16px 20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-gray)" }}>Score</span>
                                    <span style={{ fontSize: "13px", fontWeight: "700", color: cert.marks >= 80 ? "#10b981" : "#f59e0b" }}>{cert.marks}%</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                                    <span style={{ fontSize: "13px", color: "var(--text-gray)" }}>Issued</span>
                                    <span style={{ fontSize: "13px", color: "#374151" }}>{new Date(cert.issueDate).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => handleDownload(cert)}
                                    className="btn-primary"
                                    style={{ fontSize: "13px", padding: "8px" }}
                                >⬇ Download Certificate</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
