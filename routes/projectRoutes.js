const express=require("express");
const {createProject, getMyProjects, getAllProjects} =require("../controllers/projectControllers.js");

const routes=express.Router();

routes.post("/create-project", createProject);
routes.post("/get-my-projects", getMyProjects);
routes.get("/get-all-projects", getAllProjects);


module.exports=routes;