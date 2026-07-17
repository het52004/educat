import Instructor from "../../models/instructor/Instructor.model.js";

export const updateInstructorProfile = async (req, res) => {
    const instructor = req.instructor;
    const { name, bio, expertise, currentPassword, newPassword } = req.body;

    if (!name) return res.json({ success: false, message: "Fill all required fields!" });

    const normalizedExpertise = Array.isArray(expertise)
        ? expertise
        : typeof expertise === "string"
            ? expertise.split(",").map((e) => e.trim()).filter(Boolean)
            : instructor.expertise;

    if (newPassword || currentPassword) {
        if (!currentPassword) return res.json({ success: false, message: "Enter current password to change password!" });
        const fullInstructor = await Instructor.findById(instructor._id);
        const match = await fullInstructor.comparePassword(currentPassword);
        if (!match) return res.json({ success: false, message: "Current password is incorrect!" });
        if (!newPassword || newPassword.length < 6) return res.json({ success: false, message: "New password must be at least 6 characters!" });
        fullInstructor.name = name;
        fullInstructor.bio = bio ?? fullInstructor.bio;
        fullInstructor.expertise = normalizedExpertise;
        fullInstructor.password = newPassword;
        await fullInstructor.save();
        const updatedInstructor = await Instructor.findById(instructor._id).select("-password");
        return res.json({ success: true, message: "Profile updated successfully!", instructorData: updatedInstructor });
    }

    await Instructor.findByIdAndUpdate(instructor._id, { name, bio, expertise: normalizedExpertise });
    const updatedInstructor = await Instructor.findById(instructor._id).select("-password");
    return res.json({ success: true, message: "Profile updated successfully!", instructorData: updatedInstructor });
};
