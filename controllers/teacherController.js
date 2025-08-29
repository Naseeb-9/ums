const { Teacher, User, Course,Student, sequelize } = require('../models');


exports.addTeacher = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'name, email, password, department required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // 1) Create User with role 'teacher' (bcrypt hook will hash)
    const user = await User.create(
      { email, password, role: 'teacher' },
      { transaction: t, individualHooks: true }
    );

    // 2) Create Teacher linked to user
    const teacher = await Teacher.create(
      { name, email, department, userId: user.id },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      data: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        user: { id: user.id, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors?.[0]?.message || 'Validation error' });
    }
    next(error);
  }
};

// GET /teachers → Get all teachers with their courses
exports.getallTeachers = async (req, res, next) => {
  try {
    const where = {};
    if (req.user?.role === 'teacher') {
      where.userId = req.user.id; // sirf apni record
    }

    const teachers = await Teacher.findAll({
      where,
      attributes: ['id', 'name', 'email', 'department'],
      include: [
        {
          model: Course,
          as: 'Courses',                     // 🔹 MUST match association alias
          attributes: ['id', 'name', 'code'],
          // ❌ through yahan mat lagao; hasMany me through nahi hota
          include: [
            {
              model: Student,
              as: 'Students',                // 🔹 MUST match association alias
              attributes: ['id', 'name', 'roll_number'],
              through: { attributes: [] },   // ✅ only here (belongsToMany)
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });

    res.json({ success: true, data: teachers });
  } catch (err) {
    // helpful error
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};