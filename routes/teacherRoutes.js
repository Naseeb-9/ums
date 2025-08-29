const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require("../middlewares/auth");


router.post('/', auth(["superadmin"]), teacherController.addTeacher);
router.get('/', auth(["superadmin", "teacher"]), teacherController.getallTeachers);

module.exports = router;