// models/userModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING, allowNull: false, unique: true,
    validate: { notEmpty: { msg: 'Email is required' }, isEmail: { msg: 'Invalid email format' } },
    set(value) { this.setDataValue('email', value.toLowerCase()); }
  },
  password: {
    type: DataTypes.STRING, allowNull: false,
    validate: { notEmpty: { msg: 'Password is required' } }
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'superadmin'),
    allowNull: false, defaultValue: 'student'
  }
}, {
  hooks: {
    // bcryptjs: use sync helpers
    beforeCreate(user) {
      if (user.password) user.password = bcrypt.hashSync(user.password, 10);
    },
    beforeUpdate(user) {
      if (user.changed('password')) user.password = bcrypt.hashSync(user.password, 10);
    }
  },
  defaultScope: { attributes: { exclude: ['password'] } },
  scopes: {
    withPassword: { attributes: { include: ['password'] } } // use in login
  }
});

module.exports = User;
