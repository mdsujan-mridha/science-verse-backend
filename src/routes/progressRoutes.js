
const express = require("express");
const router = express.Router();


const authMiddleware = require("../middlewares/authMiddlewares");
const isEnrolled = require("../middlewares/isEnrolled");
const progressController = require("../controllers/progressController");


router.post(
  "/lesson/:lessonId/complete",

  progressController.markLessonCompleted
);

router.get(
  "/course/:courseId/progress",

  progressController.getCourseProgress
);

router.get(
  "/course/:courseId/continue",

  progressController.continueCourse
);

module.exports = router;