// routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionConroller");

router.post("/", sessionController.scheduleSession);

module.exports = router;
