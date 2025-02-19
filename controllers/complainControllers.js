const Complains=require("../models/complains.js")





const updateComplain = async (req, res, next) => {
  const { complainId, status } = req.body;
  try {
    const comp = await Complains.findById(complainId);
    
    if (!comp) {
      return res.status(404).json({ message: "Complain not found" });
    }
    comp.Status = status;
    comp.readDate = Date.now();

    await comp.save();
    res.status(200).json({ message: "Complain updated successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllComplains=async(req, res, next)=>{
	try{
		const complains=await Complains.find();
		res.status(200).json(complains);
	}catch(e){
		console.error(e);
		res.status(500).json(e);
	}
}




const createComplain=async(req, res, next)=>{
	const {userId, title, desc}=req.body;
	try{
		const comp=new Complains({user:userId, Title:title, Description: desc});
		await comp.save();
		console.log(comp)
		res.status(200).send({message:"Submitted successfully"})
	}
	catch(e){
		console.log(e);
		res.status(500).json({message:"Internal server error"})
	}
}

module.exports={createComplain, getAllComplains, updateComplain}