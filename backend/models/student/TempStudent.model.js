import mongoose from "mongoose";

const TempStudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    otp:{
        type: String,
        required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expireAfterSeconds: 0 }, 
    },
  },
  { timestamps: true }
);

const TempStudent = mongoose.model("TempStudent", TempStudentSchema);

export default TempStudent;
