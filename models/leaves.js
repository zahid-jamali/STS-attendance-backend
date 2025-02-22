const mongoose=require("mongoose");

const schema=mongoose.Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
	Title:{
		type:String,
		required:true
	},
	Description:{
		type:String,
		required:true,
	},
	fromDate:{
		type:Date,
		required: true,
	}, 
	toDate:{
		type:Date,
		required:true,
	},
	Status:{
		type:String,
		default:"Pending",
	}
})

const leaves=mongoose.model("leaves", schema);
module.exports=leaves;