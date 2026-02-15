import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,

    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;