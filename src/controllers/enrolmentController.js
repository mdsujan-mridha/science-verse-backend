

const User = require("../models/UserModel");
const Course = require("../models/CourseModel");

/**
 * 🎓 Enroll user to course
 * Triggered after payment success
 */
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase UID mapped user
    const { courseId } = req.body;

    const user = await User.findOne({ firebaseUid: userId });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or course not found" });
    }

    // Already enrolled?
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    user.enrolledCourses.push(courseId);
    course.studentsCount += 1;

    await user.save();
    await course.save();

    res.json({ message: "Enrollment successful 🎉" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
