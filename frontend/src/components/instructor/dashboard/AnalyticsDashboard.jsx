import { useEffect } from "react";
import useAnalyticsStore from "../../../store/instructor/useAnalyticsStore";
import "../../../styles/instructor/Dashboard.css";
import "../../../styles/instructor/Analytics.css";

function StatCard({ icon, label, value, color }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color.bg, color: color.text }}>{icon}</div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{label}</p>
            </div>
        </div>
    );
}

function MiniBar({ value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div style={{ background: "#f1f5f9", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.6s ease" }} />
        </div>
    );
}

function BarChart({ data }) {
    const maxVal = Math.max(...data.map((d) => d.students), 1);
    return (
        <div className="analytics-chart">
            <div className="chart-bars">
                {data.map((d) => {
                    const pct = maxVal > 0 ? Math.round((d.students / maxVal) * 100) : 0;
                    return (
                        <div key={d.month} className="chart-bar-col">
                            <div className="chart-bar-tooltip">{d.students}</div>
                            <div className="chart-bar-track">
                                <div className="chart-bar-fill" style={{ height: `${pct}%` }} />
                            </div>
                            <span className="chart-bar-label">{d.month}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AnalyticsDashboard() {
    const { analytics, loading, fetchAnalytics } = useAnalyticsStore();

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "#64748b", fontFamily: "Poppins, sans-serif" }}>
                Loading analytics...
            </div>
        );
    }

    if (!analytics) return null;

    const { totalCourses, totalStudents, totalLectures, totalRevenue, avgRating, totalReviews, courseStats, enrollmentTrend } = analytics;
    const maxEnrolled = Math.max(...courseStats.map((c) => c.enrolledCount), 1);

    return (
        <div className="analytics-container">
            <h2 className="analytics-title">📊 Analytics Overview</h2>

            {/* Top stat cards */}
            <div className="stats-grid analytics-stats">
                <StatCard icon="📚" label="Total Courses" value={totalCourses} color={{ bg: "#e0e7ff", text: "#4338ca" }} />
                <StatCard icon="👥" label="Total Students" value={totalStudents} color={{ bg: "#dcfce7", text: "#15803d" }} />
                <StatCard icon="🎬" label="Total Lectures" value={totalLectures} color={{ bg: "#fef3c7", text: "#b45309" }} />
                <StatCard icon="💰" label="Est. Revenue" value={`$${totalRevenue.toLocaleString()}`} color={{ bg: "#fce7f3", text: "#be185d" }} />
                <StatCard icon="⭐" label="Avg Rating" value={avgRating} color={{ bg: "#ede9fe", text: "#7c3aed" }} />
                <StatCard icon="💬" label="Total Reviews" value={totalReviews} color={{ bg: "#e0f2fe", text: "#0369a1" }} />
            </div>

            {/* Enrollment trend chart */}
            <div className="analytics-section">
                <h3 className="analytics-section-title">Student Enrollment Trend (Last 6 Months)</h3>
                {enrollmentTrend.every((m) => m.students === 0) ? (
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>No enrollment data yet.</p>
                ) : (
                    <BarChart data={enrollmentTrend} />
                )}
            </div>

            {/* Per-course breakdown */}
            <div className="analytics-section">
                <h3 className="analytics-section-title">Course Performance</h3>
                {courseStats.length === 0 ? (
                    <p style={{ color: "#94a3b8", fontSize: "14px" }}>No courses yet.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Students</th>
                                    <th>Lectures</th>
                                    <th>Rating</th>
                                    <th>Reviews</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseStats.map((c) => (
                                    <tr key={c._id}>
                                        <td className="fw-bold">{c.title}</td>
                                        <td>{c.category}</td>
                                        <td>${c.price}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <span>{c.enrolledCount}</span>
                                                <MiniBar value={c.enrolledCount} max={maxEnrolled} color="#4f46e5" />
                                            </div>
                                        </td>
                                        <td>{c.lectureCount}</td>
                                        <td>
                                            <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                                                {c.avgRating !== "N/A" ? `⭐ ${c.avgRating}` : "—"}
                                            </span>
                                        </td>
                                        <td>{c.reviewCount}</td>
                                        <td style={{ fontWeight: "600", color: "#15803d" }}>${c.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
