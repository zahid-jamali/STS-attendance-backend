const express=require("express");
const { createGoal, deleteGoal}=require("../controllers/goalsControllers")

const routes=express.Router();

routes.post("/create-goal", createGoal);
routes.post("/delete-goal", deleteGoal)


module.exports=routes;