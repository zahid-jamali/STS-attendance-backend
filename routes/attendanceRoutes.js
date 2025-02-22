const express = require("express");
const {markEntry, markExit, getUsersAttendanceByDate, getUserAttendance, adminCreatesAttendance} = require("../controllers/attendanceControllers.js");
const routes = express.Router(); 

routes.post("/entry", markEntry);
routes.post("/exit", markExit);
routes.post("/getUsersAttendanceByDate", getUsersAttendanceByDate)
routes.post("/getUserAttendance", getUserAttendance);
routes.post("/admin-creates-attendance", adminCreatesAttendance);

module.exports = routes; 
