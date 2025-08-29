// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
//   console.error(err);

  // Sequelize unique constraint error handle
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      success: false,
      message: `Duplicate value entered for ${err.errors[0].path}: ${err.errors[0].value}`,
    });
  }

  // Sequelize validation error handle
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message).join(", "),
    });
  }

  // Default
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
