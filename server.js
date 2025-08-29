const express = require("express");
const db = require('./models')
const cors = require('cors')
const auth = require("./middlewares/auth");


const app = express();
const PORT = 5000;

// Middleware: body parser
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.use(cors({
  origin: "http://localhost:3000"   // REACT FRONTEND
}));



// ✅ Mount routes
app.use("/auth", require("./routes/authRouters"));
app.use('/students' , require('./routes/studentRoutes'))
app.use('/teachers' , require('./routes/teacherRoutes'));
app.use('/courses' , require('./routes/courseRouters'));
app.use('/sessions' , require('./routes/sessionRouters'))



// Error Middleware
app.use(require("./middlewares/errorHandler"));

db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Tables synced");
});
















// db.sequelize
//   .sync({ alter: true }) // use { force: true } only in dev (drops tables)
//   .then(() => {
//     console.log("✅ Tables synced successfully!");
//   })
//   .catch((err) => {
//     console.error("❌ Error syncing tables:", err);
//   });


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
