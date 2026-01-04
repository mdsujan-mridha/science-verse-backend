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
