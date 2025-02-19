const express = require("express");
const {login, createUser, getAllUsers, updateUser} = require("../controllers/userControllers.js");
const routes = express.Router(); 

routes.post("/login", login);
routes.get("/getAllUsers", getAllUsers);
routes.put("/updateUser", updateUser);
routes.post("/create-user", createUser);

module.exports = routes; 
