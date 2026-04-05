import Course from "../../models/Course.model.js";
import Student from "../../models/student/Student.model.js";
import Feedback from "../../models/Feedback.model.js";
import Lecture from "../../models/Lecture.model.js";

export const getInstructorAnalytics = async (req, res) => {
    const instructorId = req.instructor._id;

    // Get all instructor courses
    const courses = await Course.find({ addedBy: instructorId });
    const courseIds = courses.map((c) => c._id);

    // Count total students enrolled in any of instructor's courses
    const students = await Student.find({ enrolledCourses: { $in: courseIds } });

    // Total lectures
    const totalLectures = await Lecture.countDocuments({ courseId: { $in: courseIds } });

    // All feedback for instructor's courses
    const feedbacks = await Feedback.find({ course: { $in: courseIds } }).populate("course", "title");

    // Average rating across all courses
    const totalRatings = courses.reduce((acc, c) => acc + c.ratings.length, 0);
    const sumRatings = courses.reduce((acc, c) => acc + c.ratings.reduce((s, r) => s + r, 0), 0);
    const avgRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "N/A";

    // Per-course stats
    const courseStats = await Promise.all(
        courses.map(async (course) => {
            const enrolledCount = await Student.countDocuments({ enrolledCourses: course._id });
            const courseFeedbacks = feedbacks.filter((f) => f.course._id.toString() === course._id.toString());
            const courseAvgRating =
                course.ratings.length > 0
                    ? (course.ratings.reduce((a, b) => a + b, 0) / course.ratings.length).toFixed(1)
                    : "N/A";
            const lectureCount = await Lecture.countDocuments({ courseId: course._id });
            return {
                _id: course._id,
                title: course.title,
                category: course.category,
                price: course.price,
                enrolledCount,
                avgRating: courseAvgRating,
                reviewCount: courseFeedbacks.length,
                lectureCount,
                revenue: enrolledCount * course.price,
            };
        })
    );

    // Enrollment trend: students grouped by month they enrolled (using createdAt of student)
    // Simple: count new students per course over the last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ label: d.toLocaleString("default", { month: "short", year: "2-digit" }), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) });
    }

    const enrollmentTrend = await Promise.all(
        months.map(async (m) => {
            // Count students who enrolled in any of instructor's courses within this month
            const count = await Student.countDocuments({
                enrolledCourses: { $in: courseIds },
                createdAt: { $gte: m.start, $lte: m.end },
            });
            return { month: m.label, students: count };
        })
    );

    const totalRevenue = courseStats.reduce((acc, c) => acc + c.revenue, 0);

    return res.json({
        success: true,
        analytics: {
            totalCourses: courses.length,
            totalStudents: students.length,
            totalLectures,
            totalRevenue,
            avgRating,
            totalReviews: feedbacks.length,
            courseStats,
            enrollmentTrend,
        },
    });
};
