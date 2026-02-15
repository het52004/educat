import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
    },
    rates: [
        {
            type: Number,
        },  
    ],
    category: {
        type: String,
        required: true,
    },
}, { timestamps: true });   

const Course = mongoose.model("Course", courseSchema);

export default Course;