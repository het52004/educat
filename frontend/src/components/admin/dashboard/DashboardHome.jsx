import { useEffect } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaStar, FaRupeeSign, FaUsers } from "react-icons/fa";
import { useAdminStore } from "../../../store/admin/useAdminStore";

function StatCard({ icon, iconBg, iconColor, value, label }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
                {icon}
            </div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{label}</p>
            </div>
        </div>
    );
}

function DashboardHome() {
    const { stats, fetchStats } = useAdminStore();

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) {
        return <div className="loading-state">Loading dashboard...</div>;
    }

    const maxTrend = Math.max(1, ...stats.signupTrend.map((m) => Math.max(m.students, m.instructors)));
    const maxCategory = Math.max(1, ...stats.categoryBreakdown.map((c) => c.count));

    return (
        <div>
            <div className="stats-grid">
                <StatCard
                    icon={<FaUserGraduate />}
                    iconBg="#e0e7ff"
                    iconColor="#4f46e5"
                    value={stats.totalStudents}
                    label="Total Students"
                />
                <StatCard
                    icon={<FaChalkboardTeacher />}
                    iconBg="#fef3c7"
                    iconColor="#d97706"
                    value={stats.totalInstructors}
                    label="Total Instructors"
                />
                <StatCard
                    icon={<FaBook />}
                    iconBg="#dcfce7"
                    iconColor="#15803d"
                    value={stats.totalCourses}
                    label={`Courses (${stats.publishedCourses} published)`}
                />
                <StatCard
                    icon={<FaUsers />}
                    iconBg="#dbeafe"
                    iconColor="#2563eb"
                    value={stats.totalEnrollments}
                    label="Total Enrollments"
                />
                <StatCard
                    icon={<FaStar />}
                    iconBg="#fef9c3"
                    iconColor="#ca8a04"
                    value={stats.avgRating}
                    label={`Avg Rating (${stats.totalFeedback} reviews)`}
                />
                <StatCard
                    icon={<FaRupeeSign />}
                    iconBg="#fee2e2"
                    iconColor="#dc2626"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    label="Estimated Revenue"
                />
            </div>

            <div className="panel-grid">
                <div className="panel">
                    <h3>Signups (Last 6 Months)</h3>
                    <div className="trend-bars">
                        {stats.signupTrend.map((m) => (
                            <div className="trend-col" key={m.month}>
                                <div className="trend-bar-stack">
                                    <div
                                        className="trend-bar students"
                                        style={{ height: `${(m.students / maxTrend) * 100}%` }}
                                        title={`${m.students} students`}
                                    />
                                    <div
                                        className="trend-bar instructors"
                                        style={{ height: `${(m.instructors / maxTrend) * 100}%` }}
                                        title={`${m.instructors} instructors`}
                                    />
                                </div>
                                <span className="trend-label">{m.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="legend">
                        <div className="legend-item"><span className="legend-dot students" /> Students</div>
                        <div className="legend-item"><span className="legend-dot instructors" /> Instructors</div>
                    </div>
                </div>

                <div className="panel">
                    <h3>Courses by Category</h3>
                    {stats.categoryBreakdown.length === 0 ? (
                        <p style={{ color: "var(--text-gray)", fontSize: "13px" }}>No courses yet.</p>
                    ) : (
                        <div className="category-list">
                            {stats.categoryBreakdown.map((c) => (
                                <div className="category-row" key={c.category}>
                                    <span className="label">{c.category}</span>
                                    <div className="category-bar-track">
                                        <div
                                            className="category-bar-fill"
                                            style={{ width: `${(c.count / maxCategory) * 100}%` }}
                                        />
                                    </div>
                                    <span className="count">{c.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;
