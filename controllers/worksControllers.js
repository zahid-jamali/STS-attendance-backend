const Works = require("../models/works.js");

const makeMyWork = async (projectId, userId, works) => {
    try {
        const work = new Works({ Project: projectId, User: userId, Work: works });
        await work.save(); 
        console.log(`Work created by: ${userId}`);
    } catch (error) {
        console.error("Error creating work:", error);
    }
};

module.exports = { makeMyWork };
