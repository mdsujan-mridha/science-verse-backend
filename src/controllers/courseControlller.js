const Course = require("../models/CourseModel");
const Lesson = require("../models/LessonModel");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Admin
 */
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail,
      price,
      discountPrice,
      level,
      subject,
      isFree,
    } = req.body;

    const exists = await Course.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const course = await Course.create({
      title,
      slug,
      description,
      thumbnail,
      price,
      discountPrice,
      level,
      subject,
      isFree,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Course creation failed",
    });
  }
};

/**
 * @desc    Publish / Unpublish course
 * @route   PATCH /api/courses/:id/publish
 * @access  Admin
 */
exports.togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${
        course.isPublished ? "published" : "unpublished"
      }`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Publish action failed",
    });
  }
};

/**
 * @desc    Get all published courses
 * @route   GET /api/courses
 * @access  Public
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/**
 * @desc    Get single course with lessons
 * @route   GET /api/courses/:slug
 * @access  Public
 */
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("createdBy", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lessons = await Lesson.find({ course: course._id })
      .sort({ order: 1 })
      .select("-videoId"); // hide videoId for non-enrolled users

    res.status(200).json({
      success: true,
      data: {
        course,
        lessons,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};
