import Quiz from "../../models/student/Quiz.model.js";
import Certificate from "../../models/Certificate.model.js";
import Course from "../../models/Course.model.js";

export const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const { title, questions, marks } = req.body;

    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.json({ success: false, message: "Course not found!" });

    if (!title || !questions || questions.length === 0)
        return res.json({ success: false, message: "Title and questions are required!" });

    // Remove any existing quiz for this course (one quiz per course)
    await Quiz.deleteMany({ courseId });

    const quiz = await Quiz.create({ title, questions, marks: marks || 100, courseId });
    return res.json({ success: true, message: "Quiz created!", quiz });
};

export const getQuizByCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) return res.json({ success: false, message: "No quiz found for this course." });
    return res.json({ success: true, quiz });
};

export const getQuizForStudent = async (req, res) => {
    const { courseId } = req.params;

    const isEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (!isEnrolled) return res.json({ success: false, message: "You must be enrolled to take this quiz!" });

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) return res.json({ success: false, quiz: null });

    // Hide correct answers from student
    const safeQuiz = {
        _id: quiz._id,
        title: quiz.title,
        marks: quiz.marks,
        courseId: quiz.courseId,
        questions: quiz.questions.map((q) => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options,
        })),
    };
    return res.json({ success: true, quiz: safeQuiz });
};

export const submitQuiz = async (req, res) => {
    const { courseId } = req.params;
    const { answers } = req.body; // { questionId: selectedAnswer }

    const isEnrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (!isEnrolled) return res.json({ success: false, message: "You must be enrolled!" });

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) return res.json({ success: false, message: "No quiz found!" });

    // Check if already has a certificate
    const existing = await Certificate.findOne({ course: courseId, student: req.student._id });
    if (existing) return res.json({ success: false, message: "You have already completed this quiz!", certificate: existing });

    let correct = 0;
    quiz.questions.forEach((q) => {
        if (answers[q._id.toString()] === q.correctAnswer) correct++;
    });

    const percentage = Math.round((correct / quiz.questions.length) * 100);
    const passed = percentage >= 60;

    let certificate = null;
    if (passed) {
        certificate = await Certificate.create({
            course: courseId,
            student: req.student._id,
            marks: percentage,
        });
        // Populate for frontend download use
        certificate = await Certificate.findById(certificate._id)
            .populate("course", "title")
            .populate("student", "fullName");
    }

    return res.json({
        success: true,
        correct,
        total: quiz.questions.length,
        percentage,
        passed,
        certificate,
    });
};

export const getCertificate = async (req, res) => {
    const { courseId } = req.params;
    const certificate = await Certificate.findOne({ course: courseId, student: req.student._id })
        .populate("course", "title")
        .populate("student", "fullName");
    return res.json({ success: true, certificate });
};

export const getMyCertificates = async (req, res) => {
    const certificates = await Certificate.find({ student: req.student._id })
        .populate("course", "title category")
        .populate("student", "fullName")
        .sort({ createdAt: -1 });
    return res.json({ success: true, certificates });
};

export const deleteQuiz = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.json({ success: false, message: "Course not found!" });
    await Quiz.deleteMany({ courseId });
    return res.json({ success: true, message: "Quiz deleted!" });
};
