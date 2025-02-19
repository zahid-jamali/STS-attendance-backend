const express=require("express");
const {applyLeave, updateLeave, getLeaves, getLeavesForUsers}=require("../controllers/leaveControllers.js")

const routes=express.Router();

routes.post("/apply-leave", applyLeave);
routes.put("/update-leave", updateLeave);
routes.get("/get-leaves", getLeaves);
routes.post("/get-leaves-for-users", getLeavesForUsers);


module.exports=routes;