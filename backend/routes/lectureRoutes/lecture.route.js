import express from "express";
import multer from "multer";
import path from "path";
import {
    uploadLecture,
    getLecturesByCourse,
    deleteLecture,
    streamVideo,
} from "../../controllers/lectureControllers/lecture.controller.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/videos/");
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });

const app = express();

app.post("/upload", upload.single("video"), uploadLecture);
app.get("/course/:courseId", getLecturesByCourse);
app.delete("/:lectureId", deleteLecture);
app.get("/stream/:lectureId", streamVideo);

export default app;
