const Leaves=require("../models/leaves");
const Holidays=require("../models/holidays");




const getLeavesForUsers=async(req, res, next)=>{
	try{
		const {userId, }=req.body;
		const leaves=await Leaves.find({user:userId});
		const holidays=await Holidays.find();
		res.status(200).json({"Leaves":leaves, "Holidays":holidays}) 
	}catch(e){
		console.log(e);
		res.status(500).json({message:"Internal server error"})
	}
}


const getLeaves=async(req, res,next)=>{
	try{
		const L=await Leaves.find({ "user.is_Active": true }).populate("user");
		const H=await Holidays.find();
		res.status(200).json({"Leaves":L, "Holidays":H});
	}catch(e){
		console.log(e);
		res.status(500).json({message:"Internal server error"})
	}
}


const updateLeave=async (req, res, next)=>{
	const {leaveId, status}=req.body;
	try{
		const L=await Leaves.findById(leaveId);
		L.Status=status;
		await L.save();
		res.status(200).json({message:"Successfully done!"});
	}catch(e){
		console.log(e);
		res.status(500).json({message:"Internal server error!"});
	}
}



const applyLeave=async(req, res, next)=>{
	const {userId, title, desc, fromDate, toDate}=req.body;
	try{
		const L=new Leaves({user:userId, Title:title, Description: desc, fromDate:fromDate, toDate:toDate});
		await L.save();
		console.log("Leave request");
		res.status(200).send({message:"Successfully submitted!"});
	}catch(e){
		console.log(e);
		res.status(500).json({message: "Internal server Error"})
	}
}

module.exports={applyLeave, updateLeave, getLeaves, getLeavesForUsers};