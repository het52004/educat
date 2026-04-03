import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    senderRole: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
