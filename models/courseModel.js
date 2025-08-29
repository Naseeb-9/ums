const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define("Course",{

    id : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Name is required" },
        },
        set(value) {
            this.setDataValue('name', value.toLowerCase());
        }
    },
    code : {
        type : DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
             notEmpty: { msg: "Course code is required." },
        }

    },
    credits : {
        type : DataTypes.INTEGER,
        allowNull: false,
        validate : {
             notEmpty: { msg: "Course credit is required." },
        }
    }

});

module.exports = Course