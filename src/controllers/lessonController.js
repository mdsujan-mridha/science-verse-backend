
const Lesson = require("../models/LessonModel");
const Course = require("../models/CourseModel");

/**
 * ➕ Add Lesson (Admin)
 */
exports.addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, youtubeUrl, isPreview, duration } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lastLesson = await Lesson.find({ course: courseId })
            .sort({ order: -1 })
            .limit(1);

        const order = lastLesson.length ? lastLesson[0].order + 1 : 1;

        const lesson = await Lesson.create({
            title,
            course: courseId,
            youtubeUrl,
            isPreview: isPreview || false,
            duration,
            order,
        });

        course.lessons.push(lesson._id);
        await course.save();

        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// re-oder lessons
exports.reorderLessons = async (req, res) => {
    try {
        const { courseId, orders } = req.body;

        const bulkOps = orders.map(item => ({
            updateOne: {
                filter: { _id: item.lessonId, course: courseId },
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

        const lessons = await Lesson.find(filter).sort({ order: 1 });

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

