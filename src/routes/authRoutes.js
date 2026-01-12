

const express = require("express");

const router = express.Router();
const auth = require("../middlewares/authMiddlewares");
const { getMyEnrolledCourses, getMe } = require("../controllers/authController");

router.get("/me", auth, getMe);
router.get("/enrolled-courses", auth, getMyEnrolledCourses);


module.exports = router;