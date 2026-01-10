

const express = require("express");
const auth = require("../middlewares/authMiddlewares");
const adminOnly = require("../middlewares/adminMiddleware");

const {
    createCourse,
    togglePublishCourse,
    getAllCourses,
    getSingleCourse,
    getCourseDetails
} = require("../controllers/courseControlller");

const router = express.Router();

// Define your course routes here
//  admin 
router.post("/", createCourse);
router.patch("/:id/publish", togglePublishCourse);

// public 

router.get("/", getAllCourses);
router.get("/:slug", getSingleCourse);
router.get("/course/:slug", getCourseDetails);


module.exports = router;