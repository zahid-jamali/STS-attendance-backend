const express = require("express");
const {markEntry, markExit, getUsersAttendanceByDate, getUserAttendance} = require("../controllers/attendanceControllers.js");
const routes = express.Router(); 

routes.post("/entry", markEntry);
routes.post("/exit", markExit);
routes.post("/getUsersAttendanceByDate", getUsersAttendanceByDate)
routes.post("/getUserAttendance", getUserAttendance);

module.exports = routes; 
