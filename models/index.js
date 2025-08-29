const sequelize = require('../config/db');

const Student = require('./studentModel');
const Teacher = require('./teacherModel');
const Course = require('./courseModel');
const Session = require('./classSessionModel');
const User = require('./userModel');


Student.belongsToMany(Course,{
    through: 'StudentCourses',
    foreignKey: 'student_id',
    otherKey: 'course_id'
});
Course.belongsToMany(Student,{
    through: 'StudentCourses',
    foreignKey: 'course_id',
    otherKey: 'student_id'
});


// Teacher Course (One-to-Many)
Teacher.hasMany(Course, { foreignKey: "teacher_id" });
Course.belongsTo(Teacher, { foreignKey: "teacher_id" });


// Course Session (One-to-Many)
Course.hasMany(Session,{ foreignKey: 'course_id' });
Session.belongsTo(Course,{ foreignKey: 'course_id' });


// Teacher  Session (One-to-Many)
Teacher.hasMany(Session,{ foreignKey: 'teacher_id' });
Session.belongsTo(Teacher,{ foreignKey: 'teacher_id' });



User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });


// User ↔ Teacher (1:1)
User.hasOne(Teacher, { foreignKey: 'userId', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'userId' });



module.exports = {
  sequelize,
  Student,
  Teacher,
  Course,
  Session,
  User

};
