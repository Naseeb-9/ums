const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Teacher = sequelize.define("Teacher",{
    id :{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Name is required" }
        }
    },
    email : {
        type : DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
            notEmpty: { msg: "Email is required" },
            isEmail: { msg: "Invalid email format" }
        },
        // Convert email to lowercase
        set(value) {
            this.setDataValue("email", value.toLowerCase());
        }
    },
    department : {
        type : DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: { msg: "Department is required" }
        },
        set(value) {
            this.setDataValue("department", value.toLowerCase());
        }
    },
    userId: {                        // <-- NEW
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = Teacher