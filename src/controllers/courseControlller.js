const Course = require("../models/CourseModel");
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Admin
 */
exports.createCourse = async (req, res) => {
  // console.log("Creating course with data:", req.body);
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
    console.log("Error creating course:", error);
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
      message: `Course ${course.isPublished ? "published" : "unpublished"
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
  // console.log("Fetching course with slug:", req.params.slug);
  try {
    const course = await Course.findOne({
      slug: req.params.slug,
      isPublished: true,
    })
      .populate("createdBy", "name")
      .lean();
    // console.log("Found course:", course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // console.log("Fetching chapters for course ID:", course._id);

    const chapters = await Chapter.find({ course: course._id })
      .sort({ order: 1 })
      .lean();

    for (let chapter of chapters) {
      chapter.lessons = await Lesson.find({
        chapter: chapter._id,
        isPreview: true,
      })
        .sort({ order: 1 })
        .select("title duration isPreview");
    }

    res.status(200).json({
      success: true,
      data: {
        course,
        chapters,
      },
    });
  } catch (error) {
    // console.log("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// get course details with lessons 
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const isEnrolled = req.user?.enrolledCourses?.some(
      id => id.toString() === courseId
    );

    const chapters = await Chapter.find({ course: courseId })
      .sort({ order: 1 })
      .lean();

    for (let chapter of chapters) {
      chapter.lessons = await Lesson.find(
        isEnrolled
          ? { chapter: chapter._id }
          : { chapter: chapter._id, isPreview: true }
      ).sort({ order: 1 });
    }

    res.json({ chapters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

