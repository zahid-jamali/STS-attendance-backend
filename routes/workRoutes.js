const express=require("express");
const { getProjectWork, getMyWork}=require("../controllers/worksControllers.js")

const routes=express.Router();

routes.post("/get-my-works",  getProjectWork);
routes.post("/getMyWork", getMyWork)

module.exports=routes;