import express from "express";
import multer from "multer";
import path from "path";
import {
    uploadLecture,
    getLecturesByCourse,
    getInstructorLectures,
    deleteLecture,
    streamVideo,
} from "../../controllers/lectureControllers/lecture.controller.js";
import verifyInstructor from "../../middleware/verifyInstructor.js";
import verifyStudent from "../../middleware/verifyStudent.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/videos/"),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only video files are allowed!"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });

const router = express.Router();

router.get("/course/:courseId", verifyStudent, getLecturesByCourse);
router.get("/instructor/course/:courseId", verifyInstructor, getInstructorLectures);
router.get("/stream/:lectureId", verifyStudent, streamVideo);
router.post("/upload", verifyInstructor, upload.single("video"), uploadLecture);
router.delete("/:lectureId", verifyInstructor, deleteLecture);

export default router;
