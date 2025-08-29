const { Sequelize } = require("sequelize");


require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,   // database name
  process.env.DB_USER,   // username
  process.env.DB_PASS,   // password
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false, // console par raw SQL queries hide karne ke liye
  }
);

module.exports = sequelize;
