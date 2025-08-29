// controllers/students.js
const { Student, User, Course, sequelize } = require('../models'); 


// POST /students
exports.addStudent = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, roll_number, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.create(
      { email, password, role: 'student' },
      { transaction: t, individualHooks: true }
    );

    const student = await Student.create(
      { name, email, roll_number, department, userId: user.id },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        roll_number: student.roll_number,
        department: student.department,
        user: { id: user.id, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// GET /students → list with courses
exports.getAllStudents = async (req, res, next) => {
  try {
    const where = {};
    // 👇 agar student hai, sirf apna record:
    if (req.user?.role === 'student') {
      where.userId = req.user.id;
    }

    const students = await Student.findAll({
      where,
      attributes: ['id', 'name', 'email', 'roll_number', 'department'],
      include: [
        { model: Course, as: 'Courses', attributes: ['id', 'name', 'code'], through: { attributes: [] } }
      ],
      order: [['id', 'ASC']]
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};