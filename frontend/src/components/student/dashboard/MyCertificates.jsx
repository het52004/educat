import { useEffect } from "react";
import useQuizStore from "../../../store/student/useQuizStore";
import "../../../styles/student/Dashboard.css";

function generateCertHTML(cert) {
    const issueDate = new Date(cert.issueDate || cert.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });
    const studentName = cert.student?.fullName || "Student";
    const courseTitle = cert.course?.title || "Course";
    const score = cert.marks;

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Certificate - ${courseTitle}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
  .cert-wrap { background:white; width:100%; max-width:860px; border-radius:4px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.3); }
  .cert-top { background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:40px 60px; text-align:center; }
  .cert-logo { font-size:24px; font-weight:700; color:white; letter-spacing:3px; opacity:0.9; }
  .cert-logo span { color:#fbbf24; }
  .cert-body { padding:50px 60px; text-align:center; position:relative; border:1px solid #f1f5f9; }
  .cert-body::before { content:''; position:absolute; inset:16px; border:1px solid #e8d5a3; pointer-events:none; border-radius:2px; }
  .cert-of { font-size:13px; color:#94a3b8; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; }
  .cert-title { font-family:'Playfair Display',serif; font-size:44px; color:#1e293b; margin-bottom:28px; }
  .cert-presented { font-size:14px; color:#64748b; margin-bottom:6px; }
  .cert-name { font-family:'Playfair Display',serif; font-size:38px; color:#4f46e5; margin-bottom:8px; padding-bottom:12px; border-bottom:2px solid #e2e8f0; display:inline-block; min-width:300px; }
  .cert-completed { font-size:14px; color:#64748b; margin:20px 0 6px; }
  .cert-course { font-family:'Playfair Display',serif; font-size:24px; color:#1e293b; margin-bottom:24px; font-style:italic; }
  .cert-badge { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#10b981,#059669); color:white; padding:10px 28px; border-radius:50px; font-size:15px; font-weight:700; letter-spacing:0.5px; margin-bottom:36px; }
  .cert-footer { display:flex; justify-content:space-around; margin-top:12px; padding-top:28px; border-top:1px solid #f1f5f9; }
  .cert-footer-item { text-align:center; }
  .cert-footer-line { width:140px; height:1px; background:#cbd5e1; margin:8px auto 6px; }
  .cert-footer-label { font-size:11px; color:#94a3b8; letter-spacing:2px; text-transform:uppercase; }
  .cert-footer-val { font-size:13px; font-weight:600; color:#374151; }
  .cert-bottom { background:#f8fafc; padding:16px 60px; text-align:center; }
  .cert-bottom p { font-size:11px; color:#94a3b8; letter-spacing:2px; text-transform:uppercase; }
</style>
</head>
<body>
<div class="cert-wrap">
  <div class="cert-top">
    <div class="cert-logo">Edu<span>Cat</span></div>
  </div>
  <div class="cert-body">
    <div class="cert-of">Certificate</div>
    <div class="cert-title">of Completion</div>
    <div class="cert-presented">This is to proudly certify that</div>
    <div class="cert-name">${studentName}</div>
    <div class="cert-completed">has successfully completed the course</div>
    <div class="cert-course">${courseTitle}</div>
    <div class="cert-badge">🏆 Final Score: ${score}%</div>
    <div class="cert-footer">
      <div class="cert-footer-item">
        <div class="cert-footer-val">${issueDate}</div>
        <div class="cert-footer-line"></div>
        <div class="cert-footer-label">Date Issued</div>
      </div>
      <div class="cert-footer-item">
        <div class="cert-footer-val">EduCat Platform</div>
        <div class="cert-footer-line"></div>
        <div class="cert-footer-label">Issued By</div>
      </div>
    </div>
  </div>
  <div class="cert-bottom">
    <p>EduCat · Verified Certificate · ${new Date().getFullYear()}</p>
  </div>
</div>
</body>
</html>`;
}

export function downloadCertificate(cert) {
    const html = generateCertHTML(cert);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EduCat_Certificate_${(cert.course?.title || "Course").replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function MyCertificates() {
    const { certificates, fetchMyCertificates } = useQuizStore();

    useEffect(() => { fetchMyCertificates(); }, []);

    return (
        <>
            <h2 className="section-title">My Certificates</h2>

            {certificates.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "70px 20px",
                    background: "white", borderRadius: "16px",
                    border: "1px dashed #d1d5db", marginTop: "8px",
                }}>
                    <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎓</div>
                    <p style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>No certificates yet</p>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>Complete a course quiz with 60% or higher to earn a certificate!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {certificates.map((cert) => (
                        <div key={cert._id} style={{
                            background: "white", borderRadius: "16px",
                            border: "1px solid #e5e7eb", overflow: "hidden",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                        >
                            {/* Card header */}
                            <div style={{
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                padding: "28px 20px 20px", textAlign: "center",
                            }}>
                                <div style={{ fontSize: "44px", marginBottom: "10px" }}>🏆</div>
                                <h3 style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0, lineHeight: "1.4" }}>
                                    {cert.course?.title}
                                </h3>
                                {cert.course?.category && (
                                    <span style={{
                                        display: "inline-block", marginTop: "8px",
                                        background: "rgba(255,255,255,0.2)", color: "white",
                                        fontSize: "11px", padding: "3px 10px", borderRadius: "12px",
                                    }}>{cert.course.category}</span>
                                )}
                            </div>

                            {/* Card body */}
                            <div style={{ padding: "18px 20px 20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <span style={{ fontSize: "13px", color: "#6b7280" }}>Final Score</span>
                                    <span style={{
                                        fontSize: "14px", fontWeight: "700",
                                        color: cert.marks >= 80 ? "#10b981" : cert.marks >= 60 ? "#f59e0b" : "#ef4444",
                                        background: cert.marks >= 80 ? "#ecfdf5" : cert.marks >= 60 ? "#fffbeb" : "#fef2f2",
                                        padding: "2px 10px", borderRadius: "12px",
                                    }}>{cert.marks}%</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                                    <span style={{ fontSize: "13px", color: "#6b7280" }}>Issued</span>
                                    <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                                        {new Date(cert.issueDate || cert.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                                <button
                                    onClick={() => downloadCertificate(cert)}
                                    className="btn-primary"
                                    style={{ fontSize: "13px", padding: "9px", fontWeight: "600" }}
                                >⬇ Download Certificate</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
