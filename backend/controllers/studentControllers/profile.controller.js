import Student from "../../models/student/Student.model.js";

export const updateProfile = async (req, res) => {
    const student = req.student;
    const { fullName, contactNumber, currentPassword, newPassword } = req.body;

    if (!fullName || !contactNumber) return res.json({ success: false, message: "Fill all required fields!" });

    if (newPassword || currentPassword) {
        if (!currentPassword) return res.json({ success: false, message: "Enter current password to change password!" });
        const fullStudent = await Student.findById(student._id);
        const match = await fullStudent.comparePassword(currentPassword);
        if (!match) return res.json({ success: false, message: "Current password is incorrect!" });
        if (!newPassword || newPassword.length < 6) return res.json({ success: false, message: "New password must be at least 6 characters!" });
        fullStudent.fullName = fullName;
        fullStudent.contactNumber = contactNumber;
        fullStudent.password = newPassword;
        await fullStudent.save();
        const updatedStudent = await Student.findById(student._id).select("-password");
        return res.json({ success: true, message: "Profile updated successfully!", studentData: updatedStudent });
    }

    await Student.findByIdAndUpdate(student._id, { fullName, contactNumber });
    const updatedStudent = await Student.findById(student._id).select("-password");
    return res.json({ success: true, message: "Profile updated successfully!", studentData: updatedStudent });
};

export const deleteAccount = async (req, res) => {
    const { password } = req.body;
    if (!password) return res.json({ success: false, message: "Enter your password to confirm!" });

    const fullStudent = await Student.findById(req.student._id);
    const match = await fullStudent.comparePassword(password);
    if (!match) return res.json({ success: false, message: "Incorrect password!" });

    await Student.findByIdAndDelete(req.student._id);
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "lax" });
    return res.json({ success: true, message: "Account deleted successfully!" });
};
