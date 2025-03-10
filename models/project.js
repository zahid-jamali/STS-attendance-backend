const mongoose=require("mongoose");

const schema=mongoose.Schema({
	Title:{
		type:String,
		required: true,
	},
	ProjectType:{
		type:String,
		required: true,
	},
	Description:{
		type:String,
		required: true,
	},
	Deadline:{
		type:Date,
		required: true,
	},
	Goals:[{
		Goal:{
			type:String,
			required: true,
		},
		User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    	},
    	Status:{
    		type: Number,
    		default:0,
    	},
    	Completion_Date:{
    		type:Date,
    	},
    	Steps:{
    		type:Number,
    		default: 0
    	}
	}],
	Team:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }],
    is_Active:{
    	type: Boolean,
    	default: false,
    }

})

module.exports=mongoose.model("Project", schema);  