import Student from "../../models/student/Student.model.js";
import Instructor from "../../models/instructor/Instructor.model.js";
import Course from "../../models/Course.model.js";
import Feedback from "../../models/Feedback.model.js";

export const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalInstructors, totalCourses, publishedCourses, totalFeedback, courses] = await Promise.all([
      Student.countDocuments(),
      Instructor.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Feedback.countDocuments(),
      Course.find({}, "price ratings category createdAt"),
    ]);

    // Revenue estimate: price * number of students enrolled in that course
    const enrollmentCounts = await Student.aggregate([
      { $unwind: "$enrolledCourses" },
      { $group: { _id: "$enrolledCourses", count: { $sum: 1 } } },
    ]);
    const enrollmentMap = {};
    enrollmentCounts.forEach((e) => { enrollmentMap[String(e._id)] = e.count; });

    let totalRevenue = 0;
    let totalRatingsSum = 0;
    let totalRatingsCount = 0;
    const categoryMap = {};

    courses.forEach((c) => {
      const enrolled = enrollmentMap[String(c._id)] || 0;
      totalRevenue += enrolled * (c.price || 0);
      totalRatingsSum += c.ratings.reduce((a, b) => a + b, 0);
      totalRatingsCount += c.ratings.length;
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    const avgRating = totalRatingsCount > 0 ? (totalRatingsSum / totalRatingsCount).toFixed(1) : "N/A";
    const totalEnrollments = enrollmentCounts.reduce((acc, e) => acc + e.count, 0);

    // Signups over last 6 months (students + instructors)
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        start: d,
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      });
    }
    const signupTrend = await Promise.all(
      months.map(async (m) => {
        const [studentCount, instructorCount] = await Promise.all([
          Student.countDocuments({ createdAt: { $gte: m.start, $lte: m.end } }),
          Instructor.countDocuments({ createdAt: { $gte: m.start, $lte: m.end } }),
        ]);
        return { month: m.label, students: studentCount, instructors: instructorCount };
      })
    );

    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        unpublishedCourses: totalCourses - publishedCourses,
        totalFeedback,
        totalEnrollments,
        totalRevenue,
        avgRating,
        signupTrend,
        categoryBreakdown,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: "Failed to fetch stats!" });
  }
};
