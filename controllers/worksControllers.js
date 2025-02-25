const Works = require("../models/works.js");


// Route is not set for this controller
const getProjectWork=async(req, res,next)=>{
    const {projectId}=req.body;
    try{
        let works=await Works.find({Project: projectId}).populate("User Project");
        res.status(200).json(works);
    }catch(e){
        console.log(e);
        res.status(500).json({message:"Internal server error"});
    }
}






const makeMyWork = async (projectId, userId, works) => {
    try {
        const work = new Works({ Project: projectId, User: userId, Work: works });
        await work.save(); 
        console.log(`Work created by: ${userId}`);
    } catch (error) {
        console.error("Error creating work:", error);
    }
};

module.exports = { makeMyWork,  getProjectWork, };
