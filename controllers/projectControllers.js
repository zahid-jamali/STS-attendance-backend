const Project=require("../models/project");

// Route is not setisfied for the this controller
const updateProject=async(req, res, next)=>{
	const {projectId, title, type, desc, deadline, team, is_active}=req.body;

	try{
		let project=await Project.find({_id: projectId});
		project.Title=title;
		project.ProjectType=type;
		project.Description=desc;
		project.Deadline=deadline;
		proejct.Team=team;
		project.is_Active=is_active;
		await project.save();
		res.status(200).json({message:"Project updated successfully!"});
	}catch(e){
		console.error(e);
		res.status(500).json({message:"Internal server error!"});
	}
}




const getAllProjects=async (req, res, next)=>{
	try{
		const P=await Project.find().populate("Team");
		res.status(200).json(P);
	}catch(e){
		console.log(e);
		res.status(500).json({message:"Error! "})
	}
}



const getMyProjects=async (req, res, next)=>{
	const {user}=req.body;
	try{
		let projects=await Project.find({Team: user});
		return res.status(200).json({projects});
	}
	catch(e){
		console.error(e);
		res.status(500).json({message:"Internal Server Error!"})
	}
}


const createProject=async (req, res, next)=>{
	const {title, type, desc, deadline, team, is_active}=req.body;
	try{
		if(!title || !type || !desc || !deadline || !team){
			return res.status(400).json({message:"Please provide all the fields!"})
		}

		const project=new Project({Title:title, ProjectType: type, Description: desc, Deadline: deadline, Team: team, is_Active: is_active});
		await project.save()
		console.log(title, " Project Initialized!");
		res.status(200).json({message:"Project successfully created!"});

	}catch(e){
		console.error(e);
		res.status(500).json({message: "Internal Server Error!"});
	}
}

module.exports={createProject, getMyProjects, getAllProjects};