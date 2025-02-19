const Holidays=require("../models/holidays");



const addHolidays=async(req, res, next)=>{
	const {title, date}=req.body;
	try{
		let holiday=new Holidays({Title:title, HolidayDate:date});
		await holiday.save();
		res.status(200).send({message:"updated successfully"})
	}catch(e){
		console.error(e)
		res.status(500).json({message:"Internal server error"})
	}
}

module.exports={addHolidays, }