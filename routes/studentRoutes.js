const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middlewares/auth");


router.post("/" ,auth(["superadmin"]), studentController.addStudent);
router.get("/", auth(["superadmin" , "student"]), studentController.getAllStudents);


module.exports = router;