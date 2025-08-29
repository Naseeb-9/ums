const { DataTypes  } = require('sequelize');
const sequelize = require("../config/db")

const Student = sequelize.define("Student", {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Name is required" },
        }
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Email is required" },
            isEmail: { msg: "Invalid email format" }, 
            
    },
    set(value) {
            this.setDataValue("email", value.toLowerCase());
        }
    },
    roll_number : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "Roll number is required" },
        },
        set(value) {
            this.setDataValue("roll_number", value.toLowerCase());
        }
    },
    department : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Department is required" },
        },
        set(value) {
            this.setDataValue("department", value.toLowerCase());
        }
    }
});

module.exports = Student