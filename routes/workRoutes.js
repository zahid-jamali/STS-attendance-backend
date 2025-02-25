const express=require("express");
const { getProjectWork}=require("../controllers/worksControllers.js")

const routes=express.Router();

routes.post("/get-my-works",  getProjectWork);


module.exports=routes;