const Project = require("../models/project");



const deleteGoal = async (req, res) => {
    const { goalId } = req.body; 
    try {
        let project = await Project.findOne({ "Goals._id": goalId });

        project.Goals = project.Goals.filter(goal => goal._id.toString() !== goalId);
        
        await project.save(); // Save the updated project

        res.status(200).json({ message: "Goal deleted successfully!" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error!" });
    }
};








const createGoal=async(req, res)=>{
	console.log(req.body);
	const {projectId, goal, userId}=req.body;
	try{
		let project=await Project.findById(projectId);
		

		if (!Array.isArray(project.Goals)) {
            project.Goals = [];
        }

        project.Goals.push({ Goal: goal, User: userId });
		await project.save();
		res.status(200).json({message:"Goal Added"});
	}catch(e){
		console.error(e);
		res.status(500).json({message:"Internal server error! "});
	}
}





const submitGoal = async (goal) => {
    try {
        const project = await Project.findOne({ "Goals._id": goal._id });

        if (!project) {
            console.error("Project not found!");
            return;
        }

        const g = project.Goals.id(goal._id);
        if (!g) {
            console.error("Goal not found!");
            return;
        }

        g.Status = goal.Status;
        g.Steps+=1; 
        project.markModified("Goals"); // Ensure Mongoose tracks the change
        await project.save();

        console.log(`Goal was updated successfully`);
    } catch (error) {
        console.error("Error updating goal:", error);
    }
};






module.exports ={createGoal, submitGoal, deleteGoal};