const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Session = sequelize.define("Session", {
    id :{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date :
    {
        type : DataTypes.DATE,
        allowNull: false,
        validate : {
             notEmpty: { msg: "Date is required" },
        }
    },
    time : {
        type : DataTypes.TIME,
        allowNull: false,
        validate : {
             notEmpty: { msg: "Time is required" },
        }
    }
   


});

module.exports = Session;