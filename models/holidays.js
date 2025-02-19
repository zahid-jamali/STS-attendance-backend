const mongoose=require("mongoose");


const schema=mongoose.Schema({
	Title:{
		type:String,
		required:true
	},
	HolidayDate:{
		type:Date,
		required: true,
	},
	informedDate:{
		type:Date,
		default: Date.now,
	}
})

const Holiday=mongoose.model("Holiday", schema);
module.exports=Holiday;