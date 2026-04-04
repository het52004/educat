import fs from "fs";
import Lecture from "../../models/Lecture.model.js";
import Course from "../../models/Course.model.js";

export const uploadLecture = async (req, res) => {
    if (!req.file) return res.json({ success: false, message: "No video file uploaded!" });

    const { courseId, title, description, order } = req.body;
    if (!courseId || !title) return res.json({ success: false, message: "Course ID and title are required!" });

    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) {
        fs.unlinkSync(req.file.path);
        return res.json({ success: false, message: "Course not found!" });
    }

    const lecture = await Lecture.create({
        courseId, title,
        description: description || "",
        videoPath: req.file.path,
        order: Number(order) || 0,
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { lectures: 1 } });
    return res.json({ success: true, message: "Lecture uploaded successfully!", lecture });
};

export const getLecturesByCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrolled = req.student.enrolledCourses.map(String).includes(String(courseId));
    if (!enrolled) return res.status(403).json({ success: false, message: "Enroll in this course to access lectures!" });

    const lectures = await Lecture.find({ courseId }).sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, lectures });
};

export const getInstructorLectures = async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, addedBy: req.instructor._id });
    if (!course) return res.status(403).json({ success: false, message: "Unauthorized!" });

    const lectures = await Lecture.find({ courseId }).sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, lectures });
};

export const deleteLecture = async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.json({ success: false, message: "Lecture not found!" });

    const course = await Course.findOne({ _id: lecture.courseId, addedBy: req.instructor._id });
    if (!course) return res.status(403).json({ success: false, message: "Unauthorized!" });

    if (fs.existsSync(lecture.videoPath)) fs.unlinkSync(lecture.videoPath);
    await Lecture.findByIdAndDelete(lectureId);
    await Course.findByIdAndUpdate(lecture.courseId, { $inc: { lectures: -1 } });
    return res.json({ success: true, message: "Lecture deleted successfully!" });
};

export const streamVideo = async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found!" });

    const enrolled = req.student.enrolledCourses.map(String).includes(String(lecture.courseId));
    if (!enrolled) return res.status(403).json({ success: false, message: "Enroll in this course to watch lectures!" });

    const videoPath = lecture.videoPath;
    if (!fs.existsSync(videoPath)) return res.status(404).json({ success: false, message: "Video file not found!" });

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });
        fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
        res.writeHead(200, { "Content-Length": fileSize, "Content-Type": "video/mp4" });
        fs.createReadStream(videoPath).pipe(res);
    }
};
