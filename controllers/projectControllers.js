const Project = require("../models/project");

const updateProject = async (req, res, next) => {
  const { projectId, title, type, desc, deadline, team, is_active } = req.body;
  console.log(req.body);

  try {
    let project = await Project.findById(projectId); // Find by ID

    if (!project) {
      return res.status(404).json({ message: "Project not found!" });
    }

    // Update fields
    project.Title = title;
    project.ProjectType = type;
    project.Description = desc;
    project.Deadline = deadline;
    project.Team = team;
    project.is_Active = is_active;

    await project.save(); // Save changes

    res.status(200).json({ message: "Project updated successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error!" });
  }
};

module.exports = updateProject;





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

module.exports={createProject, getMyProjects, getAllProjects, updateProject};