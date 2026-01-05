

const Chapter = require("../models/ChapterModel");
const Course = require("../models/CourseModel");

/**
 * ➕ Create Chapter (Admin)
 */
exports.createChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Chapter title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lastChapter = await Chapter.find({ course: courseId })
      .sort({ order: -1 })
      .limit(1);

    const order = lastChapter.length ? lastChapter[0].order + 1 : 1;

    const chapter = await Chapter.create({
      title,
      course: courseId,
      order,
    });

    course.chapters.push(chapter._id);
    await course.save();

    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔁 Reorder Chapters
 */
exports.reorderChapters = async (req, res) => {
  try {
    const { courseId, orders } = req.body;

    const bulkOps = orders.map(item => ({
      updateOne: {
        filter: { _id: item.chapterId, course: courseId },
        update: { order: item.order },
      },
    }));

    await Chapter.bulkWrite(bulkOps);

    res.json({ message: "Chapters reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📚 Get Chapters by Course
 */
exports.getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const chapters = await Chapter.find({ course: courseId })
      .sort({ order: 1 });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
