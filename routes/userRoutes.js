const express = require("express");
const {login, createUser, getAllUsers, updateUser, getTotalUsers} = require("../controllers/userControllers.js");
const routes = express.Router(); 

routes.post("/login", login);
routes.get("/getAllUsers", getAllUsers);
routes.put("/updateUser", updateUser);
routes.post("/create-user", createUser);
routes.get("/get-total-users", getTotalUsers)

module.exports = routes; 
