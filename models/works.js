const mongoose=require("mongoose");

const schema=mongoose.Schema({
	Project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", 
        required: true
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    Work:{
    	type: String,
    	required: true,
    },
    date:{
    	type:Date,
    	default: Date.now,
    	required: true
    }
})

Works=mongoose.model("Works", schema);
module.exports=Works;