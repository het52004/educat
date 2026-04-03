import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "",
    },
    duration: {
        type: String,
        default: "",
    },
    lectures: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
    },
    ratings: [
        {
            type: Number,
        },
    ],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
