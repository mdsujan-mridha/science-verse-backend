const User = require("../models/UserModel");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const courseId = req.params.courseId || req.body.courseId;

    const isEnrolled = user.enrolledCourses.some(
      id => id.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ message: "Course access denied" });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
