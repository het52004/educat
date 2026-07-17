import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    // Snapshot of the course details at the time the certificate was earned.
    // A certificate is proof of past achievement, so it must keep showing the
    // correct course name/category even if the course is later deleted.
    courseTitle: {
        type: String,
        default: "",
    },
    courseCategory: {
        type: String,
        default: "",
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    marks: {
        type: Number,
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;