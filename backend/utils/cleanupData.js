/**
 * One-time data cleanup script.
 *
 * Fixes legacy bad data caused by the enrollment/certificate bugs:
 *   1. Removes duplicate course ids from each student's enrolledCourses array.
 *   2. Removes ids of courses that no longer exist from enrolledCourses.
 *   3. Removes duplicate certificates (same student + course), keeping the
 *      earliest one issued.
 *
 * This does NOT need to be run on a schedule - it's a one-off repair for data
 * created before the code fixes. Safe to run more than once (it's idempotent).
 *
 * Usage (from the backend/ folder):
 *   node utils/cleanupData.js
 *
 * It uses the same MONGO_URI from your .env file that the app already uses,
 * so make sure your .env is present and points at the database you want to clean.
 */

import mongoose from "mongoose";
import { env } from "./envValues.js";
import Student from "../models/student/Student.model.js";
import Course from "../models/Course.model.js";
import Certificate from "../models/Certificate.model.js";

const run = async () => {
  await mongoose.connect(env.database_url);
  console.log("Connected to database:", mongoose.connection.name);

  // ---- 1 & 2: Fix enrolledCourses arrays ----
  const existingCourseIds = new Set((await Course.find({}, "_id")).map((c) => String(c._id)));
  const students = await Student.find({}, "enrolledCourses");

  let studentsFixed = 0;
  for (const student of students) {
    const original = (student.enrolledCourses || []).map(String);
    const cleaned = [...new Set(original.filter((id) => existingCourseIds.has(id)))];

    if (cleaned.length !== original.length) {
      await Student.findByIdAndUpdate(student._id, { enrolledCourses: cleaned });
      studentsFixed++;
      console.log(
        `Student ${student._id}: ${original.length} -> ${cleaned.length} enrolled course entries`
      );
    }
  }
  console.log(`\nFixed enrolledCourses on ${studentsFixed} student document(s).`);

  // ---- 3: Remove duplicate certificates ----
  const duplicateGroups = await Certificate.aggregate([
    {
      $group: {
        _id: { student: "$student", course: "$course" },
        ids: { $push: "$_id" },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  let certsRemoved = 0;
  for (const group of duplicateGroups) {
    // Keep the oldest certificate (first issued), remove the rest.
    const sortedIds = group.ids.slice(1); // ids are already in insertion order from $push
    await Certificate.deleteMany({ _id: { $in: sortedIds } });
    certsRemoved += sortedIds.length;
    console.log(
      `Student ${group._id.student} / Course ${group._id.course}: removed ${sortedIds.length} duplicate certificate(s)`
    );
  }
  console.log(`\nRemoved ${certsRemoved} duplicate certificate(s).`);

  console.log("\nCleanup complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
