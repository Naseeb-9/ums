// controllers/sessionController.js
const { Session, Course, Teacher } = require('../models');

exports.scheduleSession = async (req, res, next) => {
  try {
    const { course_id, teacher_id, date, time } = req.body;

    // 1. Check course
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Check teacher
    const teacher = await Teacher.findByPk(teacher_id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    
    // IF SESSION ALREADY ASSIGNED AT THAT TIME
    const existingSession = await Session.findOne({ where: { course_id, teacher_id, date, time } });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "Session already scheduled at this time"
      });
    }

    // 4. Create session
    const session = await Session.create({
      course_id,
      teacher_id,
      date,
      time
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};
