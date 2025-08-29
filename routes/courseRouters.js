const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middlewares/auth");

router.post("/", auth(["superadmin"]), courseController.addCourse);
router.post("/:id/enroll", auth(["student", "superadmin"]), courseController.enrollStudents);
router.post("/:id/assign-teacher", auth(["superadmin"]), courseController.assignTeacher);
router.get("/:id/sessions", courseController.getCourseSessions);
router.get("/", courseController.getCourses);

module.exports = router;