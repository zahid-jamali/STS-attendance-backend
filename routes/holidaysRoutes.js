const express=require("express");
const {addHolidays, } = require("../controllers/holidaysControllers");

const routes=express.Router();

routes.post("/add-holiday", addHolidays);


module.exports=routes;