const { Teacher , Student , Course } = require('../models');

// POST /courses → Add a course
exports.addCourse = async ( req, res , next) => {
    try{
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
}

// POST /courses/:id/enroll → Enroll students to a course
exports.enrollStudents = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { rollNumber } = req.body;

    // 1. Find course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Find student by roll number
    const student = await Student.findOne({ where: { roll_number: rollNumber } });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 3. Check if already enrolled
    const enrolledStudents = await course.getStudents({ where: { id: student.id } });
    if (enrolledStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Student with roll number ${rollNumber} is already enrolled in course ${course.name}`
      });
    }

    // 4. Enroll
    await course.addStudent(student);

    res.status(200).json({ success: true, message: `Student enrolled successfully in course ${course.name}` });
  } catch (error) {
    next(error);
  }
};


// ASSIGN TEACHER TO COURSE
exports.assignTeacher = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { teacherId } = req.body;

    // 1. Find course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Find teacher
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    //3.  check already assigned
    const assignedTeacher = await course.getTeacher();
    if (assignedTeacher) {
      return res.status(400).json({
        success: false,
        message: `Course ${course.name} already has a teacher assigned`
      });
    }

    // 4. Assign teacher to course
    await course.setTeacher(teacher);

    res.status(200).json({ success: true, message: `Teacher ${teacher.name} assigned to course ${course.name}` });
  } catch (error) {
    next(error);
  }
};


// GET /courses/:id/sessions → Get all sessions for a course
exports.getCourseSessions = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // 1. Find course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Get sessions
    const sessions = await course.getSessions();

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
};

// GET COURSES
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      // include assign teacher name  and including enroll students name also
      include: [
        {
          model: Teacher,
          attributes: ["id", "name"]
        },
        {
          model: Student,
          attributes: ["id", "name", "roll_number"],
          through: {
            attributes: []
          }
        }
      ]
    });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};
