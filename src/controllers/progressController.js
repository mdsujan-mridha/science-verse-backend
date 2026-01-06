

const Progress = require("../models/ProgressModel");
const Lesson = require("../models/LessonModel");

exports.markLessonCompleted = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { lessonId } = req.params;
    const { courseId } = req.body;

    await Progress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      {
        user: userId,
        course: courseId,
        lesson: lessonId,
        completed: true,
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Lesson marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { courseId } = req.params;

    const totalLessons = await Lesson.countDocuments({ course: courseId });

    const completedLessons = await Progress.countDocuments({
      user: userId,
      course: courseId,
      completed: true,
    });

    const progress =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    res.json({
      totalLessons,
      completedLessons,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.continueCourse = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const { courseId } = req.params;

    const lastLesson = await Progress.findOne({
      user: userId,
      course: courseId,
    })
      .sort({ updatedAt: -1 })
      .populate("lesson", "title");

    res.json(lastLesson ? lastLesson.lesson : null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
