

const express = require("express"); 

const lessonCtrl = require("../controllers/lessonController");
const auth = require("../middlewares/authMiddlewares");
const adminOnly = require("../middlewares/adminMiddleware");

const router = express.Router();


router.post(
  "/chapter/:chapterId",
  lessonCtrl.addLesson
);

router.put(
  "/reorder",
  lessonCtrl.reorderLessons
);

router.get(
  "/course/:courseId",
  auth,
  lessonCtrl.getLessonsByCourse
);

module.exports = router;