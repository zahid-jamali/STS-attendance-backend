const express=require("express");
const {createComplain, getAllComplains, updateComplain}=require("../controllers/complainControllers.js")

const routes=express.Router();

routes.post("/create-complain", createComplain);
routes.get("/get-all-complains", getAllComplains);
routes.put("/update-complain", updateComplain);


module.exports=routes;