
const Lesson = require("../models/LessonModel");
const Course = require("../models/CourseModel");
const Chapter = require("../models/ChapterModel");


/**
 * ➕ Add Lesson (Admin) — Chapter based
 */
exports.addLesson = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title, youtubeUrl, isPreview, duration } = req.body;

    if (!title || !youtubeUrl) {
      return res.status(400).json({ message: "Title & YouTube URL required" });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Order inside chapter
    const lastLesson = await Lesson.find({ chapter: chapterId })
      .sort({ order: -1 })
      .limit(1);

    const order = lastLesson.length ? lastLesson[0].order + 1 : 1;

    const lesson = await Lesson.create({
      title,
      youtubeUrl,
      duration,
      isPreview: isPreview || false,
      chapter: chapterId,
      course: chapter.course,
      order,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// re-oder lessons
exports.reorderLessons = async (req, res) => {
  try {
    const { chapterId, orders } = req.body;
   
    const bulkOps = orders.map(item => ({
      updateOne: {
        filter: { _id: item.lessonId, chapter: chapterId },
        update: { order: item.order },
      },
    }));

    await Lesson.bulkWrite(bulkOps);

    res.json({ message: "Lessons reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// get lessons (preview vs Paid 

exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const isEnrolled = req.user?.enrolledCourses?.some(
      id => id.toString() === courseId
    );

    const filter = isEnrolled
      ? { course: courseId }
      : { course: courseId, isPreview: true };

    const lessons = await Lesson.find(filter)
      .populate("chapter", "title order")
      .sort({ "chapter.order": 1, order: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


