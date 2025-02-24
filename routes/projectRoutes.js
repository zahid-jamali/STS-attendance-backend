const express=require("express");
const {createProject, getMyProjects, getAllProjects, updateProject} =require("../controllers/projectControllers.js");

const routes=express.Router();

routes.post("/create-project", createProject);
routes.post("/get-my-projects", getMyProjects);
routes.get("/get-all-projects", getAllProjects);
routes.put("/update-project", updateProject)


module.exports=routes;