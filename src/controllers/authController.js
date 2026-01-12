const User = require("../models/UserModel");

/**
 * @desc    Sync firebase user & return profile
 * @route   POST /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
        enrolledCourses: user.enrolledCourses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/**
 * @desc    Update user profile (name / photo)
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, photoURL } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, photoURL },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};


// get Enrolled Courses

/**
 * @desc    Get logged-in user's enrolled courses
 * @route   GET /api/auth/enrolled-courses
 * @access  Private
 */
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "enrolledCourses",
        match: { isPublished: true },
        select: `
          title 
          slug 
          thumbnail 
          subject 
          level 
          totalLessons 
          studentsCount
        `,
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Temporary progress mock (real progress comes later)
    const courses = user.enrolledCourses.map(course => ({
      ...course,
      progress: 0,
      completedLessons: 0,
      nextLesson: null,
    }));

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};

