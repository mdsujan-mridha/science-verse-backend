

const express = require("express");
const router = express.Router();

const firebaseAuth = require("../middlewares/adminMiddleware");
const {
  createChapter,
  reorderChapters,
  getChaptersByCourse,
} = require("../controllers/chapterController");

/**
 * 📚 Get chapters of a course
 */
router.get("/course/:courseId", getChaptersByCourse);

/**
 * ➕ Create chapter (Admin)
 */
router.post(
  "/course/:courseId",
  
  createChapter
);

/**
 * 🔁 Reorder chapters
 */
router.put(
  "/reorder",
 
  reorderChapters
);

module.exports = router;
